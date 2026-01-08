// ==================================================
// SUPABASE EDGE FUNCTION #2: call-initiator
// Initiates the Twilio call
// ==================================================

// File: supabase/functions/call-initiator/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const { callId } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get call details
    const { data: call, error: callError } = await supabase
      .from("scheduled_calls")
      .select(
        `
        *,
        loved_ones(name, phone, favorite_things, personality_notes),
        call_questions(
          question_order,
          questions(question_text)
        )
      `
      )
      .eq("id", callId)
      .single();

    if (callError) throw callError;

    // Update status to initiating
    await supabase
      .from("scheduled_calls")
      .update({
        call_status: "initiating",
        call_started_at: new Date().toISOString(),
      })
      .eq("id", callId);

    // Log event
    await supabase.from("call_logs").insert({
      call_id: callId,
      event_type: "call_initiated",
      event_data: { phone: call.loved_ones.phone },
    });

    // Initiate Twilio call
    const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioPhone = Deno.env.get("TWILIO_PHONE_NUMBER");
    const baseUrl = Deno.env.get("BASE_URL");

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls.json`;
    const auth = btoa(`${accountSid}:${authToken}`);

    const twilioResponse = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: call.loved_ones.phone,
        From: twilioPhone,
        Url: `${baseUrl}/functions/v1/voice-webhook?callId=${callId}`,
        StatusCallback: `${baseUrl}/functions/v1/status-callback`,
        StatusCallbackEvent: "initiated,ringing,answered,completed",
        Record: "record-from-answer",
        RecordingStatusCallback: `${baseUrl}/functions/v1/recording-callback`,
        Timeout: "60",
      }).toString(),
    });

    const twilioData = await twilioResponse.json();

    if (twilioData.error_code) {
      throw new Error(twilioData.message);
    }

    // Save Twilio Call SID
    await supabase
      .from("scheduled_calls")
      .update({
        call_sid: twilioData.sid,
        call_status: "ringing",
      })
      .eq("id", callId);

    return new Response(
      JSON.stringify({ success: true, callSid: twilioData.sid }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Call initiator error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
