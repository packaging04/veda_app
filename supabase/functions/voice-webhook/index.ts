// ==================================================
// SUPABASE EDGE FUNCTION #3: voice-webhook
// Returns TwiML to connect call to AI stream
// ==================================================

// File: supabase/functions/voice-webhook/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const callId = url.searchParams.get("callId");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get call context
    const { data: call } = await supabase
      .from("scheduled_calls")
      .select(
        `
        *,
        loved_ones(name, favorite_things, personality_notes),
        call_questions(
          question_order,
          questions(question_text)
        )
      `
      )
      .eq("id", callId)
      .single();

    // Update status
    await supabase
      .from("scheduled_calls")
      .update({
        call_status: "in_progress",
        call_answered_at: new Date().toISOString(),
      })
      .eq("id", callId);

    // Log event
    await supabase.from("call_logs").insert({
      call_id: callId,
      event_type: "call_answered",
    });

    // Generate TwiML to connect to AI stream
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="wss://${Deno.env
      .get("BASE_URL")
      ?.replace("https://", "")}/functions/v1/ai-stream?callId=${callId}">
      <Parameter name="lovedOneName" value="${call.loved_ones.name}" />
      <Parameter name="favoriteThings" value="${JSON.stringify(
        call.loved_ones.favorite_things || []
      )}" />
      <Parameter name="personalityNotes" value="${
        call.loved_ones.personality_notes || ""
      }" />
      <Parameter name="questionsCount" value="${call.call_questions.length}" />
    </Stream>
  </Connect>
</Response>`;

    return new Response(twiml, {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error) {
    console.error("Voice webhook error:", error);

    // Return TwiML error message
    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>We're sorry, but we're unable to connect your call at this time. Please try again later.</Say>
  <Hangup/>
</Response>`;

    return new Response(errorTwiml, {
      headers: { "Content-Type": "text/xml" },
    });
  }
});
