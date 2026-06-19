"use client";

import React, { useState, useRef } from "react";
import { colors, fonts, radius, shadow } from "@/lib/theme";
import { TermsContent } from "@/app/components/TermsContent";

type GradeBand = "K-2" | "3-4" | "5-6";

interface ParentForm {
  email: string;
  password: string;
  confirmPassword: string;
}

interface ChildForm {
  nickname: string;
  gradeBand: GradeBand | "";
}

interface ConsentForm {
  agreedToTerms: boolean;
  agreedToCoppa: boolean;
  agreedToAge: boolean;
}

const STEPS = ["Your Account", "Terms & Consent", "Child Profile", "You're In"];

const StepIndicator: React.FC<{ current: number }> = ({ current }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 36 }}>
    {STEPS.map((label, i) => {
      const done   = i < current;
      const active = i === current;
      return (
        <React.Fragment key={i}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: done || active ? colors.teal : colors.grayLight,
              border: `2px solid ${done || active ? colors.teal : colors.grayMid}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: fonts.base, fontSize: 14, fontWeight: 700,
              color: done || active ? colors.white : colors.gray,
              transition: "all 0.25s",
            }}>
              {done ? "✓" : i + 1}
            </div>
            <span style={{
              fontFamily: fonts.base, fontSize: 11, fontWeight: active ? 700 : 400,
              color: active ? colors.teal : done ? colors.gray : colors.grayMid,
              whiteSpace: "nowrap",
            }}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{
              width: 60, height: 2, margin: "0 4px",
              background: i < current ? colors.teal : colors.grayMid,
              marginBottom: 24,
              transition: "background 0.25s",
            }} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

const Input: React.FC<InputProps> = ({ label, error, hint, id, ...rest }) => {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div style={{ marginBottom: 20 }}>
      <label htmlFor={fieldId} style={{
        display: "block", fontFamily: fonts.base, fontSize: 13.5,
        fontWeight: 600, color: colors.charcoal, marginBottom: 6,
      }}>
        {label}
      </label>
      <input
        id={fieldId}
        {...rest}
        style={{
          width: "100%", boxSizing: "border-box",
          padding: "12px 14px",
          fontFamily: fonts.base, fontSize: 15, color: colors.charcoal,
          background: colors.white,
          border: `1.5px solid ${error ? colors.red : colors.grayMid}`,
          borderRadius: radius.sm,
          outline: "none",
          transition: "border-color 0.15s",
        }}
        onFocus={e => { e.currentTarget.style.borderColor = error ? colors.red : colors.teal; }}
        onBlur={e  => { e.currentTarget.style.borderColor = error ? colors.red : colors.grayMid; }}
      />
      {hint && !error && (
        <p style={{ margin: "4px 0 0", fontFamily: fonts.base, fontSize: 12, color: colors.gray }}>{hint}</p>
      )}
      {error && (
        <p style={{ margin: "4px 0 0", fontFamily: fonts.base, fontSize: 12, color: colors.red }}>{error}</p>
      )}
    </div>
  );
};

const PrimaryButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  loading?: boolean;
}> = ({ children, onClick, type = "button", disabled, loading }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled || loading}
    style={{
      width: "100%", padding: "14px 24px",
      fontFamily: fonts.base, fontSize: 16, fontWeight: 700,
      color: colors.white,
      background: disabled || loading ? colors.grayMid : colors.teal,
      border: "none", borderRadius: radius.sm,
      cursor: disabled || loading ? "not-allowed" : "pointer",
      transition: "background 0.15s, transform 0.1s",
      letterSpacing: 0.3,
    }}
    onMouseEnter={e => { if (!disabled && !loading) e.currentTarget.style.background = colors.tealDark; }}
    onMouseLeave={e => { if (!disabled && !loading) e.currentTarget.style.background = colors.teal; }}
  >
    {loading ? "Please wait…" : children}
  </button>
);

const SecondaryButton: React.FC<{ children: React.ReactNode; onClick: () => void }> = ({ children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      width: "100%", padding: "12px 24px", marginTop: 10,
      fontFamily: fonts.base, fontSize: 14, fontWeight: 600,
      color: colors.gray, background: "transparent",
      border: `1.5px solid ${colors.grayMid}`, borderRadius: radius.sm,
      cursor: "pointer", transition: "border-color 0.15s",
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = colors.gray; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = colors.grayMid; }}
  >
    {children}
  </button>
);

const Checkbox: React.FC<{
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  label: React.ReactNode;
  required?: boolean;
}> = ({ id, checked, onChange, label, required }) => (
  <label htmlFor={id} style={{
    display: "flex", alignItems: "flex-start", gap: 12,
    cursor: "pointer", marginBottom: 16,
    fontFamily: fonts.base, fontSize: 13.5, color: colors.charcoal, lineHeight: 1.5,
  }}>
    <div style={{ position: "relative", flexShrink: 0, marginTop: 2 }}>
      <input
        id={id} type="checkbox" checked={checked}
        onChange={e => onChange(e.target.checked)}
        required={required}
        style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
      />
      <div style={{
        width: 20, height: 20, borderRadius: 4,
        border: `2px solid ${checked ? colors.teal : colors.grayMid}`,
        background: checked ? colors.teal : colors.white,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.15s",
      }}>
        {checked && <span style={{ color: colors.white, fontSize: 13, lineHeight: 1 }}>✓</span>}
      </div>
    </div>
    <span>{label}</span>
  </label>
);

const gradeBands: { value: GradeBand; label: string; ages: string; description: string }[] = [
  { value: "K-2",  label: "Grades K–2",  ages: "Ages 5–8",   description: "Visual lessons, tap-to-choose responses, simple vocabulary." },
  { value: "3-4",  label: "Grades 3–4",  ages: "Ages 8–10",  description: "More text, short written responses, richer story detail." },
  { value: "5-6",  label: "Grades 5–6",  ages: "Ages 10–12", description: "Open-ended questions, nuanced dilemmas, near-adult dialogue." },
];

const GradeBandSelector: React.FC<{
  value: GradeBand | "";
  onChange: (v: GradeBand) => void;
}> = ({ value, onChange }) => (
  <div style={{ marginBottom: 20 }}>
    <p style={{
      fontFamily: fonts.base, fontSize: 13.5, fontWeight: 600,
      color: colors.charcoal, margin: "0 0 10px 0",
    }}>
      Grade Band
    </p>
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {gradeBands.map(b => {
        const selected = value === b.value;
        return (
          <button
            key={b.value}
            type="button"
            onClick={() => onChange(b.value)}
            style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "14px 18px", textAlign: "left",
              background: selected ? colors.tealLight : colors.white,
              border: `2px solid ${selected ? colors.teal : colors.grayMid}`,
              borderRadius: radius.md, cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            <div style={{
              width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
              border: `2px solid ${selected ? colors.teal : colors.grayMid}`,
              background: selected ? colors.teal : colors.white,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {selected && <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors.white }} />}
            </div>
            <div>
              <div style={{ fontFamily: fonts.base, fontSize: 14, fontWeight: 700, color: selected ? colors.teal : colors.charcoal }}>
                {b.label} <span style={{ fontWeight: 400, color: colors.gray }}>· {b.ages}</span>
              </div>
              <div style={{ fontFamily: fonts.base, fontSize: 12.5, color: colors.gray, marginTop: 2 }}>
                {b.description}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

// ── Step 1: Parent Account ────────────────────────────────────────────────────

const StepParentAccount: React.FC<{
  data: ParentForm;
  onChange: (d: ParentForm) => void;
  onNext: () => void;
}> = ({ data, onChange, onNext }) => {
  const [errors, setErrors] = useState<Partial<ParentForm>>({});

  const validate = () => {
    const e: Partial<ParentForm> = {};
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = "Enter a valid email address.";
    if (!data.password || data.password.length < 8) e.password = "Password must be at least 8 characters.";
    if (data.password !== data.confirmPassword) e.confirmPassword = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div>
      <h2 style={{ fontFamily: fonts.heading, fontSize: 22, fontWeight: 800, color: colors.charcoal, margin: "0 0 6px 0" }}>
        Create your parent account
      </h2>
      <p style={{ fontFamily: fonts.base, fontSize: 14, color: colors.gray, margin: "0 0 28px 0" }}>
        You manage everything. Your child uses their own profile.
      </p>

      <Input
        label="Email address" type="email" autoComplete="email"
        value={data.email} onChange={e => onChange({ ...data, email: e.target.value })}
        error={errors.email} placeholder="you@example.com"
      />
      <Input
        label="Password" type="password" autoComplete="new-password"
        value={data.password} onChange={e => onChange({ ...data, password: e.target.value })}
        error={errors.password} hint="At least 8 characters."
      />
      <Input
        label="Confirm password" type="password" autoComplete="new-password"
        value={data.confirmPassword} onChange={e => onChange({ ...data, confirmPassword: e.target.value })}
        error={errors.confirmPassword}
      />

      <div style={{
        padding: "14px 16px", marginBottom: 24,
        background: colors.goldLight, borderRadius: radius.sm,
        border: `1px solid ${colors.gold}`,
        fontFamily: fonts.base, fontSize: 13, color: colors.charcoal, lineHeight: 1.5,
      }}>
        <strong style={{ color: colors.gold }}>7-day free trial</strong> — full access, no charge until your trial ends.
        You can cancel anytime before it does.
      </div>

      <PrimaryButton onClick={() => { if (validate()) onNext(); }}>Continue →</PrimaryButton>
    </div>
  );
};

// ── Step 2: Terms & Consent ───────────────────────────────────────────────────

const StepTermsConsent: React.FC<{
  data: ConsentForm;
  onChange: (d: ConsentForm) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ data, onChange, onNext, onBack }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  const allChecked = data.agreedToTerms && data.agreedToCoppa && data.agreedToAge;

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) setScrolled(true);
  };

  return (
    <div>
      <h2 style={{ fontFamily: fonts.heading, fontSize: 22, fontWeight: 800, color: colors.charcoal, margin: "0 0 6px 0" }}>
        Terms &amp; parental consent
      </h2>
      <p style={{ fontFamily: fonts.base, fontSize: 14, color: colors.gray, margin: "0 0 16px 0" }}>
        Please read the full agreement below, then confirm your consent.
      </p>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          height: 320, overflowY: "auto", padding: "16px 20px",
          background: colors.grayLight, borderRadius: radius.md,
          border: `1.5px solid ${colors.grayMid}`,
          marginBottom: 20, fontSize: 13,
        }}
      >
        <TermsContent variant="compact" />
      </div>

      {!scrolled && (
        <p style={{
          fontFamily: fonts.base, fontSize: 12, color: colors.gray,
          textAlign: "center", marginBottom: 16,
        }}>
          ↓ Scroll to the bottom to unlock the checkboxes
        </p>
      )}

      <div style={{ opacity: scrolled ? 1 : 0.4, pointerEvents: scrolled ? "auto" : "none", transition: "opacity 0.3s" }}>
        <Checkbox
          id="agree-terms" checked={data.agreedToTerms}
          onChange={v => onChange({ ...data, agreedToTerms: v })}
          label={
            <span>
              I have read and agree to the{" "}
              <strong>Terms of Service and Privacy Policy</strong>, including the section on how
              Learn Curiosity uses AI to facilitate my child&apos;s sessions.
            </span>
          }
        />
        <Checkbox
          id="agree-coppa" checked={data.agreedToCoppa}
          onChange={v => onChange({ ...data, agreedToCoppa: v })}
          label={
            <span>
              I am the <strong>parent or legal guardian</strong> of the child(ren) I am enrolling.
              I understand that Learn Curiosity will collect limited information about my child
              (nickname, grade band, session logs) as described in Section 8, and I give my{" "}
              <strong>verifiable parental consent</strong> under COPPA for this data collection.
            </span>
          }
        />
        <Checkbox
          id="agree-age" checked={data.agreedToAge}
          onChange={v => onChange({ ...data, agreedToAge: v })}
          label={<span>I confirm I am <strong>18 years of age or older</strong>.</span>}
        />
      </div>

      <PrimaryButton onClick={() => { if (allChecked) onNext(); }} disabled={!allChecked || !scrolled}>
        I agree — continue →
      </PrimaryButton>
      <SecondaryButton onClick={onBack}>← Back</SecondaryButton>
    </div>
  );
};

// ── Step 3: Child Profile ─────────────────────────────────────────────────────

const StepChildProfile: React.FC<{
  data: ChildForm;
  onChange: (d: ChildForm) => void;
  onNext: () => void;
  onBack: () => void;
  loading?: boolean;
}> = ({ data, onChange, onNext, onBack, loading }) => {
  const [errors, setErrors] = useState<Partial<ChildForm>>({});

  const validate = () => {
    const e: Partial<ChildForm> = {};
    if (!data.nickname.trim() || data.nickname.trim().length < 2) e.nickname = "Enter a nickname (at least 2 characters).";
    if (!data.gradeBand) e.gradeBand = "Please select a grade band.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div>
      <h2 style={{ fontFamily: fonts.heading, fontSize: 22, fontWeight: 800, color: colors.charcoal, margin: "0 0 6px 0" }}>
        Tell us about your child
      </h2>
      <p style={{ fontFamily: fonts.base, fontSize: 14, color: colors.gray, margin: "0 0 28px 0" }}>
        We use a nickname only — never a full name. You can change this at any time.
      </p>

      <Input
        label="Nickname" type="text" autoComplete="off"
        value={data.nickname} onChange={e => onChange({ ...data, nickname: e.target.value })}
        error={errors.nickname}
        hint="What do they like to be called? (Not their full legal name.)"
        placeholder="e.g. Max, Lily, Biscuit…"
        maxLength={30}
      />

      <GradeBandSelector value={data.gradeBand} onChange={v => onChange({ ...data, gradeBand: v })} />
      {errors.gradeBand && (
        <p style={{ fontFamily: fonts.base, fontSize: 12, color: colors.red, marginTop: -10, marginBottom: 16 }}>
          {errors.gradeBand}
        </p>
      )}

      <div style={{
        padding: "14px 16px", marginBottom: 24,
        background: colors.tealLight, borderRadius: radius.sm,
        border: `1px solid ${colors.teal}20`,
        fontFamily: fonts.base, fontSize: 13, color: colors.charcoal, lineHeight: 1.5,
      }}>
        <strong style={{ color: colors.teal }}>What happens next:</strong> Your child will take a short
        interest quiz and choose their Mentor. The first lesson starts right after — no setup required.
      </div>

      <PrimaryButton onClick={() => { if (validate()) onNext(); }} loading={loading}>
        Create profile &amp; start free trial →
      </PrimaryButton>
      <SecondaryButton onClick={onBack}>← Back</SecondaryButton>
    </div>
  );
};

// ── Step 4: Confirmation ──────────────────────────────────────────────────────

const StepConfirmation: React.FC<{ childName: string; onContinue: () => void }> = ({ childName, onContinue }) => (
  <div style={{ textAlign: "center" }}>
    <div style={{
      width: 72, height: 72, borderRadius: "50%",
      background: colors.tealLight, border: `3px solid ${colors.teal}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      margin: "0 auto 24px",
      fontSize: 32,
    }}>
      ✓
    </div>
    <h2 style={{ fontFamily: fonts.heading, fontSize: 24, fontWeight: 800, color: colors.charcoal, margin: "0 0 12px 0" }}>
      You&apos;re in!
    </h2>
    <p style={{ fontFamily: fonts.base, fontSize: 15, color: colors.gray, margin: "0 0 8px 0", lineHeight: 1.6 }}>
      {childName}&apos;s profile is ready. Your 7-day free trial has started.
    </p>
    <p style={{ fontFamily: fonts.base, fontSize: 14, color: colors.gray, margin: "0 0 32px 0", lineHeight: 1.6 }}>
      Next: {childName} will take a short interest quiz and pick their Mentor. The first lesson starts immediately after.
    </p>
    <PrimaryButton onClick={onContinue}>Start {childName}&apos;s quiz →</PrimaryButton>
    <p style={{ fontFamily: fonts.base, fontSize: 12, color: colors.gray, marginTop: 16 }}>
      You&apos;ll receive a confirmation email shortly. Your parent dashboard is also ready —<br />
      you can review every session summary after {childName} completes their first lesson.
    </p>
  </div>
);

// ── Main export ───────────────────────────────────────────────────────────────

interface SignupFlowProps {
  onComplete?: (data: { parent: ParentForm; consent: ConsentForm; child: ChildForm }) => void;
  onStartQuiz?: () => void;
}

export const SignupFlow: React.FC<SignupFlowProps> = ({ onComplete, onStartQuiz }) => {
  const [step, setStep]       = useState(0);
  const [loading, setLoading] = useState(false);

  const [parent,  setParent]  = useState<ParentForm>({ email: "", password: "", confirmPassword: "" });
  const [consent, setConsent] = useState<ConsentForm>({ agreedToTerms: false, agreedToCoppa: false, agreedToAge: false });
  const [child,   setChild]   = useState<ChildForm>({ nickname: "", gradeBand: "" });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parent, consent, child }),
      });
      onComplete?.({ parent, consent, child });
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: colors.cream,
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      padding: "48px 16px 80px",
      fontFamily: fonts.base,
    }}>
      <div style={{ width: "100%", maxWidth: 480 }}>

        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontFamily: fonts.heading, fontSize: 28, fontWeight: 900, color: colors.teal, letterSpacing: -0.5 }}>
            Learn Curiosity
          </div>
          <div style={{ fontFamily: fonts.base, fontSize: 13, color: colors.gray, marginTop: 4 }}>
            Mentor-guided learning for curious kids
          </div>
        </div>

        <div style={{
          background: colors.white, borderRadius: radius.xl,
          boxShadow: shadow.lg,
          padding: "36px 40px",
        }}>
          {step < 3 && <StepIndicator current={step} />}

          {step === 0 && <StepParentAccount data={parent} onChange={setParent} onNext={() => setStep(1)} />}
          {step === 1 && <StepTermsConsent  data={consent} onChange={setConsent} onNext={() => setStep(2)} onBack={() => setStep(0)} />}
          {step === 2 && <StepChildProfile  data={child} onChange={setChild} onNext={handleSubmit} onBack={() => setStep(1)} loading={loading} />}
          {step === 3 && <StepConfirmation  childName={child.nickname} onContinue={() => onStartQuiz?.()} />}
        </div>

        {step < 3 && (
          <p style={{ textAlign: "center", fontFamily: fonts.base, fontSize: 13.5, color: colors.gray, marginTop: 20 }}>
            Already have an account?{" "}
            <a href="/login" style={{ color: colors.teal, fontWeight: 600, textDecoration: "none" }}>Sign in</a>
          </p>
        )}

        <div style={{
          marginTop: 32,
          fontFamily: fonts.base, fontSize: 11.5, color: colors.gray,
          textAlign: "center", lineHeight: 1.6,
        }}>
          Learn Curiosity is COPPA-compliant. We collect only what is necessary to operate this service.
          No advertising profiles are built from children&apos;s data. &nbsp;
          <a href="/terms" style={{ color: colors.teal, textDecoration: "none" }}>Full Terms &amp; Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};

export default SignupFlow;
