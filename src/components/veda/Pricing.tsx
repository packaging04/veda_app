import React from "react";

interface PricingProps {
  onSelectPlan?: (plan: string) => void;
  onRequestDemo?: () => void;
}

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    calls: 0,
    callLabel: "No call sessions",
    description:
      "Explore Veda and hear the AI voice — a first taste of your legacy journey.",
    features: [
      "Access to generic Veda number",
      "Hear the Veda AI voice",
      "No personal session or recording",
      "Upgrade anytime",
    ],
    cta: "Get Started Free",
    highlight: false,
    badge: null,
  },
  {
    id: "basic",
    name: "Basic",
    price: "$19.9",
    period: "per month",
    calls: 5,
    callLabel: "5 call sessions",
    description:
      "A meaningful start — 5 personal wisdom sessions to begin your legacy.",
    features: [
      "5 inbound call sessions",
      "Personal call code assigned",
      "Session recordings saved",
      "Dashboard access",
      "Email support",
    ],
    cta: "Choose Basic",
    highlight: false,
    badge: null,
  },
  {
    id: "standard",
    name: "Standard",
    price: "$49.9",
    period: "per month",
    calls: 20,
    callLabel: "20 call sessions",
    description:
      "Our most popular plan — deep, consistent wisdom preservation over weeks.",
    features: [
      "20 inbound call sessions",
      "Personal call code assigned",
      "Session recordings saved",
      "Dashboard access",
      "Priority email support",
      "AI session summaries",
    ],
    cta: "Choose Standard",
    highlight: true,
    badge: "Most Popular",
  },
  {
    id: "premium",
    name: "Premium",
    price: "$99.9",
    period: "per month",
    calls: 45,
    callLabel: "45 call sessions",
    description:
      "Full legacy preservation — the complete Veda experience with no compromises.",
    features: [
      "45 inbound call sessions",
      "Personal call code assigned",
      "Session recordings saved",
      "Dashboard access",
      "Dedicated legacy advisor",
      "AI session summaries",
      "Legacy Report generated",
      "Priority support",
    ],
    cta: "Choose Premium",
    highlight: false,
    badge: null,
  },
];

const Pricing: React.FC<PricingProps> = ({ onSelectPlan, onRequestDemo }) => {
  const handlePlanClick = (planId: string) => {
    if (onSelectPlan) onSelectPlan(planId);
    else if (onRequestDemo) onRequestDemo();
  };

  return (
    <section id="pricing" className="py-24 bg-[#f5f1e8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#d4af37] tracking-widest text-sm font-medium mb-4">
            SIMPLE PRICING
          </p>
          <h2 className="text-4xl sm:text-5xl font-serif text-[#1a2332] mb-6">
            Choose Your Legacy Plan
          </h2>
          <p className="text-lg text-[#1a2332]/70 max-w-2xl mx-auto">
            Start free and upgrade as your legacy grows. Each paid plan gives
            you a personal call code and dedicated sessions — you call us, we
            capture your wisdom.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                plan.highlight
                  ? "bg-[#1a2332] shadow-2xl shadow-[#1a2332]/30 ring-2 ring-[#d4af37]/60"
                  : "bg-white shadow-lg border border-[#1a2332]/10"
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-[#d4af37] text-[#1a2332] text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col">
                {/* Plan name + price */}
                <div className="mb-5">
                  <p
                    className={`text-sm font-bold tracking-wider mb-1 ${plan.highlight ? "text-[#d4af37]/70" : "text-[#1a2332]/50"}`}
                  >
                    {plan.name.toUpperCase()}
                  </p>
                  <div className="flex items-end gap-1 mb-1">
                    <span
                      className={`text-4xl font-serif font-bold ${plan.highlight ? "text-[#d4af37]" : "text-[#1a2332]"}`}
                    >
                      {plan.price}
                    </span>
                    {plan.id !== "free" && (
                      <span
                        className={`text-sm pb-1.5 ${plan.highlight ? "text-white/50" : "text-[#1a2332]/50"}`}
                      >
                        /mo
                      </span>
                    )}
                  </div>
                  {/* Call sessions pill */}
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      plan.calls === 0
                        ? plan.highlight
                          ? "bg-white/10 text-white/60"
                          : "bg-gray-100 text-gray-400"
                        : plan.highlight
                          ? "bg-[#d4af37]/20 text-[#d4af37]"
                          : "bg-[#d4af37]/10 text-[#d4af37]"
                    }`}
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    {plan.callLabel}
                  </div>
                </div>

                <p
                  className={`text-sm leading-relaxed mb-5 ${plan.highlight ? "text-white/60" : "text-[#1a2332]/60"}`}
                >
                  {plan.description}
                </p>

                {/* Features */}
                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <svg
                        className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.highlight ? "text-[#d4af37]" : "text-[#d4af37]"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span
                        className={`text-sm ${plan.highlight ? "text-white/70" : "text-[#1a2332]/70"}`}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => handlePlanClick(plan.id)}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                    plan.highlight
                      ? "bg-[#d4af37] text-[#1a2332] hover:bg-[#e5c55a] shadow-lg"
                      : plan.id === "free"
                        ? "bg-[#f5f1e8] text-[#1a2332] hover:bg-gray-100 border border-[#1a2332]/10"
                        : "bg-[#1a2332] text-[#d4af37] hover:bg-[#2a3342]"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="text-center">
          <p className="text-[#1a2332]/50 text-sm mb-2">
            All plans include dashboard access. Payment is simulated — no real
            charges during our beta.
          </p>
          <p className="text-[#1a2332]/40 text-xs">
            🔒 You call us — we never call you. Your sessions happen on your
            schedule.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
