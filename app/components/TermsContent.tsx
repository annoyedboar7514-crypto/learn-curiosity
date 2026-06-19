// Learn Curiosity — Terms of Service + Privacy Policy + COPPA Disclosure
// Rendered inside the signup flow AND available as a standalone /terms page.
// Last updated: June 2026

import React from "react";
import { colors, fonts, radius } from "@/lib/theme";

const EFFECTIVE_DATE = "June 19, 2026";
const COMPANY = "Learn Curiosity";
const CONTACT_EMAIL = "support@learncuriosity.com";

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ marginBottom: 28 }}>
    <h3 style={{
      fontFamily: fonts.heading,
      fontSize: 15,
      fontWeight: 700,
      color: colors.teal,
      margin: "0 0 8px 0",
      paddingBottom: 4,
      borderBottom: `1px solid ${colors.grayMid}`,
    }}>
      {title}
    </h3>
    <div style={{ fontFamily: fonts.base, fontSize: 13.5, color: colors.charcoal, lineHeight: 1.7 }}>
      {children}
    </div>
  </div>
);

const P: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p style={{ margin: "0 0 10px 0" }}>{children}</p>
);

const UL: React.FC<{ items: string[] }> = ({ items }) => (
  <ul style={{ margin: "4px 0 10px 20px", padding: 0 }}>
    {items.map((item, i) => (
      <li key={i} style={{ marginBottom: 4 }}>{item}</li>
    ))}
  </ul>
);

interface TermsContentProps {
  variant?: "compact" | "full";
}

