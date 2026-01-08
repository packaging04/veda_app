// ==================================================
// SUPABASE EDGE FUNCTION #5: status-callback
// Handles call status updates from Twilio
// ==================================================

// File: supabase/functions/status-callback/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const formData = await req.formData();
    const callSid = formData.get("CallSid");
    const callStatus = formData.get("CallStatus");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Map Twilio status to our status
    const statusMap: Record<string, string> = {
      initiated: "initiating",
      ringing: "ringing",
      "in-progress": "in_progress",
      completed: "completed",
      busy: "missed",
      "no-answer": "no_answer",
      canceled: "cancelled",
      failed: "failed",
    };

    const ourStatus = statusMap[callStatus as string] || callStatus;

    // Update call status
    await supabase
      .from("scheduled_calls")
      .update({ call_status: ourStatus })
      .eq("call_sid", callSid);

    // Log event
    const { data: call } = await supabase
      .from("scheduled_calls")
      .select("id")
      .eq("call_sid", callSid)
      .single();

    if (call) {
      await supabase.from("call_logs").insert({
        call_id: call.id,
        event_type: `call_${callStatus}`.replace("-", "_"),
        event_data: { twilio_status: callStatus },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Status callback error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

// ==================================================
// NOTE: AI Stream Handler (#6) is complex and requires WebSocket
// It will be a separate implementation that connects:
// 1. Twilio Media Streams (audio in/out)
// 2. OpenAI Realtime API (speech-to-speech)
// 3. Your conversation flow logic
//
// This requires a WebSocket server, which is better implemented
// using a dedicated service like:
// - Deno Deploy with WebSocket support
// - Node.js server with ws library
// - Python server with FastAPI/WebSockets
//
// The key flow is:
// Twilio Audio → Base64 μ-law → Your WS → OpenAI Realtime API
// OpenAI Response → Your WS → Base64 μ-law → Twilio Audio
// ==================================================
