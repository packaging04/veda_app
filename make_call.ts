import "https://deno.land/std@0.224.0/dotenv/load.ts";

/**
 * Production Call Initiator
 * Makes real calls to Nigerian phone numbers via Africa's Talking
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

// const CONFIG = {
//   AT_USERNAME: process.env.AT_USERNAME!,
//   AT_API_KEY: process.env.AT_API_KEY!,
//   AT_CALLER_ID: process.env.AT_CALLER_ID!,
//   CALLBACK_URL: process.env.CALLBACK_URL!,
// };

const CONFIG = {
  AT_USERNAME: Deno.env.get("AT_USERNAME") || "",
  CALLBACK_URL: Deno.env.get("CALLBACK_URL") || "",
  AT_CALLER_ID: Deno.env.get("AT_CALLER_ID") || "",
  AT_API_KEY: Deno.env.get("AT_API_KEY") || "",
};

for (const [key, value] of Object.entries(CONFIG)) {
  if (!value) {
    throw new Error(`❌ Missing env var: ${key}`);
  }
}

// ============================================================================
// TYPES
// ============================================================================

interface CallOptions {
  phoneNumber: string;
  callId?: string;
  lovedOneId?: string;
  lovedOneName?: string;
}

// ============================================================================
// CALL FUNCTION
// ============================================================================

export async function makeCall(options: CallOptions): Promise<any> {
  const {
    phoneNumber,
    callId = `call-${Date.now()}`,
    lovedOneId = "",
    lovedOneName = "there",
  } = options;

  if (!validateNigerianNumber(phoneNumber)) {
    throw new Error("Invalid Nigerian phone number format");
  }

  const formattedNumber = formatNigerianNumber(phoneNumber);

  console.log("📞 Initiating Production Call");
  console.log(`   To: ${formattedNumber}`);
  console.log(`   From: ${CONFIG.AT_CALLER_ID}`);
  console.log(`   CallID: ${callId}`);
  console.log(`   LovedOne: ${lovedOneName}`);

  // Attach metadata to callback URL
  const callbackUrl =
    `${CONFIG.CALLBACK_URL}` +
    `?callId=${encodeURIComponent(callId)}` +
    `&lovedOneId=${encodeURIComponent(lovedOneId)}` +
    `&lovedOneName=${encodeURIComponent(lovedOneName)}`;

  // const body = new URLSearchParams({
  //   username: CONFIG.AT_USERNAME,
  //   to: formattedNumber,
  //   from: CONFIG.AT_CALLER_ID,
  //   callbackUrl,
  // });

  const body = new URLSearchParams({
    username: CONFIG.AT_USERNAME,
    to: formattedNumber,
    from: CONFIG.AT_CALLER_ID,
    callbackUrl,
    statusCallback: `${CONFIG.CALLBACK_URL.replace("/voice", "/status")}`,
  });

  try {
    const response = await fetch("https://voice.africastalking.com/call", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        apiKey: CONFIG.AT_API_KEY,
        Accept: "application/json",
      },
      body: body.toString(),
    });

    const result = await response.json();

    console.log("📋 Africa's Talking Response:");
    console.log(JSON.stringify(result, null, 2));

    if (result.errorMessage && result.errorMessage !== "None") {
      throw new Error(result.errorMessage);
    }

    if (!result.entries || result.entries.length === 0) {
      throw new Error("No call entries returned from Africa's Talking");
    }

    const entry = result.entries[0];

    if (entry.status !== "Queued") {
      throw new Error(`Call failed with status: ${entry.status}`);
    }

    console.log("✅ Call queued successfully");
    console.log(`📞 Session ID: ${entry.sessionId}`);

    return {
      callId,
      sessionId: entry.sessionId,
      status: entry.status,
      phoneNumber: formattedNumber,
    };
  } catch (error) {
    console.error("❌ Failed to initiate call:", error);
    throw error;
  }
}

// ============================================================================
// PHONE NUMBER HELPERS
// ============================================================================

function validateNigerianNumber(phoneNumber: string): boolean {
  const cleaned = phoneNumber.replace(/\s+/g, "");

  // +234XXXXXXXXXX (13 digits after +)
  if (cleaned.startsWith("+234")) {
    return cleaned.length === 14 && /^\+234\d{10}$/.test(cleaned);
  }

  // 0XXXXXXXXXX (11 digits)
  if (cleaned.startsWith("0")) {
    return cleaned.length === 11 && /^0\d{10}$/.test(cleaned);
  }

  return false;
}

function formatNigerianNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\s+/g, "");

  if (cleaned.startsWith("0")) {
    return "+234" + cleaned.substring(1);
  }

  if (cleaned.startsWith("+234")) {
    return cleaned;
  }

  throw new Error("Unreachable phone number format");
}

if (import.meta.main) {
  console.log("🚀 Script started");

  await makeCall({
    phoneNumber: "+2348165758478",
    lovedOneName: "Test Call",
  });
}
