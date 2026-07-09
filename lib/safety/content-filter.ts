// Input + output safety classification for the child mentor.
// This layer is INDEPENDENT of the model (defense in depth): child messages are
// screened BEFORE the Claude call, and mentor output is screened before it is
// ever shown. Nothing dangerous reaches the model, and nothing unsafe reaches
// the child. Anything serious is flagged to the parent dashboard.

export type SafetyCategory =
  | "safe"
  | "self-harm"
  | "abuse"
  | "violence"
  | "sexual"
  | "drugs"
  | "personal-info"
  | "profanity"
  | "off-scope";

// "escalate" = notify the parent immediately (self-harm, abuse, violence, sexual).
// "redirect" = gently steer back, log quietly (off-scope, drugs, PII, profanity).
export type Severity = "none" | "redirect" | "escalate";

export interface SafetyResult {
  safe: boolean;
  category: SafetyCategory;
  severity: Severity;
  escalate: boolean;            // convenience: severity === "escalate"
  redirectResponse: string | null;
}

interface Rule {
  category: SafetyCategory;
  severity: Severity;
  regex: RegExp;
}

// Order matters: most serious first, so a message is classified by its
// gravest signal. Patterns are word-bounded to limit false positives on the
// ordinary "courage / honesty / conflict" language lessons use.
const RULES: Rule[] = [
  // ---- ESCALATE (parent notified) ----
  {
    category: "self-harm",
    severity: "escalate",
    regex:
      /\b(kill(ing)?\s+my\s?self|hurt(ing)?\s+my\s?self|cut(ting)?\s+my\s?self|harm(ing)?\s+my\s?self|suicide|suicidal|want\s+to\s+die|wanna\s+die|end\s+(my|it)\s+(life|all)|don'?t\s+want\s+to\s+(live|be\s+here|be\s+alive)|no\s+reason\s+to\s+live)\b/i,
  },
  {
    // A child disclosing they are being hurt / touched / unsafe at home.
    category: "abuse",
    severity: "escalate",
    regex:
      /\b((someone|somebody|he|she|they|my\s+\w+)\s+(touch|touched|touches|hit|hits|hurt|hurts|beat|beats)\s+me|touched\s+me\s+(there|down|private)|scared\s+to\s+go\s+home|afraid\s+of\s+my\s+(dad|mom|mother|father|parent|stepdad|stepmom|uncle)|(hits|beats|hurts)\s+me\s+at\s+home|being\s+abused|not\s+safe\s+at\s+home|makes?\s+me\s+keep\s+(a\s+)?secret)\b/i,
  },
  {
    category: "violence",
    severity: "escalate",
    regex:
      /\b(i\s+(want|wanna|going)\s+to\s+(kill|shoot|stab|hurt|beat\s+up)\s+(you|them|him|her|someone|everyone)|bring\s+a\s+(gun|knife|weapon)\s+to\s+school|shoot\s+up|make\s+a\s+bomb|how\s+to\s+(make|build)\s+a\s+(bomb|weapon))\b/i,
  },
  {
    category: "sexual",
    severity: "escalate",
    regex:
      /\b(sex|sexual|porn|pornography|naked|nude|nudes|boobs|penis|vagina|genitals|masturbat|blowjob|rape|molest)\b/i,
  },

  // ---- REDIRECT (steer back, log quietly) ----
  {
    // Child sharing personal/contact info — deflect for privacy, don't alarm.
    category: "personal-info",
    severity: "redirect",
    regex:
      /(\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b|\bmy\s+(address|phone\s+number|password|last\s+name|full\s+name|home)\s+is\b|\bi\s+live\s+(at|on)\s+\d|\b[\w.+-]+@[\w-]+\.[a-z]{2,}\b|\bmeet\s+(me|up)\s+(in\s+person|irl|at\s+my)|\bwhat'?s\s+your\s+(address|phone|real\s+name)\b)/i,
  },
  {
    category: "drugs",
    severity: "redirect",
    regex:
      /\b(cocaine|heroin|meth|fentanyl|weed|marijuana|smoke\s+weed|vape|vaping|get\s+high|illegal\s+drugs|alcohol|drunk|beer|cigarette)\b/i,
  },
  {
    category: "profanity",
    severity: "redirect",
    regex: /\b(f+u+c+k+\w*|sh+i+t+\w*|b+i+t+c+h+\w*|a+s+s+h+o+l+e+\w*|d+a+m+n+\s+you|bastard|dickhead)/i,
  },
];

const REDIRECTS: Record<SafetyCategory, string> = {
  safe: "",
  "self-harm":
    "That sounds really heavy, and I'm glad you felt you could say it. This is bigger than our story — the most important thing right now is to tell a grown-up you trust, like a parent, a teacher, or another adult close to you, exactly what you told me. Can you think of someone like that you could talk to today?",
  abuse:
    "Thank you for telling me that — that took courage, and it's not your fault. Something like this is really important, and the best thing is to tell a grown-up you trust and feel safe with, like a teacher or another caring adult. You deserve to feel safe. Is there someone like that you could talk to?",
  violence:
    "That's not something we explore here, and if you're having a really hard feeling it helps to talk to a grown-up you trust. For now, let's come back to our story — what did you think about the choice the character made?",
  sexual:
    "That's outside what we talk about in our lessons. Let's head back to the story — what were you thinking about the question I asked?",
  drugs:
    "That's not something our story covers. Let's return to the lesson — what did the character's decision make you think about?",
  "personal-info":
    "Let's keep things like your address, phone, or full name private — even from me. What matters here is your thinking, not those details! Back to our story — what were you figuring out?",
  profanity:
    "Ha — I hear you feel strongly about it! Let's put it in different words. What was going through your mind when you said that?",
  "off-scope":
    "Ooh, that's a fun thing to wonder about, but it's a little outside our lesson today. Let's come back to it — what did you think about the story?",
};

/** Classify a child's message. Runs before the model is ever called. */
export function classifyInput(text: string): SafetyResult {
  const t = text ?? "";
  for (const rule of RULES) {
    if (rule.regex.test(t)) {
      return {
        safe: false,
        category: rule.category,
        severity: rule.severity,
        escalate: rule.severity === "escalate",
        redirectResponse: REDIRECTS[rule.category],
      };
    }
  }
  return { safe: true, category: "safe", severity: "none", escalate: false, redirectResponse: null };
}

// ---------------------------------------------------------------------------
// Output guard — screens what the MENTOR says before the child sees it.
// Claude is already safe by design; this is the belt-and-suspenders layer the
// blueprint requires (a check the platform owns, independent of the model).
// ---------------------------------------------------------------------------

const OUTPUT_BLOCK =
  /\b(sex|sexual|porn|naked|nude|penis|vagina|suicide|kill\s+yourself|self-harm|cocaine|heroin|meth|your\s+(address|phone\s+number|password)|where\s+do\s+you\s+live|what'?s\s+your\s+(address|phone|last\s+name))\b/i;

export interface OutputResult {
  safe: boolean;
  text: string;      // safe text to show (original, or a fallback if blocked)
  blocked: boolean;
}

export function checkMentorOutput(text: string): OutputResult {
  if (OUTPUT_BLOCK.test(text ?? "")) {
    return {
      safe: false,
      blocked: true,
      text: "Let's stay with our story for now. What were you thinking about the choice the character made?",
    };
  }
  return { safe: true, blocked: false, text };
}
