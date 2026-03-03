import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// ─── Social Media Links (update URLs when ready) ──────────────────────────────
const SOCIAL = {
  linkedin: "https://linkedin.com/company/veda-legacy",
  facebook: "https://web.facebook.com/profile.php?id=61586185774675",
  instagram: "https://www.instagram.com/vedalegacy2025",
  tiktok: "https://tiktok.com/@vedalegacy",
};

// ─── Hero slides ──────────────────────────────────────────────────────────────
const HERO_SLIDES = [
  "https://images.unsplash.com/photo-1516307365426-bea591f05011?w=1800&q=80",
  "https://images.unsplash.com/photo-1573497491208-6b1acb260507?w=1800&q=80",
  "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=1800&q=80",
  "https://images.unsplash.com/photo-1559526324-593bc073d938?w=1800&q=80",
  "https://images.unsplash.com/photo-1609207888681-14ebac3c6e06?w=1800&q=80",
];

// ─── Hero text slides ─────────────────────────────────────────────────────────
const HERO_TEXTS = [
  {
    badge: "DEMENTIA · COGNITIVE DECLINE",
    heading: (
      <>
        Her wisdom is still there.
        <br />
        <em style={{ color: "#e5c55a" }}>But the window</em>
        <br />
        <span style={{ opacity: 0.72, fontWeight: 300 }}>is closing.</span>
      </>
    ),
    sub: "Alzheimer's starts erasing the brain up to 20 years before anyone notices. Right now, while she still reasons clearly — her judgment can still be preserved forever.",
    note: "3.5M Africans live with dementia. Fewer than 1% are ever diagnosed.",
  },
  {
    badge: "FOUNDERS · CEOs · SUCCESSION",
    heading: (
      <>
        You built an empire.
        <br />
        <em style={{ color: "#e5c55a" }}>Who inherits</em>
        <br />
        <span style={{ opacity: 0.72, fontWeight: 300 }}>
          the way you think?
        </span>
      </>
    ),
    sub: "Your business survives you on paper. But the instincts, the judgment calls, the things only you know — those die with you. Unless you preserve them now.",
    note: "70% of family businesses collapse by the 2nd generation. Not from lack of money. From lack of the founder's mind.",
  },
  {
    badge: "AFRICAN FAMILIES · ORAL WISDOM",
    heading: (
      <>
        Your grandfather knew things
        <br />
        <em style={{ color: "#e5c55a" }}>no document</em>
        <br />
        <span style={{ opacity: 0.72, fontWeight: 300 }}>will ever hold.</span>
      </>
    ),
    sub: "In our culture, wisdom lives in people — not files. When the elder is gone, the compass is gone. Veda captures it while there is still time.",
    note: "Africa will have the world's fastest-growing dementia population by 2050.",
  },
  {
    badge: "FAMILY WEALTH · LEGACY",
    heading: (
      <>
        They will inherit everything.
        <br />
        <em style={{ color: "#e5c55a" }}>Except the one thing</em>
        <br />
        <span style={{ opacity: 0.72, fontWeight: 300 }}>
          that built it all.
        </span>
      </>
    ),
    sub: "$84 trillion is passing to the next generation. The money transfers. The judgment that created it — never does. Veda is the missing infrastructure.",
    note: "Families don't fracture over money. They fracture over decisions no one knows how to make.",
  },
  {
    badge: "CAREGIVERS · FAMILIES",
    heading: (
      <>
        "We had no idea
        <br />
        <em style={{ color: "#e5c55a" }}>what she would have done.</em>
        <br />
        <span style={{ opacity: 0.72, fontWeight: 300 }}>
          We were just guessing."
        </span>
      </>
    ),
    sub: "Every caregiver carries this. Not guilt for loving too little — but for never asking the right questions while they still could. That conversation is still possible. Start it today.",
    note: "The window is open right now. It will not stay open.",
  },
];

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const LinkedInIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
const FacebookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const InstagramIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const TikTokIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.05a8.27 8.27 0 0 0 4.84 1.55V7.16a4.85 4.85 0 0 1-1.07-.47z" />
  </svg>
);
const SunIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);
const MoonIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);
const VedaLogo = ({ size = 28, color = "#c9a227" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    style={{ color, flexShrink: 0 }}
  >
    <path
      d="M8 12 L24 38 L40 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Theme tokens ─────────────────────────────────────────────────────────────
const themes = {
  dark: {
    bg: "#0a1628",
    bgAlt: "rgba(255,255,255,0.018)",
    bgCard: "#111e35",
    bgInput: "rgba(255,255,255,0.07)",
    bgNav: "rgba(10,22,40,0.82)",
    bgOverlay: "rgba(10,22,40,0.87)",
    text: "#faf7f0",
    textMuted: "rgba(250,247,240,0.55)",
    textDim: "rgba(250,247,240,0.28)",
    border: "rgba(201,162,39,0.2)",
    borderInput: "rgba(201,162,39,0.28)",
    borderFocus: "rgba(201,162,39,0.7)",
    gold: "#c9a227",
    goldLight: "#e5c55a",
    statBg: "rgba(255,255,255,0.04)",
    statBorder: "rgba(201,162,39,0.15)",
    socialBg: "rgba(255,255,255,0.07)",
    socialHover: "rgba(201,162,39,0.18)",
    pillBg: "rgba(201,162,39,0.12)",
    featureBg: "rgba(255,255,255,0.025)",
    featureBorder: "rgba(201,162,39,0.18)",
    cookingBg: "rgba(201,162,39,0.06)",
    cookingBorder: "rgba(201,162,39,0.22)",
    navBorder: "rgba(201,162,39,0.1)",
    footerBg: "rgba(0,0,0,0.25)",
    themeBg: "rgba(255,255,255,0.08)",
  },
  light: {
    bg: "#f5f0e8",
    bgAlt: "rgba(201,162,39,0.04)",
    bgCard: "#ffffff",
    bgInput: "rgba(10,22,40,0.05)",
    bgNav: "rgba(245,240,232,0.94)",
    bgOverlay: "rgba(10,22,40,0.72)",
    text: "#0a1628",
    textMuted: "rgba(10,22,40,0.58)",
    textDim: "rgba(10,22,40,0.32)",
    border: "rgba(201,162,39,0.32)",
    borderInput: "rgba(10,22,40,0.18)",
    borderFocus: "#c9a227",
    gold: "#a07a10",
    goldLight: "#c9a227",
    statBg: "rgba(10,22,40,0.04)",
    statBorder: "rgba(201,162,39,0.28)",
    socialBg: "rgba(10,22,40,0.07)",
    socialHover: "rgba(201,162,39,0.18)",
    pillBg: "rgba(201,162,39,0.14)",
    featureBg: "#ffffff",
    featureBorder: "rgba(201,162,39,0.28)",
    cookingBg: "rgba(201,162,39,0.07)",
    cookingBorder: "rgba(201,162,39,0.28)",
    navBorder: "rgba(201,162,39,0.18)",
    footerBg: "rgba(10,22,40,0.03)",
    themeBg: "rgba(10,22,40,0.07)",
  },
};

// ─── Global Styles ────────────────────────────────────────────────────────────
const Styles = ({ t }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
    .vl-serif { font-family: 'Cormorant Garamond', serif; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: ${t.bg}; }
    ::-webkit-scrollbar-thumb { background: ${t.gold}; border-radius: 2px; }

    .vl-noise::after { content:''; position:fixed; inset:0;
      background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
      pointer-events:none; z-index:1; opacity:0.3; }

    .vl-slide { position:absolute; inset:0; background-size:cover; background-position:center; opacity:0; transition:opacity 1.8s ease-in-out; }
    .vl-slide.active { opacity:1; }

    @keyframes vl-in { from{opacity:0;transform:translateY(22px) scale(0.97)} to{opacity:1;transform:none} }
    .vl-modal { animation: vl-in 0.45s cubic-bezier(0.16,1,0.3,1) forwards; }

    @keyframes vl-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
    .vl-gold {
      background: linear-gradient(135deg,#c9a227,#e5c55a,#c9a227,#a8841a);
      background-size:300% 100%; animation:vl-shimmer 4s linear infinite;
      color:#0a1628; font-family:'DM Sans',sans-serif; font-weight:700;
      letter-spacing:0.06em; border:none; cursor:pointer;
      transition:transform 0.2s,box-shadow 0.2s;
    }
    .vl-gold:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(201,162,39,0.42);}
    .vl-gold:active{transform:none;}
    .vl-gold:disabled{opacity:0.4;cursor:not-allowed;animation:none;background:#8a7020;}

    .vl-ghost {
      background:transparent; border:1px solid ${t.border};
      color:${t.goldLight}; font-family:'DM Sans',sans-serif;
      font-weight:500; cursor:pointer; transition:all 0.2s;
    }
    .vl-ghost:hover{border-color:${t.gold};background:${t.socialHover};}

    .vl-input {
      background:${t.bgInput}; border:1px solid ${t.borderInput};
      color:${t.text}; font-family:'DM Sans',sans-serif;
      outline:none; transition:border-color 0.2s,background 0.2s;
    }
    .vl-input::placeholder{color:${t.textDim};}
    .vl-input:focus{border-color:${t.borderFocus};}

    .vl-social {
      display:flex; align-items:center; justify-content:center;
      width:36px; height:36px; border-radius:50%;
      background:${t.socialBg}; border:1px solid ${t.border};
      color:${t.textMuted}; text-decoration:none; transition:all 0.22s; flex-shrink:0;
    }
    .vl-social:hover{background:${t.socialHover};color:${t.gold};border-color:${t.gold};transform:translateY(-2px);}

    .vl-theme {
      display:flex; align-items:center; gap:6px;
      padding:7px 13px; border-radius:100px;
      background:${t.themeBg}; border:1px solid ${t.border};
      color:${t.textMuted}; font-family:'DM Sans',sans-serif;
      font-size:12px; font-weight:500; cursor:pointer; transition:all 0.2s;
    }
    .vl-theme:hover{border-color:${t.gold};color:${t.gold};}

    .vl-divider{height:1px;background:linear-gradient(90deg,transparent,${t.border},transparent);}

    @keyframes vl-textIn { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
    @keyframes vl-textOut { from{opacity:1;transform:translateY(0)} to{opacity:0;transform:translateY(-14px)} }
    .vl-text-enter { animation: vl-textIn 0.7s cubic-bezier(0.16,1,0.3,1) forwards; }

    @keyframes vl-fu{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}
    .vl-fu1{animation:vl-fu 0.8s cubic-bezier(0.16,1,0.3,1) forwards;}
    .vl-fu2{animation:vl-fu 0.8s 0.12s cubic-bezier(0.16,1,0.3,1) forwards;opacity:0;}
    .vl-fu3{animation:vl-fu 0.8s 0.24s cubic-bezier(0.16,1,0.3,1) forwards;opacity:0;}
    .vl-fu4{animation:vl-fu 0.8s 0.36s cubic-bezier(0.16,1,0.3,1) forwards;opacity:0;}

    @keyframes vl-pulse{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.2);opacity:0}}
    .vl-pulse::before{content:'';position:absolute;inset:0;border-radius:50%;background:#c9a227;animation:vl-pulse 1.8s ease-out infinite;}

    @media(max-width:640px){
      .vl-hero-title{font-size:clamp(2.2rem,9vw,3.4rem) !important;}
      .vl-cook-title{font-size:clamp(1.9rem,8vw,2.8rem) !important;}
      .vl-stats{grid-template-columns:1fr 1fr !important;}
      .vl-features{grid-template-columns:1fr !important;}
      .vl-process{grid-template-columns:1fr !important;}
      .vl-side-social{display:none !important;}
      .vl-footer-top{flex-direction:column !important;}
    }
  `}</style>
);

// ─── Social Row component ─────────────────────────────────────────────────────
const SocialRow = ({ size = 16, gap = 8 }) => (
  <div style={{ display: "flex", alignItems: "center", gap }}>
    {[
      { href: SOCIAL.linkedin, Icon: LinkedInIcon, label: "LinkedIn" },
      { href: SOCIAL.facebook, Icon: FacebookIcon, label: "Facebook" },
      { href: SOCIAL.instagram, Icon: InstagramIcon, label: "Instagram" },
      { href: SOCIAL.tiktok, Icon: TikTokIcon, label: "TikTok" },
    ].map(({ href, Icon, label }) => (
      <a
        key={label}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="vl-social"
        aria-label={label}
        style={{ width: 36, height: 36 }}
      >
        <Icon size={size} />
      </a>
    ))}
  </div>
);

// ─── Waitlist Popup ───────────────────────────────────────────────────────────
const WaitlistPopup = ({ onClose, t }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const handleJoin = async () => {
    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { error: e } = await supabase
        .from("waitlist")
        .insert([
          {
            email: email.toLowerCase().trim(),
            source: "popup",
            joined_at: new Date().toISOString(),
          },
        ]);
      if (e && e.code !== "23505") throw e;
      setDone(true);
      localStorage.setItem("veda_waitlist_joined", "true");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 90,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(10,22,40,0.88)",
        backdropFilter: "blur(18px)",
      }}
    >
      <div
        className="vl-modal"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 420,
          background: t.bgCard,
          border: `1px solid ${t.border}`,
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            height: 3,
            background: "linear-gradient(90deg,#c9a227,#e5c55a,#c9a227)",
          }}
        />
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: t.socialBg,
            border: `1px solid ${t.border}`,
            color: t.textMuted,
            cursor: "pointer",
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ✕
        </button>
        <div style={{ padding: "36px 32px 30px" }}>
          {!done ? (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 18,
                }}
              >
                <VedaLogo size={28} color={t.gold} />
                <span
                  className="vl-serif"
                  style={{
                    fontSize: 17,
                    fontWeight: 300,
                    color: t.gold,
                    letterSpacing: "0.18em",
                  }}
                >
                  VEDA LEGACY
                </span>
              </div>
              <h2
                className="vl-serif"
                style={{
                  fontSize: "clamp(1.5rem,5vw,1.85rem)",
                  fontWeight: 400,
                  color: t.text,
                  lineHeight: 1.2,
                  marginBottom: 10,
                }}
              >
                Be first to know
                <br />
                <em style={{ color: t.gold }}>when we're ready.</em>
              </h2>
              <p
                style={{
                  fontSize: 13,
                  color: t.textMuted,
                  lineHeight: 1.7,
                  marginBottom: 22,
                }}
              >
                We're building the world's first cognitive continuity platform —
                preserving how people <em>think</em>, not just what they said or
                owned. Join the waitlist and be first through the door.
              </p>
              <div className="vl-divider" style={{ marginBottom: 22 }} />
              <label
                style={{
                  display: "block",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.13em",
                  color: t.gold,
                  marginBottom: 8,
                }}
              >
                YOUR EMAIL ADDRESS
              </label>
              <input
                type="email"
                className="vl-input"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                placeholder="you@example.com"
                style={{
                  width: "100%",
                  padding: "13px 16px",
                  borderRadius: 12,
                  fontSize: 15,
                  marginBottom: 4,
                }}
              />
              {error && (
                <p style={{ color: "#e57373", fontSize: 12, marginBottom: 8 }}>
                  {error}
                </p>
              )}
              <div style={{ height: 12 }} />
              <button
                className="vl-gold"
                onClick={handleJoin}
                disabled={loading || !email}
                style={{
                  width: "100%",
                  padding: 15,
                  borderRadius: 12,
                  fontSize: 15,
                }}
              >
                {loading ? "Joining…" : "Join the Waitlist →"}
              </button>
              <p
                style={{
                  textAlign: "center",
                  fontSize: 11,
                  color: t.textDim,
                  marginTop: 14,
                }}
              >
                No spam. One email when we launch.
              </p>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "14px 0" }}>
              <div style={{ fontSize: 44, marginBottom: 14 }}>✨</div>
              <h3
                className="vl-serif"
                style={{
                  fontSize: "1.7rem",
                  fontWeight: 400,
                  color: t.text,
                  marginBottom: 10,
                }}
              >
                You're on the list.
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: t.textMuted,
                  lineHeight: 1.7,
                  marginBottom: 22,
                }}
              >
                We'll reach you at{" "}
                <strong style={{ color: t.gold }}>{email}</strong> the moment
                Veda Legacy goes live.
              </p>
              <button
                className="vl-ghost"
                onClick={onClose}
                style={{ padding: "11px 28px", borderRadius: 10, fontSize: 13 }}
              >
                Continue to site
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Demo Modal ───────────────────────────────────────────────────────────────
const DemoModal = ({ isOpen, onClose, t }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  if (!isOpen) return null;
  const handleSubmit = async () => {
    if (!email || !name) return;
    setLoading(true);
    try {
      await supabase
        .from("demo_requests")
        .insert([
          { name, email, message, requested_at: new Date().toISOString() },
        ]);
    } catch (_) {}
    setLoading(false);
    setDone(true);
  };
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 90,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(10,22,40,0.92)",
        backdropFilter: "blur(18px)",
      }}
    >
      <div
        className="vl-modal"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 460,
          background: t.bgCard,
          border: `1px solid ${t.border}`,
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 40px 100px rgba(0,0,0,0.45)",
        }}
      >
        <div
          style={{
            height: 3,
            background: "linear-gradient(90deg,#c9a227,#e5c55a,#c9a227)",
          }}
        />
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: t.socialBg,
            border: `1px solid ${t.border}`,
            color: t.textMuted,
            cursor: "pointer",
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ✕
        </button>
        <div style={{ padding: "36px 32px 30px" }}>
          {!done ? (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  marginBottom: 22,
                }}
              >
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 14,
                    background: t.pillBg,
                    border: `1px solid ${t.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                  }}
                >
                  🎬
                </div>
                <div>
                  <h3
                    className="vl-serif"
                    style={{
                      fontSize: "1.45rem",
                      fontWeight: 400,
                      color: t.text,
                    }}
                  >
                    Request a Demo
                  </h3>
                  <p style={{ fontSize: 12, color: t.textMuted }}>
                    We'll schedule a live walkthrough
                  </p>
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.13em",
                    color: t.gold,
                    marginBottom: 7,
                  }}
                >
                  FULL NAME *
                </label>
                <input
                  type="text"
                  className="vl-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    borderRadius: 11,
                    fontSize: 14,
                  }}
                />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.13em",
                    color: t.gold,
                    marginBottom: 7,
                  }}
                >
                  EMAIL *
                </label>
                <input
                  type="email"
                  className="vl-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    borderRadius: 11,
                    fontSize: 14,
                  }}
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.13em",
                    color: t.gold,
                    marginBottom: 7,
                  }}
                >
                  WHO WOULD YOU LIKE TO PRESERVE WISDOM FOR?
                </label>
                <textarea
                  className="vl-input"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. My father who built a family business over 30 years, now in early decline..."
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    borderRadius: 11,
                    fontSize: 14,
                    resize: "none",
                  }}
                />
              </div>
              <button
                className="vl-gold"
                onClick={handleSubmit}
                disabled={!email || !name || loading}
                style={{
                  width: "100%",
                  padding: 14,
                  borderRadius: 12,
                  fontSize: 15,
                }}
              >
                {loading ? "Sending…" : "Request Demo →"}
              </button>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 44, marginBottom: 14 }}>✨</div>
              <h3
                className="vl-serif"
                style={{
                  fontSize: "1.7rem",
                  fontWeight: 400,
                  color: t.text,
                  marginBottom: 10,
                }}
              >
                Request Received!
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: t.textMuted,
                  lineHeight: 1.7,
                  marginBottom: 24,
                }}
              >
                Thanks <strong style={{ color: t.gold }}>{name}</strong>! We'll
                reach you at <strong style={{ color: t.gold }}>{email}</strong>{" "}
                shortly.
              </p>
              <button
                className="vl-ghost"
                onClick={onClose}
                style={{ padding: "11px 28px", borderRadius: 10, fontSize: 13 }}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Inline Waitlist ──────────────────────────────────────────────────────────
