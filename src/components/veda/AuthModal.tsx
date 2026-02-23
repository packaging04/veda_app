import React, { useState } from "react";
import { supabase } from "@/lib/supabase";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
  initialMode?: "login" | "signup" | "upgrade";
  initialPlan?: string;
}

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    calls: 0,
    description: "Explore Veda — hear the AI voice, no sessions included.",
    features: [
      "Access to generic Veda number",
      "Hear AI voice (no exchange)",
      "No call sessions",
    ],
    cta: "Start Free",
    highlight: false,
  },
  {
    id: "basic",
    name: "Basic",
    price: "$19.9",
    calls: 5,
    description: "5 wisdom sessions to start your legacy journey.",
    features: [
      "5 inbound call sessions",
      "Personal call code",
      "Session recordings saved",
      "Dashboard access",
    ],
    cta: "Choose Basic",
    highlight: false,
  },
  {
    id: "standard",
    name: "Standard",
    price: "$49.9",
    calls: 20,
    description: "The ideal plan for deep, meaningful preservation.",
    features: [
      "20 inbound call sessions",
      "Personal call code",
      "Session recordings saved",
      "Priority support",
    ],
    cta: "Choose Standard",
    highlight: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "$99.9",
    calls: 45,
    description: "Full legacy preservation — no limits on what you share.",
    features: [
      "45 inbound call sessions",
      "Personal call code",
      "Session recordings saved",
      "Dedicated advisor",
      "AI Legacy Report",
    ],
    cta: "Choose Premium",
    highlight: false,
  },
];

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = "signup",
  initialPlan,
}) => {
  const isUpgrade = initialMode === "upgrade";
  const [mode, setMode] = useState<"login" | "signup" | "upgrade">(initialMode);
  // Upgrade mode starts at step 2 (plan selection), signup at step 1
  const [step, setStep] = useState(isUpgrade ? 2 : 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1 fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Store userId after signup so we don't rely on getUser() with email confirmation
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [pendingUser, setPendingUser] = useState<any>(null);

  // Step 2
  const [selectedPlan, setSelectedPlan] = useState(initialPlan || "standard");

  // Step 3 - payment sim
  const [cardNum, setCardNum] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      onSuccess(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { first_name: firstName, last_name: lastName } },
      });
      if (signUpError) throw signUpError;
      if (data.user) {
        // Store user immediately — don't rely on getUser() later
        setPendingUserId(data.user.id);
        setPendingUser(data.user);

        await supabase.from("profiles").upsert({
          id: data.user.id,
          email,
          first_name: firstName,
          last_name: lastName,
          subscription_plan: "none",
          profile_completed: false,
          calls_remaining: 0,
        });
      }
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Account creation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    if (planId === "free") {
      handleFinalizeAccount(planId);
    } else {
      setStep(3);
    }
  };

  const handleFinalizeAccount = async (planId?: string) => {
    const plan = PLANS.find((p) => p.id === (planId || selectedPlan))!;
    try {
      // For upgrade mode, get current session user
      // For signup mode, use the stored pendingUserId
      let userId = pendingUserId;
      let userObj = pendingUser;

      if (isUpgrade || !userId) {
        const { data } = await supabase.auth.getUser();
        userId = data.user?.id ?? null;
        userObj = data.user;
      }

      if (userId) {
        await supabase
          .from("profiles")
          .update({
            subscription_plan: plan.id,
            subscription_status: "active",
            calls_remaining: plan.calls,
            calls_total: plan.calls,
          })
          .eq("id", userId);
      }

      setPendingUser(userObj);
      setStep(4);
    } catch (err) {
      // proceed anyway for demo
      setStep(4);
    }
  };

  const handleSimulatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentProcessing(true);
    await new Promise((r) => setTimeout(r, 1800));
    setPaymentProcessing(false);
    await handleFinalizeAccount();
  };

  const handleDashboard = async () => {
    // Use stored user if available; otherwise fetch
    if (pendingUser) {
      onSuccess(pendingUser);
      onClose();
      return;
    }
    const { data } = await supabase.auth.getUser();
    onSuccess(data.user);
    onClose();
  };

  const progressSteps = ["Account", "Plan", "Payment", "Done"];
  const showProgress = (mode === "signup" || mode === "upgrade") && step <= 4;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#0d1520]/90 backdrop-blur-md"
        onClick={step === 4 ? handleDashboard : onClose}
      />

      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full overflow-hidden transition-all duration-300 ${
          step === 2 ? "max-w-4xl" : "max-w-md"
        }`}
      >
        <div className="h-1 bg-gradient-to-r from-[#d4af37] via-[#e5c55a] to-[#c9a227]" />

        {step !== 4 && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-1.5 rounded-full text-[#1a2332]/40 hover:text-[#1a2332] hover:bg-gray-100 transition-all"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {showProgress && (
          <div className="px-8 pt-6 pb-2">
            <div className="flex items-center justify-between mb-1">
              {(isUpgrade ? ["Plan", "Payment", "Done"] : progressSteps).map(
                (s, i) => {
                  const stepNum = isUpgrade ? i + 2 : i + 1;
                  const active = stepNum === step;
                  const done = stepNum < step;
                  return (
                    <React.Fragment key={s}>
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            done
                              ? "bg-[#d4af37] text-[#1a2332]"
                              : active
                                ? "bg-[#1a2332] text-[#d4af37] ring-2 ring-[#d4af37] ring-offset-1"
                                : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {done ? "✓" : isUpgrade ? i + 1 : stepNum}
                        </div>
                        <span
                          className={`text-[10px] mt-1 font-medium ${active ? "text-[#1a2332]" : "text-gray-400"}`}
                        >
                          {s}
                        </span>
                      </div>
                      {i < (isUpgrade ? 2 : 3) && (
                        <div
                          className={`flex-1 h-0.5 mx-2 mb-4 transition-all ${done ? "bg-[#d4af37]" : "bg-gray-200"}`}
                        />
                      )}
                    </React.Fragment>
                  );
                },
              )}
            </div>
          </div>
        )}

        <div className="px-8 pb-8 pt-4">
          {/* LOGIN */}
          {mode === "login" && (
            <>
              <div className="text-center mb-6">
                <VedaLogo />
                <h3 className="text-2xl font-serif text-[#1a2332] mt-3">
                  Welcome Back
                </h3>
                <p className="text-[#1a2332]/55 text-sm mt-1">
                  Sign in to continue your legacy journey
                </p>
              </div>
              {error && <ErrorBox message={error} />}
              <form onSubmit={handleLogin} className="space-y-4">
                <Field
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="you@email.com"
                  required
                />
                <Field
                  label="Password"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  placeholder="••••••••"
                  required
                />
                <GoldButton
                  loading={loading}
                  label="Sign In"
                  loadingLabel="Signing in..."
                />
              </form>
              <p className="text-center text-sm text-[#1a2332]/55 mt-5">
                Don't have an account?{" "}
                <button
                  onClick={() => {
                    setMode("signup");
                    setStep(1);
                    setError("");
                  }}
                  className="text-[#d4af37] font-semibold hover:underline"
                >
                  Create one
                </button>
              </p>
            </>
          )}

          {/* STEP 1: CREATE ACCOUNT */}
          {mode === "signup" && step === 1 && (
            <>
              <div className="text-center mb-6">
                <VedaLogo />
                <h3 className="text-2xl font-serif text-[#1a2332] mt-3">
                  Create Your Account
                </h3>
                <p className="text-[#1a2332]/55 text-sm mt-1">
                  Start preserving your wisdom today
                </p>
              </div>
              {error && <ErrorBox message={error} />}
              <form onSubmit={handleCreateAccount} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label="First Name"
                    value={firstName}
                    onChange={setFirstName}
                    placeholder="Jane"
                    required
                  />
                  <Field
                    label="Last Name"
                    value={lastName}
                    onChange={setLastName}
                    placeholder="Doe"
                    required
                  />
                </div>
                <Field
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="you@email.com"
                  required
                />
                <Field
                  label="Password"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                />
                <GoldButton
                  loading={loading}
                  label="Continue →"
                  loadingLabel="Creating account..."
                />
              </form>
              <p className="text-center text-sm text-[#1a2332]/55 mt-5">
                Already have an account?{" "}
                <button
                  onClick={() => {
                    setMode("login");
                    setError("");
                  }}
                  className="text-[#d4af37] font-semibold hover:underline"
                >
                  Sign in
                </button>
              </p>
            </>
          )}

          {/* STEP 2: CHOOSE PLAN */}
          {(mode === "signup" || mode === "upgrade") && step === 2 && (
            <>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-serif text-[#1a2332]">
                  {isUpgrade ? "Upgrade Your Plan" : "Choose Your Plan"}
                </h3>
                <p className="text-[#1a2332]/55 text-sm mt-1">
                  Select the plan that fits your legacy journey
                </p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {PLANS.filter((p) => (isUpgrade ? p.id !== "free" : true)).map(
                  (plan) => (
                    <button
                      key={plan.id}
                      onClick={() => handleSelectPlan(plan.id)}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all hover:shadow-lg group ${
                        plan.highlight
                          ? "border-[#d4af37] bg-[#1a2332] text-white"
                          : "border-gray-200 bg-white hover:border-[#d4af37]/60"
                      }`}
                    >
                      {plan.highlight && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#d4af37] text-[#1a2332] text-[10px] font-bold px-2 py-0.5 rounded-full">
                          POPULAR
                        </span>
                      )}
                      <div
                        className={`text-2xl font-serif font-bold mb-0.5 ${plan.highlight ? "text-[#d4af37]" : "text-[#1a2332]"}`}
                      >
                        {plan.price}
                      </div>
                      <div
                        className={`text-xs font-medium mb-2 ${plan.highlight ? "text-gray-300" : "text-gray-500"}`}
                      >
                        per month
                      </div>
                      <div
                        className={`text-base font-bold mb-1 ${plan.highlight ? "text-white" : "text-[#1a2332]"}`}
                      >
                        {plan.name}
                      </div>
                      <div
                        className={`text-[11px] mb-3 leading-snug ${plan.highlight ? "text-gray-300" : "text-gray-500"}`}
                      >
                        {plan.description}
                      </div>
                      <div className="text-xs font-bold mb-2 text-[#d4af37]">
                        {plan.calls === 0
                          ? "No call sessions"
                          : `${plan.calls} call sessions`}
                      </div>
                      <ul className="space-y-1">
                        {plan.features.map((f, i) => (
                          <li
                            key={i}
                            className={`text-[10px] flex items-start gap-1 ${plan.highlight ? "text-gray-300" : "text-gray-500"}`}
                          >
                            <span className="text-[#d4af37] mt-0.5">✓</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                      <div
                        className={`mt-3 py-2 rounded-lg text-xs font-bold text-center transition-colors ${
                          plan.highlight
                            ? "bg-[#d4af37] text-[#1a2332] group-hover:bg-[#e5c55a]"
                            : "bg-[#1a2332] text-white group-hover:bg-[#d4af37] group-hover:text-[#1a2332]"
                        }`}
                      >
                        {plan.cta}
                      </div>
                    </button>
                  ),
                )}
              </div>
              <p className="text-center text-xs text-[#1a2332]/40 mt-4">
                You can upgrade or change your plan anytime from your dashboard.
              </p>
            </>
          )}

          {/* STEP 3: PAYMENT */}
          {(mode === "signup" || mode === "upgrade") && step === 3 && (
            <>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-serif text-[#1a2332]">
                  Complete Your Order
                </h3>
                <p className="text-[#1a2332]/55 text-sm mt-1">
                  {PLANS.find((p) => p.id === selectedPlan)?.name} Plan —{" "}
                  {PLANS.find((p) => p.id === selectedPlan)?.price}/mo
                </p>
              </div>
              <div className="bg-[#f5f1e8] rounded-xl p-4 mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#1a2332]/60 font-medium">
                    Selected Plan
                  </p>
                  <p className="text-[#1a2332] font-bold">
                    {PLANS.find((p) => p.id === selectedPlan)?.name}
                  </p>
                  <p className="text-xs text-[#1a2332]/60">
                    {PLANS.find((p) => p.id === selectedPlan)?.calls} call
                    sessions
                  </p>
                </div>
                <div className="text-2xl font-serif font-bold text-[#d4af37]">
                  {PLANS.find((p) => p.id === selectedPlan)?.price}
                </div>
              </div>
              <form onSubmit={handleSimulatePayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1a2332] mb-1.5">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNum}
                    onChange={(e) =>
                      setCardNum(
                        e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 16)
                          .replace(/(\d{4})/g, "$1 ")
                          .trim(),
                      )
                    }
                    placeholder="4242 4242 4242 4242"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#1a2332] mb-1.5">
                      Expiry
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM / YY"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1a2332] mb-1.5">
                      CVC
                    </label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.slice(0, 4))}
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <svg
                    className="w-4 h-4 text-blue-500 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-xs text-blue-600">
                    This is a demo — no real payment will be processed.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={paymentProcessing}
                  className="w-full py-3.5 bg-gradient-to-r from-[#d4af37] to-[#c9a227] text-[#1a2332] font-bold rounded-xl hover:from-[#e5c55a] hover:to-[#d4af37] transition-all shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {paymentProcessing ? (
                    <>
                      <Spinner /> Processing...
                    </>
                  ) : (
                    `Activate ${PLANS.find((p) => p.id === selectedPlan)?.name} Plan`
                  )}
                </button>
              </form>
              <button
                onClick={() => setStep(2)}
                className="w-full mt-3 text-sm text-[#1a2332]/40 hover:text-[#1a2332] transition-colors"
              >
                ← Back to plans
              </button>
            </>
          )}

          {/* STEP 4: SUCCESS */}
          {(mode === "signup" || mode === "upgrade") && step === 4 && (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-[#d4af37]/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg
                  className="w-10 h-10 text-[#d4af37]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-serif text-[#1a2332] mb-2">
                {isUpgrade ? "Plan Upgraded!" : "Welcome to Veda!"}
              </h3>
              <p className="text-[#1a2332]/60 text-sm mb-2">
                Your{" "}
                <strong className="text-[#d4af37]">
                  {PLANS.find((p) => p.id === selectedPlan)?.name}
                </strong>{" "}
                plan is active.
              </p>
              <p className="text-[#1a2332]/50 text-xs mb-6">
                {selectedPlan === "free"
                  ? "You can call our generic number to hear the Veda AI. Upgrade anytime to start real wisdom sessions."
                  : `You have ${PLANS.find((p) => p.id === selectedPlan)?.calls} call sessions ready. Complete your profile to schedule your first call.`}
              </p>
              <button
                onClick={handleDashboard}
                className="w-full py-3.5 bg-[#1a2332] text-[#d4af37] font-bold rounded-xl hover:bg-[#2a3342] transition-colors"
              >
                {isUpgrade ? "Back to Dashboard →" : "Go to My Dashboard →"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const VedaLogo = () => (
  <div className="flex items-center justify-center">
    <svg width="36" height="36" viewBox="0 0 48 48" className="text-[#d4af37]">
      <path
        d="M8 12 L24 38 L40 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <span className="ml-2 text-lg font-serif tracking-wider text-[#1a2332]">
      VEDA
    </span>
  </div>
);

const Field: React.FC<{
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
}> = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  minLength,
}) => (
  <div>
    <label className="block text-sm font-medium text-[#1a2332] mb-1.5">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      minLength={minLength}
      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
    />
  </div>
);

const GoldButton: React.FC<{
  loading: boolean;
  label: string;
  loadingLabel: string;
}> = ({ loading, label, loadingLabel }) => (
  <button
    type="submit"
    disabled={loading}
    className="w-full py-3.5 bg-gradient-to-r from-[#d4af37] to-[#c9a227] text-[#1a2332] font-bold rounded-xl hover:from-[#e5c55a] hover:to-[#d4af37] transition-all shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
  >
    {loading ? (
      <>
        <Spinner /> {loadingLabel}
      </>
    ) : (
      label
    )}
  </button>
);

const ErrorBox: React.FC<{ message: string }> = ({ message }) => (
  <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
    {message}
  </div>
);

const Spinner = () => (
  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

export default AuthModal;
export { PLANS };