export const TermsContent: React.FC<TermsContentProps> = ({ variant = "compact" }) => {
  const containerStyle: React.CSSProperties = variant === "full"
    ? { maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }
    : { padding: "4px 2px" };

  return (
    <div style={containerStyle}>
      {variant === "full" && (
        <div style={{ marginBottom: 40 }}>
          <h1 style={{
            fontFamily: fonts.heading, fontSize: 32, fontWeight: 800,
            color: colors.charcoal, margin: "0 0 8px 0",
          }}>
            Terms of Service &amp; Privacy Policy
          </h1>
          <p style={{ fontFamily: fonts.base, fontSize: 14, color: colors.gray, margin: 0 }}>
            Effective date: {EFFECTIVE_DATE} &nbsp;·&nbsp; {COMPANY}
          </p>
        </div>
      )}

      <Section title="1. About This Agreement">
        <P>
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of {COMPANY} (&quot;we,&quot; &quot;us,&quot; or
          &quot;our&quot;) and form a binding legal agreement between you (the parent or legal guardian) and {COMPANY}.
          By creating an account, you confirm that you are at least 18 years old and are the parent or
          legal guardian of any child whose profile you create.
        </P>
        <P>
          {COMPANY} is designed for children in grades K–6 (approximately ages 5–12). <strong>No child
          may create an account directly.</strong> All accounts are created and managed by a parent or
          legal guardian.
        </P>
      </Section>

      <Section title="2. What Learn Curiosity Is (and Is Not)">
        <P>
          {COMPANY} is a <strong>structured, story-driven digital mentorship platform</strong> designed
          to help children develop critical thinking, resilience, creativity, communication, and
          metacognitive skills through daily guided sessions with an AI mentor.
        </P>
        <P><strong>{COMPANY} is NOT:</strong></P>
        <UL items={[
          "A tutoring service, homework helper, or academic supplement.",
          "A substitute for school instruction or professional counseling.",
          "A religious or political instructional platform. No faith tradition is taught or favored. No partisan position is taken or implied.",
          "An open-ended AI companion or chatbot. The AI mentor does not roleplay as a friend, simulate a personal relationship, or engage in unrestricted conversation outside the lesson scope.",
          "A diagnostic tool. Nothing on this platform constitutes a psychological, medical, educational, or developmental assessment.",
        ]} />
        <P>
          We are a supplemental enrichment platform. If your child is struggling academically or
          emotionally, please consult qualified educational or mental-health professionals.
        </P>
      </Section>

      <Section title="3. Accounts &amp; Eligibility">
        <P>You must be 18 or older to create an account. By signing up, you represent and warrant that:</P>
        <UL items={[
          "You are the parent or legal guardian of any child profile you create.",
          "All information you provide is accurate and current.",
          "You have the authority to agree to these Terms on behalf of your household.",
        ]} />
        <P>
          You are responsible for keeping your password confidential and for all activity under your
          account. Notify us immediately at {CONTACT_EMAIL} if you suspect unauthorized access.
        </P>
        <P>
          You may create one child profile per child in your household. Multi-child households require
          a Family tier subscription.
        </P>
      </Section>

      <Section title="4. Subscription, Billing &amp; Refunds">
        <P>
          {COMPANY} is offered on a subscription basis. Plans auto-renew until canceled. By providing
          payment information, you authorize us to charge your payment method on the recurring cycle
          you selected.
        </P>
        <P><strong>Current plan options:</strong></P>
        <UL items={[
          "Starter — $20/month: 1 child profile, 1 mentor, standard session summary.",
          "Plus — $32/month: 1 child profile, full mentor library, full conversation logs, weekly insight reports.",
          "Family — $50/month: up to 4 child profiles, all Plus features per child.",
          "3-month bundle: 10% discount, paid upfront.",
          "Annual bundle: 20% discount, paid upfront.",
        ]} />
        <P>
          All new subscriptions begin with a <strong>7-day free trial</strong>. You will not be charged
          until the trial period ends. Cancel before the trial ends and you owe nothing.
        </P>
        <P>
          Subscriptions may be canceled at any time from your account settings. Cancellation takes
          effect at the end of the current billing period; no partial-period refunds are issued except
          where required by applicable law. If you believe a charge was made in error, contact us within
          30 days at {CONTACT_EMAIL}.
        </P>
        <P>
          Payments are processed by Stripe. We do not store your full payment card details. Stripe&apos;s
          privacy policy governs their handling of payment data.
        </P>
      </Section>

      <Section title="5. Content &amp; Curriculum">
        <P>
          All lesson content — including story dilemmas, decision points, and Socratic question banks —
          is designed by human curriculum designers. The AI mentor personalizes delivery and conversation
          within the boundaries of that human-designed curriculum. <strong>The AI does not originate
          moral authority, factual claims, or educational philosophy.</strong> The human curriculum is
          always the foundation.
        </P>
        <P>
          All factual and historical content is drawn from primary sources and mainstream scholarly
          consensus. Contested current events and active political debates are excluded entirely — not
          balanced, simply not included.
        </P>
        <P>
          Content is age-banded for grades K–2, 3–4, and 5–6. We make reasonable efforts to ensure
          content is appropriate for the age band you select, but you remain responsible for monitoring
          your child&apos;s use of the platform.
        </P>
      </Section>

      <Section title="6. AI Mentor — Scope &amp; Limitations">
        <P>
          The AI mentor on {COMPANY} is powered by Claude, developed by Anthropic. The mentor operates
          within a strict, session-scoped system prompt that:
        </P>
        <UL items={[
          "Restricts the mentor to the content of the current lesson and the child's follow-up questions about it.",
          "Instructs the mentor to ask questions rather than supply conclusions.",
          "Explicitly prohibits discussion of self-harm, violence, sexual content, illegal activity, or any topic outside the platform's educational scope.",
          "Instructs the mentor to redirect gently rather than refuse abruptly when an off-topic question arises.",
          "Instructs the mentor to flag any indication of genuine distress for parent review.",
        ]} />
        <P>
          Despite these safeguards, <strong>no AI system is perfect.</strong> We strongly encourage
          parents to review session summaries and conversation logs regularly. If you observe any
          response that concerns you, please report it to {CONTACT_EMAIL} immediately.
        </P>
        <P>
          The AI mentor is not a substitute for human supervision, counseling, or parenting. It does
          not provide medical, legal, psychological, or crisis advice. If your child is in distress,
          contact a qualified professional or emergency services.
        </P>
      </Section>

      <Section title="7. Acceptable Use">
        <P>You agree not to:</P>
        <UL items={[
          "Attempt to manipulate or jailbreak the AI mentor to produce content outside its intended scope.",
          "Share account credentials with anyone outside your household.",
          "Use the platform for any commercial purpose, research, or data collection without our written consent.",
          "Reverse-engineer, scrape, or copy any content or system architecture.",
          "Use the platform in any way that violates applicable law.",
        ]} />
        <P>Violation of these terms may result in immediate account suspension without refund.</P>
      </Section>

      <Section title="8. Privacy Policy">
        <P>
          This section describes exactly what data {COMPANY} collects, why, and how long we keep it.
          We are committed to collecting only what is necessary to operate the platform.
        </P>

        <p style={{ fontWeight: 600, margin: "12px 0 6px", fontSize: 13.5 }}>What we collect from parents:</p>
        <UL items={[
          "Email address — for login, receipts, and escalation alerts.",
          "Password (hashed, never stored in plaintext).",
          "Payment method — tokenized through Stripe. We never store your full card number.",
          "Subscription tier and billing history.",
          "COPPA consent record — timestamp and confirmation of your agreement. This record is non-deletable for compliance purposes.",
        ]} />

        <p style={{ fontWeight: 600, margin: "12px 0 6px", fontSize: 13.5 }}>What we collect from child profiles:</p>
        <UL items={[
          "Nickname only — not the child's full legal name.",
          "Grade band (K–2, 3–4, or 5–6) — not exact birthdate.",
          "Interest archetype result from the onboarding quiz.",
          "Selected mentor.",
          "Current level and progress through the lesson sequence.",
          "Session conversation logs — stored for parent review and platform improvement.",
        ]} />

        <p style={{ fontWeight: 600, margin: "12px 0 6px", fontSize: 13.5 }}>What we do NOT collect:</p>
        <UL items={[
          "Photos, audio, or video of your child.",
          "Your child's full legal name.",
          "Precise location data.",
          "Any information that would allow us to build an advertising or behavioral profile.",
        ]} />

        <p style={{ fontWeight: 600, margin: "12px 0 6px", fontSize: 13.5 }}>How we use data:</p>
        <UL items={[
          "To operate the platform and personalize lesson content.",
          "To generate parent session summaries.",
          "To improve the curriculum and AI mentor quality.",
          "We never sell your data. We never use it to build advertising profiles. We never share it with third parties except as required to operate the service (payment processing, cloud hosting) or comply with law.",
        ]} />

        <p style={{ fontWeight: 600, margin: "12px 0 6px", fontSize: 13.5 }}>Data retention:</p>
        <UL items={[
          "Session logs are automatically deleted after 12 months unless you request earlier deletion.",
          "Account data is retained while your account is active.",
          "Upon account deletion, all child profile data and session logs are deleted within 30 days.",
          "COPPA consent records are retained for 5 years as required by law.",
        ]} />

        <p style={{ fontWeight: 600, margin: "12px 0 6px", fontSize: 13.5 }}>Your rights:</p>
        <UL items={[
          "Access: you may request a copy of all data we hold about you and your child at any time.",
          "Deletion: you may request deletion of your child's data at any time by emailing " + CONTACT_EMAIL + ". We will process the request within 30 days.",
          "Correction: you may update your account information in your account settings at any time.",
          "Portability: you may request an export of your child's session data.",
        ]} />
      </Section>

      <Section title="9. Children's Privacy — COPPA Compliance">
        <P>
          {COMPANY} is designed for children under 13 and complies with the{" "}
          <strong>Children&apos;s Online Privacy Protection Act (COPPA)</strong>.
        </P>
        <UL items={[
          "We do not collect personal information from children under 13 without verifiable parental consent.",
          "Verifiable parental consent is obtained through the paid account signup process, which requires an adult's payment method, combined with the explicit consent checkbox and disclosure on this screen.",
          "We do not condition a child's participation on the disclosure of more personal information than is reasonably necessary to use the service.",
          "We do not build advertising or behavioral profiles of children.",
          "Parents may review, correct, or request deletion of their child's personal information at any time.",
          "We do not share children's personal information with third parties for advertising purposes.",
        ]} />
        <P>
          For questions about our COPPA compliance or to exercise your parental rights, contact us at{" "}
          {CONTACT_EMAIL}.
        </P>
      </Section>

      <Section title="10. Intellectual Property">
        <P>
          All content on {COMPANY} — including lesson stories, video content, curriculum design, mentor
          avatars, brand assets, and the platform&apos;s code — is the intellectual property of {COMPANY} and
          is protected by copyright law. You may not reproduce, distribute, or create derivative works
          from any platform content without our written consent.
        </P>
        <P>
          Your child&apos;s responses in mentor conversations remain your family&apos;s private information. We do
          not claim ownership of anything your child writes in a session.
        </P>
      </Section>

      <Section title="11. Disclaimers &amp; Limitation of Liability">
        <P>
          The platform is provided &quot;as is.&quot; We make no guarantee that it will be available without
          interruption, error-free, or that outcomes described in our marketing will be achieved by
          every child.
        </P>
        <P>
          To the maximum extent permitted by law, {COMPANY}&apos;s total liability to you for any claim
          arising from your use of the platform will not exceed the total subscription fees you paid in
          the 3 months immediately preceding the claim.
        </P>
        <P>
          We are not liable for any indirect, incidental, special, or consequential damages arising
          from your use of the platform.
        </P>
      </Section>

      <Section title="12. Changes to These Terms">
        <P>
          We may update these Terms from time to time. When we do, we will update the effective date at
          the top of this page and notify you by email. Continued use of the platform after a Terms
          update constitutes acceptance of the revised Terms. If you do not agree with changes, you may
          cancel your subscription before they take effect.
        </P>
      </Section>

      <Section title="13. Governing Law &amp; Dispute Resolution">
        <P>
          These Terms are governed by the laws of the State of Idaho, without regard to its conflict-of-law
          provisions. Any dispute arising from these Terms will first be addressed through good-faith
          negotiation. If unresolved, disputes will be submitted to binding arbitration in Boise, Idaho
          under the rules of the American Arbitration Association. You waive the right to participate
          in a class action lawsuit or class-wide arbitration.
        </P>
      </Section>

      <Section title="14. Contact Us">
        <P>Questions about these Terms or our privacy practices? We&apos;re here.</P>
        <P>
          <strong>{COMPANY}</strong><br />
          Boise, Idaho<br />
          <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: colors.teal }}>{CONTACT_EMAIL}</a>
        </P>
      </Section>

      <div style={{
        marginTop: 32,
        padding: "20px 24px",
        background: colors.tealLight,
        borderRadius: radius.md,
        borderLeft: `4px solid ${colors.teal}`,
        fontFamily: fonts.base,
        fontSize: 13,
        color: colors.charcoal,
        lineHeight: 1.6,
      }}>
        <strong style={{ color: colors.teal, display: "block", marginBottom: 6, fontSize: 13.5 }}>
          COPPA Notice — For Parents
        </strong>
        {COMPANY} collects limited personal information from children under 13 only with verifiable
        parental consent. We collect only: a nickname, grade band, interest archetype, and session
        conversation logs. We do not collect photos, precise locations, or full legal names. We never
        build advertising profiles of children. You may review, correct, or delete your child&apos;s
        information at any time by contacting {CONTACT_EMAIL}. This platform complies with the
        Children&apos;s Online Privacy Protection Act (COPPA).
      </div>
    </div>
  );
};

export default TermsContent;
