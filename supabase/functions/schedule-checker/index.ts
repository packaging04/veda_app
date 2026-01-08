// ==================================================
// SUPABASE EDGE FUNCTION #1: schedule-checker
// Runs every minute via pg_cron to check for scheduled calls
// ==================================================

// File: supabase/functions/schedule-checker/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

    // Find calls scheduled for now (±5 minute window)
    const { data: calls, error } = await supabase
      .from("scheduled_calls")
      .select(
        `
        *,
        loved_ones(name, phone, favorite_things, profile_image_1, personality_notes),
        call_questions(
          question_order,
          questions(id, question_text, category)
        )
      `
      )
      .eq("call_status", "scheduled")
      .gte("scheduled_date", fiveMinutesAgo.toISOString())
      .lte("scheduled_date", fiveMinutesFromNow.toISOString())
      .lt("retry_count", "max_retries");

    if (error) throw error;

    console.log(`Found ${calls?.length || 0} calls to initiate`);

    // Initiate each call
    for (const call of calls || []) {
      try {
        // Call the initiator function
        const response = await fetch(
          `${Deno.env.get("BASE_URL")}/functions/v1/call-initiator`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
            },
            body: JSON.stringify({ callId: call.id }),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to initiate call: ${response.statusText}`);
        }
      } catch (error) {
        console.error(`Error initiating call ${call.id}:`, error);

        // Increment retry count
        await supabase
          .from("scheduled_calls")
          .update({
            retry_count: call.retry_count + 1,
            failure_reason: error.message,
          })
          .eq("id", call.id);
      }
    }

    return new Response(
      JSON.stringify({ success: true, callsProcessed: calls?.length || 0 }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Schedule checker error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
