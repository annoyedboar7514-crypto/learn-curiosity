"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { colors, fonts, radius, shadow } from "@/lib/theme";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed.");
        return;
      }
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
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      padding: "48px 16px 80px", fontFamily: fonts.base,
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Link href="/">
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
              <div style={{ position: "relative", width: 60, height: 45 }}>
                <Image src="/brand/Logo.png" alt="Learn Curiosity" fill sizes="60px" style={{ objectFit: "contain" }} />
              </div>
            </div>
          </Link>
          <div style={{ fontFamily: fonts.heading, fontSize: 26, fontWeight: 900, color: colors.teal }}>
            Welcome back
          </div>
          <div style={{ fontFamily: fonts.base, fontSize: 13, color: colors.gray, marginTop: 4 }}>
            Sign in to your parent account
          </div>
        </div>

        <div style={{
          background: colors.white, borderRadius: radius.xl,
          boxShadow: shadow.lg, padding: "36px 40px",
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: "block", fontFamily: fonts.base, fontSize: 13.5,
                fontWeight: 600, color: colors.charcoal, marginBottom: 6,
              }}>
                Email address
              </label>
              <input
                type="email" value={email} autoComplete="email" required
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: "100%", boxSizing: "border-box", padding: "12px 14px",
                  fontFamily: fonts.base, fontSize: 15, color: colors.charcoal,
                  background: colors.white,
                  border: `1.5px solid ${colors.grayMid}`, borderRadius: radius.sm, outline: "none",
                }}
                onFocus={e => { e.currentTarget.style.borderColor = colors.teal; }}
                onBlur={e  => { e.currentTarget.style.borderColor = colors.grayMid; }}
                placeholder="you@example.com"
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: "block", fontFamily: fonts.base, fontSize: 13.5,
                fontWeight: 600, color: colors.charcoal, marginBottom: 6,
              }}>
                Password
              </label>
              <input
                type="password" value={password} autoComplete="current-password" required
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: "100%", boxSizing: "border-box", padding: "12px 14px",
                  fontFamily: fonts.base, fontSize: 15, color: colors.charcoal,
                  background: colors.white,
                  border: `1.5px solid ${colors.grayMid}`, borderRadius: radius.sm, outline: "none",
                }}
                onFocus={e => { e.currentTarget.style.borderColor = colors.teal; }}
                onBlur={e  => { e.currentTarget.style.borderColor = colors.grayMid; }}
              />
            </div>

            {error && (
              <div style={{
                marginBottom: 16, padding: "10px 14px",
                background: colors.redLight, border: `1px solid ${colors.red}20`,
                borderRadius: radius.sm, fontFamily: fonts.base,
                fontSize: 13.5, color: colors.red,
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
                border: "none", borderRadius: radius.sm,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Signing in…" : "Sign in →"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", fontFamily: fonts.base, fontSize: 13.5, color: colors.gray, marginTop: 20 }}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" style={{ color: colors.teal, fontWeight: 600, textDecoration: "none" }}>
            Start free trial
          </Link>
        </p>
      </div>
    </div>
  );
}
