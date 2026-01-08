// ==================================================
// SUPABASE EDGE FUNCTION #4: recording-callback
// Processes completed call recordings
// ==================================================

// File: supabase/functions/recording-callback/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const formData = await req.formData();
    const recordingSid = formData.get("RecordingSid");
    const recordingUrl = formData.get("RecordingUrl");
    const callSid = formData.get("CallSid");
    const recordingDuration = formData.get("RecordingDuration");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Find call by Twilio SID
    const { data: call } = await supabase
      .from("scheduled_calls")
      .select("*, loved_ones(name)")
      .eq("call_sid", callSid)
      .single();

    if (!call) {
      throw new Error("Call not found");
    }

    // Download recording from Twilio
    const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const auth = btoa(`${accountSid}:${authToken}`);

    const audioResponse = await fetch(`${recordingUrl}.mp3`, {
      headers: { Authorization: `Basic ${auth}` },
    });

    if (!audioResponse.ok) {
      throw new Error("Failed to download recording");
    }

    const audioBlob = await audioResponse.blob();
    const audioBuffer = await audioBlob.arrayBuffer();

    // Upload to Supabase Storage
    const storagePath = `${call.user_id}/${call.id}/${recordingSid}.mp3`;
    const { error: uploadError } = await supabase.storage
      .from("call-recordings")
      .upload(storagePath, audioBuffer, {
        contentType: "audio/mpeg",
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Create recording entry
    const { error: recordingError } = await supabase.from("recordings").insert({
      user_id: call.user_id,
      loved_one_id: call.loved_one_id,
      call_id: call.id,
      title: `Call with ${call.loved_ones.name} - ${new Date(
        call.call_started_at
      ).toLocaleDateString()}`,
      recording_sid: recordingSid,
      recording_url: recordingUrl,
      storage_path: storagePath,
      duration_seconds: parseInt(recordingDuration),
      file_size_bytes: audioBuffer.byteLength,
      format: "mp3",
      processing_status: "completed",
    });

    if (recordingError) throw recordingError;

    // Update call status
    await supabase
      .from("scheduled_calls")
      .update({
        call_status: "completed",
        call_ended_at: new Date().toISOString(),
        actual_duration_seconds: parseInt(recordingDuration),
      })
      .eq("id", call.id);

    // Log completion
    await supabase.from("call_logs").insert({
      call_id: call.id,
      event_type: "recording_completed",
      event_data: {
        recording_sid: recordingSid,
        duration: recordingDuration,
        size: audioBuffer.byteLength,
      },
    });

    // Optional: Trigger transcription (you can add this later)
    // await triggerTranscription(call.id, storagePath);

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Recording callback error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