const InlineWaitlist = ({ t }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const already =
    typeof window !== "undefined" &&
    localStorage.getItem("veda_waitlist_joined") === "true";
  if (already && !done)
    return (
      <p
        style={{
          color: t.gold,
          fontSize: 15,
          fontWeight: 500,
          padding: "14px 0",
        }}
      >
        ✓ You're already on the list. We'll be in touch.
      </p>
    );
  if (done)
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>✨</div>
        <p
          className="vl-serif"
          style={{ fontSize: "1.4rem", color: t.text, marginBottom: 8 }}
        >
          You're on the list.
        </p>
        <p style={{ color: t.textMuted, fontSize: 14 }}>
          We'll reach <strong style={{ color: t.gold }}>{email}</strong> when we
          launch.
        </p>
      </div>
    );
  const handleJoin = async () => {
    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { error: e } = await supabase
        .from("waitlist")
        .insert([
          {
            email: email.toLowerCase().trim(),
            source: "page_cta",
            joined_at: new Date().toISOString(),
          },
        ]);
      if (e && e.code !== "23505") throw e;
      setDone(true);
      localStorage.setItem("veda_waitlist_joined", "true");
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ width: "100%", maxWidth: 480, margin: "0 auto" }}>
      <input
        type="email"
        className="vl-input"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setError("");
        }}
        onKeyDown={(e) => e.key === "Enter" && handleJoin()}
        placeholder="Enter your email address"
        style={{
          width: "100%",
          padding: "16px 20px",
          borderRadius: 14,
          fontSize: 16,
          marginBottom: 12,
        }}
      />
      {error && (
        <p style={{ color: "#e57373", fontSize: 13, marginBottom: 10 }}>
          {error}
        </p>
      )}
      <button
        className="vl-gold"
        onClick={handleJoin}
        disabled={loading || !email}
        style={{ width: "100%", padding: 17, borderRadius: 14, fontSize: 16 }}
      >
        {loading ? "Joining…" : "JOIN THE WAITLIST →"}
      </button>
      <p
        style={{
          textAlign: "center",
          fontSize: 12,
          color: t.textDim,
          marginTop: 12,
        }}
      >
        No spam. One email when we launch.
      </p>
    </div>
  );
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function VedaLandingPage() {
  const [isDark, setIsDark] = useState(true);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [slide, setSlide] = useState(0);
  const [textKey, setTextKey] = useState(0);
  const t = isDark ? themes.dark : themes.light;

  useEffect(() => {
    const saved = localStorage.getItem("veda_theme");
    if (saved) setIsDark(saved === "dark");
  }, []);
  useEffect(() => {
    localStorage.setItem("veda_theme", isDark ? "dark" : "light");
  }, [isDark]);
  useEffect(() => {
    const alreadyJoined =
      localStorage.getItem("veda_waitlist_joined") === "true";
    if (!alreadyJoined) {
      const id = setTimeout(() => setShowWaitlist(true), 700);
      return () => clearTimeout(id);
    }
  }, []);
  useEffect(() => {
    const id = setInterval(() => {
      setSlide((p) => (p + 1) % HERO_SLIDES.length);
      setTextKey((p) => p + 1);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const G = (c) => `linear-gradient(90deg, transparent, ${c}, transparent)`;

  return (
    <>
      <Styles t={t} />
      <div
        className="vl-noise"
        style={{
          minHeight: "100vh",
          background: t.bg,
          color: t.text,
          transition: "background 0.4s, color 0.4s",
        }}
      >
        {/* NAV */}
        <nav
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
            padding: "15px 5vw",
            background: t.bgNav,
            backdropFilter: "blur(22px)",
            borderBottom: `1px solid ${t.navBorder}`,
            transition: "background 0.4s",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <VedaLogo size={24} color={t.gold} />
            <span
              className="vl-serif"
              style={{
                fontSize: 16,
                fontWeight: 300,
                color: t.gold,
                letterSpacing: "0.2em",
              }}
            >
              VEDA LEGACY
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <SocialRow size={15} gap={6} />
            <button className="vl-theme" onClick={() => setIsDark((d) => !d)}>
              {isDark ? <SunIcon /> : <MoonIcon />}
              <span>{isDark ? "Light" : "Dark"}</span>
            </button>
            <button
              className="vl-ghost"
              onClick={() => setShowDemo(true)}
              style={{ padding: "9px 18px", borderRadius: 10, fontSize: 13 }}
            >
              Request a Demo
            </button>
          </div>
        </nav>

        {/* HERO */}
        <section
          style={{
            position: "relative",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
              zIndex: 1,
            }}
          >
            {HERO_SLIDES.map((src, i) => (
              <div
                key={i}
                className={`vl-slide ${i === slide ? "active" : ""}`}
                style={{ backgroundImage: `url(${src})` }}
              />
            ))}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(160deg,${t.bgOverlay} 0%,rgba(10,22,40,0.55) 50%,${t.bgOverlay} 100%)`,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse at 50% 85%,rgba(201,162,39,0.1) 0%,transparent 60%)",
              }}
            />
          </div>

          {/* Side social strip */}
          <div
            className="vl-side-social"
            style={{
              position: "absolute",
              left: "2.5vw",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 1,
                height: 56,
                background:
                  "linear-gradient(180deg,transparent,rgba(201,162,39,0.45))",
                marginBottom: 4,
              }}
            />
            {[
              { href: SOCIAL.linkedin, Icon: LinkedInIcon, label: "LinkedIn" },
              { href: SOCIAL.facebook, Icon: FacebookIcon, label: "Facebook" },
              {
                href: SOCIAL.instagram,
                Icon: InstagramIcon,
                label: "Instagram",
              },
              { href: SOCIAL.tiktok, Icon: TikTokIcon, label: "TikTok" },
            ].map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="vl-social"
                aria-label={label}
              >
                <Icon size={14} />
              </a>
            ))}
            <div
              style={{
                width: 1,
                height: 56,
                background:
                  "linear-gradient(180deg,rgba(201,162,39,0.45),transparent)",
                marginTop: 4,
              }}
            />
          </div>

          {/* Hero content */}
          <div
            style={{
              position: "relative",
              zIndex: 5,
              textAlign: "center",
              padding: "160px 24px 140px",
              maxWidth: 820,
              width: "100%",
            }}
          >
            {/* Badge — animates per slide */}
            <div
              key={`badge-${textKey}`}
              className="vl-text-enter"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 16px",
                borderRadius: 100,
                background: "rgba(201,162,39,0.13)",
                border: "1px solid rgba(201,162,39,0.35)",
                marginBottom: 28,
              }}
            >
              <span
                style={{
                  position: "relative",
                  display: "inline-block",
                  width: 7,
                  height: 7,
                }}
              >
                <span
                  className="vl-pulse"
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: "#c9a227",
                  }}
                />
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  color: "#c9a227",
                }}
              >
                {HERO_TEXTS[slide % HERO_TEXTS.length].badge}
              </span>
            </div>

            {/* Heading — animates per slide */}
            <h1
              key={`heading-${textKey}`}
              className="vl-serif vl-hero-title vl-text-enter"
              style={{
                fontSize: "clamp(2.8rem,7vw,5rem)",
                fontWeight: 300,
                color: "#faf7f0",
                lineHeight: 1.12,
                marginBottom: 20,
                animationDelay: "0.08s",
                opacity: 0,
              }}
            >
              {HERO_TEXTS[slide % HERO_TEXTS.length].heading}
            </h1>

            {/* Subtext — animates per slide */}
            <p
              key={`sub-${textKey}`}
              className="vl-text-enter"
              style={{
                fontSize: "clamp(14px,2.3vw,17px)",
                color: "rgba(250,247,240,0.72)",
                lineHeight: 1.82,
                maxWidth: 580,
                margin: "0 auto 12px",
                animationDelay: "0.16s",
                opacity: 0,
              }}
            >
              {HERO_TEXTS[slide % HERO_TEXTS.length].sub}
            </p>

            {/* Note line — animates per slide */}
            <p
              key={`note-${textKey}`}
              className="vl-text-enter"
              style={{
                fontSize: 13,
                color: "rgba(250,247,240,0.45)",
                lineHeight: 1.7,
                maxWidth: 500,
                margin: "0 auto 38px",
                fontStyle: "italic",
                animationDelay: "0.24s",
                opacity: 0,
              }}
            >
              {HERO_TEXTS[slide % HERO_TEXTS.length].note}
            </p>

            {/* Buttons — static, always visible */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 13,
              }}
            >
              <button
                className="vl-gold"
                onClick={() => setShowWaitlist(true)}
                style={{
                  padding: "18px 52px",
                  borderRadius: 14,
                  fontSize: 16,
                  letterSpacing: "0.08em",
                }}
              >
                JOIN THE WAITLIST
              </button>
              <button
                className="vl-ghost"
                onClick={() => setShowDemo(true)}
                style={{ padding: "12px 28px", borderRadius: 12, fontSize: 14 }}
              >
                Request a Demo instead
              </button>
            </div>
          </div>

          {/* Slide dots */}
          <div
            style={{
              position: "absolute",
              bottom: 22,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 8,
              zIndex: 10,
            }}
          >
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setSlide(i);
                  setTextKey((p) => p + 1);
                }}
                style={{
                  width: i === slide ? 22 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: i === slide ? "#c9a227" : "rgba(201,162,39,0.3)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.4s",
                  padding: 0,
                }}
              />
            ))}
          </div>
        </section>

        {/* THE WISDOM GAP */}
        <section
          style={{
            padding: "100px 5vw",
            background: t.bg,
            transition: "background 0.4s",
          }}
        >
          <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 32,
              }}
            >
              <div style={{ height: 1, width: 44, background: G(t.gold) }} />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  color: t.gold,
                }}
              >
                THE WISDOM GAP
              </span>
              <div style={{ height: 1, width: 44, background: G(t.gold) }} />
            </div>
            <h2
              className="vl-serif"
              style={{
                fontSize: "clamp(2rem,5vw,3.4rem)",
                fontWeight: 300,
                color: t.text,
                lineHeight: 1.2,
                marginBottom: 22,
              }}
            >
              Every year, irreplaceable judgment
              <br />
              <em style={{ color: t.gold }}>disappears in silence.</em>
            </h2>
            <p
              style={{
                fontSize: 17,
                color: t.textMuted,
                lineHeight: 1.85,
                maxWidth: 680,
                margin: "0 auto 16px",
              }}
            >
              When a founder dies, an elder develops dementia, or a family
              leader becomes incapacitated — their wealth may survive. But the
              thinking that built it does not. Children inherit assets without
              understanding the logic behind them. Families fracture over
              decisions the founder would have resolved instinctively.
            </p>
            <p
              style={{
                fontSize: 17,
                color: t.textMuted,
                lineHeight: 1.85,
                maxWidth: 680,
                margin: "0 auto 52px",
              }}
            >
              The problem is not informational. Documents survive. Financial
              records persist.{" "}
              <strong style={{ color: t.text }}>
                What disappears is judgment
              </strong>{" "}
              — the internal logic a person used to make decisions, evaluate
              risk, resolve conflicts, and navigate situations that had no clear
              answer.{" "}
              <strong style={{ color: t.text }}>
                We call this the Wisdom Gap.
              </strong>
            </p>

            <div
              className="vl-stats"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 16,
                marginBottom: 56,
              }}
            >
              {[
                {
                  num: "$84T",
                  label: "in global assets transferring to the next generation",
                  sub: "Without the judgment that created and managed them",
                },
                {
                  num: "70%",
                  label: "of family businesses fail by the 2nd generation",
                  sub: "Not from lack of capital — from lack of the founder's transferred judgment",
                },
                {
                  num: "55M+",
                  label: "people living with dementia worldwide today",
                  sub: "Each with a narrowing window to preserve their reasoning",
                },
              ].map(({ num, label, sub }) => (
                <div
                  key={num}
                  style={{
                    background: t.statBg,
                    border: `1px solid ${t.statBorder}`,
                    borderRadius: 16,
                    padding: "26px 18px",
                    transition: "background 0.4s",
                  }}
                >
                  <div
                    className="vl-serif"
                    style={{
                      fontSize: "2.2rem",
                      fontWeight: 600,
                      color: t.gold,
                      marginBottom: 10,
                    }}
                  >
                    {num}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: t.text,
                      fontWeight: 500,
                      lineHeight: 1.5,
                      marginBottom: 6,
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{ fontSize: 12, color: t.textDim, lineHeight: 1.5 }}
                  >
                    {sub}
                  </div>
                </div>
              ))}
            </div>
            <div className="vl-divider" />
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          style={{
            padding: "80px 5vw 100px",
            background: t.bgAlt,
            borderTop: `1px solid ${t.border}`,
            transition: "background 0.4s",
          }}
        >
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 14,
                  marginBottom: 20,
                }}
              >
                <div style={{ height: 1, width: 40, background: G(t.gold) }} />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.2em",
                    color: t.gold,
                  }}
                >
                  HOW VEDA WORKS
                </span>
                <div style={{ height: 1, width: 40, background: G(t.gold) }} />
              </div>
              <h2
                className="vl-serif"
                style={{
                  fontSize: "clamp(1.9rem,5vw,3rem)",
                  fontWeight: 300,
                  color: t.text,
                  lineHeight: 1.2,
                  marginBottom: 14,
                }}
              >
                Three phases. Zero screens
                <br />
                <em style={{ color: t.gold }}>required for the elder.</em>
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: t.textMuted,
                  maxWidth: 560,
                  margin: "0 auto",
                }}
              >
                Veda's primary users — aging founders, elders, family leaders —
                are not typically early technology adopters. A phone call is the
                most universally accessible interface available. So that's all
                we require.
              </p>
            </div>
            <div
              className="vl-process"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 18,
              }}
            >
              {[
                {
                  step: "01",
                  icon: "📞",
                  title: "Capture",
                  body: "The elder receives a phone call. No app, no software, no screen. An AI Conversation Orchestrator dynamically guides a 20–45 minute session, asking questions that surface reasoning patterns — not stories. Sessions repeat over weeks and months, building progressive depth.",
                },
                {
                  step: "02",
                  icon: "🧠",
                  title: "Extract & Validate",
                  body: "A five-pass Cognitive Extraction Pipeline processes each session — identifying decision heuristics, core values, mental models, and conditional exceptions. Then the person validates the AI's understanding, correcting it where needed. The replica is authorized, not guessed at.",
                },
                {
                  step: "03",
                  icon: "💬",
                  title: "Consult",
                  body: "Family members and successors ask questions. The AI applies the person's actual verified logic to new situations — responding in text, then cloned voice audio, then realistic avatar video. When the system doesn't know, it says so. It never fabricates reasoning.",
                },
              ].map(({ step, icon, title, body }) => (
                <div
                  key={step}
                  style={{
                    background: t.featureBg,
                    border: `1px solid ${t.featureBorder}`,
                    borderRadius: 16,
                    padding: "30px 22px",
                    borderTop: `3px solid ${t.gold}`,
                    transition: "background 0.4s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 16,
                    }}
                  >
                    <span style={{ fontSize: 22 }}>{icon}</span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.15em",
                        color: t.gold,
                      }}
                    >
                      PHASE {step}
                    </span>
                  </div>
                  <h3
                    className="vl-serif"
                    style={{
                      fontSize: "1.35rem",
                      fontWeight: 400,
                      color: t.text,
                      marginBottom: 12,
                    }}
                  >
                    {title}
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      color: t.textMuted,
                      lineHeight: 1.75,
                    }}
                  >
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHO IT'S FOR */}
        <section
          style={{
            padding: "80px 5vw 100px",
            background: t.bg,
            transition: "background 0.4s",
          }}
        >
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 14,
                  marginBottom: 20,
                }}
              >
                <div style={{ height: 1, width: 40, background: G(t.gold) }} />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.2em",
                    color: t.gold,
                  }}
                >
                  WHO VEDA IS FOR
                </span>
                <div style={{ height: 1, width: 40, background: G(t.gold) }} />
              </div>
              <h2
                className="vl-serif"
                style={{
                  fontSize: "clamp(1.9rem,5vw,3rem)",
                  fontWeight: 300,
                  color: t.text,
                  lineHeight: 1.2,
                }}
              >
                Built for families, founders,
                <br />
                <em style={{ color: t.gold }}>
                  and elders who think in generations.
                </em>
              </h2>
            </div>
            <div
              className="vl-features"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
                gap: 16,
              }}
            >
              {[
                {
                  icon: "🕐",
                  title: "Early Cognitive Decline",
                  desc: "There is a 5–10 year window when someone in early decline still reasons clearly. Veda is designed to be used now — capturing reasoning before the window narrows. Not after a diagnosis forces the conversation. Before one is needed.",
                },
                {
                  icon: "🌍",
                  title: "Senior Citizens",
                  desc: "Across Africa, an enormous amount of institutional and family knowledge exists only in oral form — held by elders with no digital footprint. When they pass, it is gone. Voice-based capture is not just an option here. It is the only option.",
                },
                {
                  icon: "👔",
                  title: "Founders & CEOs",
                  desc: "You know things no document captures — why certain partnerships matter, which risks are acceptable, when to break your own rules. Veda preserves your operating system before it can only be guessed at by the people who inherit what you built.",
                },
                {
                  icon: "🏛️",
                  title: "High-Net-Worth Families",
                  desc: "Significant family wealth in Nigeria and globally depends on the judgment of one or two senior members. When that judgment becomes unavailable, the family often fractures. Veda makes it consultable — permanently.",
                },
              ].map(({ icon, title, desc }) => (
                <div
                  key={title}
                  style={{
                    background: t.featureBg,
                    border: `1px solid ${t.featureBorder}`,
                    borderRadius: 14,
                    padding: "26px 20px",
                    transition: "background 0.4s",
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 14 }}>{icon}</div>
                  <h4
                    className="vl-serif"
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 400,
                      color: t.text,
                      marginBottom: 10,
                    }}
                  >
                    {title}
                  </h4>
                  <p
                    style={{
                      fontSize: 13,
                      color: t.textMuted,
                      lineHeight: 1.75,
                    }}
                  >
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WE'RE COOKING */}
        <section
          style={{
            padding: "80px 5vw 100px",
            background: t.bgAlt,
            borderTop: `1px solid ${t.border}`,
            transition: "background 0.4s",
          }}
        >
          <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 32,
              }}
            >
              <div style={{ height: 1, width: 40, background: G(t.gold) }} />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  color: t.gold,
                }}
              >
                IN DEVELOPMENT
              </span>
              <div style={{ height: 1, width: 40, background: G(t.gold) }} />
            </div>
            <h2
              className="vl-serif vl-cook-title"
              style={{
                fontSize: "clamp(2.2rem,5.5vw,3.6rem)",
                fontWeight: 300,
                color: t.text,
                lineHeight: 1.15,
                marginBottom: 22,
              }}
            >
              🍳 We're cooking.
              <br />
              <em style={{ color: t.gold }}>Something important.</em>
            </h2>
            <p
              style={{
                fontSize: 17,
                color: t.textMuted,
                lineHeight: 1.85,
                marginBottom: 16,
              }}
            >
              The core voice capture system is already built and operational.
              The AI reasoning engine is in active development. We are preparing
              for our first private beta cohort in Nigeria, with global
              expansion to follow.
            </p>
            <p
              style={{
                fontSize: 17,
                color: t.textMuted,
                lineHeight: 1.85,
                marginBottom: 48,
              }}
            >
              <strong style={{ color: t.text }}>
                Early access members receive priority onboarding, founding
                member pricing, and direct access to the team.
              </strong>{" "}
              The window to join is open now.
            </p>

            {/* Big CTA */}
            <div
              style={{
                background: t.cookingBg,
                border: `1px solid ${t.cookingBorder}`,
                borderRadius: 22,
                padding: "clamp(36px,6vw,52px) clamp(20px,5vw,44px)",
                transition: "background 0.4s",
              }}
            >
              <h3
                className="vl-serif"
                style={{
                  fontSize: "clamp(1.6rem,4vw,2.3rem)",
                  fontWeight: 400,
                  color: t.text,
                  marginBottom: 12,
                }}
              >
                Join our waitlist.
              </h3>
              <p
                style={{
                  fontSize: 15,
                  color: t.textMuted,
                  lineHeight: 1.7,
                  marginBottom: 30,
                  maxWidth: 420,
                  margin: "0 auto 30px",
                }}
              >
                Be the first person we tell when Veda Legacy is ready. One
                email. No spam. No noise.
              </p>
              <InlineWaitlist t={t} />
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section
          style={{
            padding: "80px 5vw",
            textAlign: "center",
            borderTop: `1px solid ${t.border}`,
            background: t.bg,
            transition: "background 0.4s",
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.22em",
              color: t.gold,
              marginBottom: 16,
            }}
          >
            THE EARLY WINDOW IS STILL OPEN
          </p>
          <h2
            className="vl-serif"
            style={{
              fontSize: "clamp(1.8rem,4vw,2.8rem)",
              fontWeight: 300,
              color: t.text,
              marginBottom: 30,
            }}
          >
            The most loving thing you can do
            <br />
            is <em style={{ color: t.gold }}>not wait</em> for a diagnosis.
          </h2>
          <button
            className="vl-gold"
            onClick={() => setShowWaitlist(true)}
            style={{
              padding: "20px 60px",
              borderRadius: 16,
              fontSize: 17,
              letterSpacing: "0.08em",
              marginBottom: 16,
            }}
          >
            JOIN THE WAITLIST
          </button>
          <p style={{ fontSize: 13, color: t.textDim }}>
            Or{" "}
            <button
              onClick={() => setShowDemo(true)}
              style={{
                background: "none",
                border: "none",
                color: t.goldLight,
                cursor: "pointer",
                textDecoration: "underline",
                fontSize: 13,
                fontFamily: "inherit",
              }}
            >
              request a live demo
            </button>{" "}
            to see how Veda works.
          </p>
        </section>

        {/* FOOTER */}
        <footer
          style={{
            borderTop: `1px solid ${t.border}`,
            background: t.footerBg,
            padding: "48px 5vw 28px",
            transition: "background 0.4s",
          }}
        >
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div
              className="vl-footer-top"
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 32,
                marginBottom: 40,
              }}
            >
              {/* Brand */}
              <div style={{ maxWidth: 280 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 14,
                  }}
                >
                  <VedaLogo size={22} color={t.gold} />
                  <span
                    className="vl-serif"
                    style={{
                      fontSize: 15,
                      fontWeight: 300,
                      color: t.gold,
                      letterSpacing: "0.2em",
                    }}
                  >
                    VEDA LEGACY
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: t.textMuted,
                    lineHeight: 1.75,
                    marginBottom: 16,
                  }}
                >
                  AI Cognitive Continuity Infrastructure. Preserving human
                  judgment across generations — for families, founders, and
                  elders.
                </p>
                {/* <p style={{ fontSize: 12, color: t.textDim, marginBottom: 4 }}>
                  Founded by{" "}
                  <strong style={{ color: t.textMuted }}>Adeyemi Olaoye</strong>
                </p>
                <p style={{ fontSize: 12, color: t.textDim }}>
                  Incorporated in Nigeria · Expanding globally
                </p> */}
              </div>

              {/* Social links */}
              <div>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.16em",
                    color: t.gold,
                    marginBottom: 16,
                  }}
                >
                  FOLLOW OUR JOURNEY
                </p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {[
                    {
                      href: SOCIAL.linkedin,
                      Icon: LinkedInIcon,
                      label: "LinkedIn",
                      handle: "@veda-legacy",
                    },
                    {
                      href: SOCIAL.facebook,
                      Icon: FacebookIcon,
                      label: "Facebook",
                      handle: "@vedalegacy",
                    },
                    {
                      href: SOCIAL.instagram,
                      Icon: InstagramIcon,
                      label: "Instagram",
                      handle: "@vedalegacy",
                    },
                    {
                      href: SOCIAL.tiktok,
                      Icon: TikTokIcon,
                      label: "TikTok",
                      handle: "@vedalegacy",
                    },
                  ].map(({ href, Icon, label, handle }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        textDecoration: "none",
                        color: t.textMuted,
                        fontSize: 13,
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = t.gold)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = t.textMuted)
                      }
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: t.socialBg,
                          border: `1px solid ${t.border}`,
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={13} />
                      </span>
                      <span>
                        {label}{" "}
                        <span style={{ color: t.textDim, fontSize: 12 }}>
                          {handle}
                        </span>
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Mini CTA */}
              <div style={{ maxWidth: 210 }}>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.16em",
                    color: t.gold,
                    marginBottom: 14,
                  }}
                >
                  GET EARLY ACCESS
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: t.textMuted,
                    lineHeight: 1.7,
                    marginBottom: 16,
                  }}
                >
                  Private beta launching in Nigeria. Early members get founding
                  pricing and priority onboarding.
                </p>
                <button
                  className="vl-gold"
                  onClick={() => setShowWaitlist(true)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 11,
                    fontSize: 13,
                  }}
                >
                  Join Waitlist →
                </button>
                <div style={{ height: 10 }} />
                <button
                  className="vl-ghost"
                  onClick={() => setShowDemo(true)}
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    borderRadius: 11,
                    fontSize: 13,
                  }}
                >
                  Request a Demo
                </button>
              </div>
            </div>

            <div className="vl-divider" style={{ marginBottom: 22 }} />

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <p style={{ fontSize: 12, color: t.textDim }}>
                © {new Date().getFullYear()} Veda Legacy. All rights reserved.
              </p>
              <SocialRow size={14} gap={6} />
              <button className="vl-theme" onClick={() => setIsDark((d) => !d)}>
                {isDark ? <SunIcon /> : <MoonIcon />}
                <span>Switch to {isDark ? "Light" : "Dark"} Mode</span>
              </button>
            </div>
          </div>
        </footer>
      </div>

      {showWaitlist && (
        <WaitlistPopup onClose={() => setShowWaitlist(false)} t={t} />
      )}
      <DemoModal isOpen={showDemo} onClose={() => setShowDemo(false)} t={t} />
    </>
  );
}
