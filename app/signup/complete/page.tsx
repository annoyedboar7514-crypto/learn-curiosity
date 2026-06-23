"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { colors, fonts, radius, shadow } from "@/lib/theme";

type GradeBand = "K-2" | "3-4" | "5-6";

export default function CompleteSignupPage() {
  const router = useRouter();
  const [nickname, setNickname]     = useState("");
  const [gradeBand, setGradeBand]   = useState<GradeBand | "">("");
  const [consent, setConsent]       = useState({ terms: false, coppa: false, age: false });
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (nickname.trim().length < 2)           { setError("Please enter a nickname (at least 2 characters)."); return; }
    if (!gradeBand)                            { setError("Please select a grade level."); return; }
    if (!consent.terms || !consent.coppa || !consent.age) {
      setError("Please agree to all three consent items to continue."); return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/profile/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: nickname.trim(), gradeBand, consent }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong."); return; }
      router.push("/quiz");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", background: colors.cream,
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "48px 16px 80px", fontFamily: fonts.base,
    }}>
      <div style={{ width: "100%", maxWidth: 480 }}>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/">
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
              <div style={{ position: "relative", width: 56, height: 42 }}>
                <Image src="/brand/Logo.png" alt="Learn Curiosity" fill sizes="56px" style={{ objectFit: "contain" }} />
              </div>
            </div>
          </Link>
          <div style={{ fontFamily: fonts.heading, fontSize: 24, fontWeight: 900, color: colors.teal }}>
            One more step!
          </div>
          <div style={{ fontFamily: fonts.base, fontSize: 13, color: colors.gray, marginTop: 4 }}>
            Tell us about your child so we can personalize their experience.
          </div>
        </div>

        <div style={{
          background: colors.white, borderRadius: radius.xl,
          boxShadow: shadow.lg, padding: "36px 40px",
        }}>
          <form onSubmit={handleSubmit}>

            {/* Nickname */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontFamily: fonts.base, fontSize: 13.5, fontWeight: 600, color: colors.charcoal, marginBottom: 6 }}>
                Child&apos;s nickname
              </label>
              <input
                type="text" value={nickname} required autoFocus
                onChange={e => setNickname(e.target.value)}
                placeholder="e.g. Sam, Mia, Explorer"
                style={{
                  width: "100%", boxSizing: "border-box", padding: "12px 14px",
                  fontFamily: fonts.base, fontSize: 15, color: colors.charcoal,
                  background: colors.white, border: `1.5px solid ${colors.grayMid}`,
                  borderRadius: radius.sm, outline: "none",
                }}
              />
              <p style={{ fontFamily: fonts.base, fontSize: 12, color: colors.gray, marginTop: 4 }}>
                We use a nickname only — never a full name.
              </p>
            </div>

            {/* Grade band */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontFamily: fonts.base, fontSize: 13.5, fontWeight: 600, color: colors.charcoal, marginBottom: 10 }}>
                Grade level
              </label>
              <div style={{ display: "flex", gap: 10 }}>
                {(["K-2", "3-4", "5-6"] as GradeBand[]).map(g => (
                  <button
                    key={g} type="button"
                    onClick={() => setGradeBand(g)}
                    style={{
                      flex: 1, padding: "12px 8px", borderRadius: radius.sm, cursor: "pointer",
                      fontFamily: fonts.base, fontSize: 14, fontWeight: 600,
                      border: `2px solid ${gradeBand === g ? colors.teal : colors.grayMid}`,
                      background: gradeBand === g ? `${colors.teal}10` : colors.white,
                      color: gradeBand === g ? colors.teal : colors.charcoal,
                      transition: "all 0.15s",
                    }}
                  >
                    {g === "K-2" ? "K–2" : g === "3-4" ? "3–4" : "5–6"}
                  </button>
                ))}
              </div>
            </div>

            {/* COPPA consent */}
            <div style={{ marginBottom: 24, background: "#f9f7f3", borderRadius: radius.sm, padding: "16px 18px" }}>
              <p style={{ fontFamily: fonts.base, fontSize: 13, fontWeight: 700, color: colors.charcoal, marginBottom: 12 }}>
                Parent consent (required by COPPA)
              </p>
              {[
                { key: "terms" as const, label: "I agree to the Terms of Service and Privacy Policy." },
                { key: "coppa" as const, label: "I consent to data collection for my child under COPPA guidelines." },
                { key: "age"  as const, label: "I confirm I am at least 18 years old and the parent or guardian." },
              ].map(item => (
                <label key={item.key} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10, cursor: "pointer" }}>
                  <input
                    type="checkbox" checked={consent[item.key]}
                    onChange={e => setConsent(prev => ({ ...prev, [item.key]: e.target.checked }))}
                    style={{ marginTop: 2, accentColor: colors.teal, width: 16, height: 16, flexShrink: 0 }}
                  />
                  <span style={{ fontFamily: fonts.base, fontSize: 13, color: colors.charcoal, lineHeight: 1.5 }}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>

            {error && (
              <div style={{
                marginBottom: 16, padding: "10px 14px",
                background: colors.redLight, border: `1px solid ${colors.red}20`,
                borderRadius: radius.sm, fontFamily: fonts.base, fontSize: 13.5, color: colors.red,
              }}>
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              style={{
                width: "100%", padding: "14px 24px",
                fontFamily: fonts.base, fontSize: 16, fontWeight: 700,
                color: colors.white,
                background: loading ? colors.grayMid : colors.teal,
                border: "none", borderRadius: radius.sm, cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Saving…" : "Next: take the quiz →"}
            </button>
            <p style={{ textAlign: "center", fontFamily: fonts.base, fontSize: 12, color: colors.gray, marginTop: 10 }}>
              A quick 5-minute quiz to find your child&apos;s mentor — required before lessons unlock.
            </p>
          </form>
        </div>

        <p style={{ textAlign: "center", fontFamily: fonts.base, fontSize: 12, color: colors.gray, marginTop: 20 }}>
          Wrong account?{" "}
          <SignOutButton redirectUrl="/">
            <button style={{ background: "none", border: "none", color: colors.teal, cursor: "pointer", fontSize: 12, padding: 0, fontFamily: fonts.base, textDecoration: "underline" }}>
              Sign out
            </button>
          </SignOutButton>
        </p>
      </div>
    </div>
  );
}
