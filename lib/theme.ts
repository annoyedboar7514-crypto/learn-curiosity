export const colors = {
  // Core brand
  teal:              "#1B6E6B",
  tealDark:          "#14524F",
  tealLight:         "#E1F5EE",
  gold:              "#E8A33D",
  goldDark:          "#C9852A",
  goldLight:         "#FDF6E0",
  cream:             "#FBF6EC",
  charcoal:          "#233137",
  border:            "#E3DCC8",
  mentorBubble:      "#E1F5EE",
  cardBg:            "#FFFFFF",
  ctaText:           "#412402",
  trailFilled:       "#B99A5A",
  trailMuted:        "#D8D0C0",

  // Pillar colors
  pillarCritical:    "#5B6FA8",
  pillarResilience:  "#4F8B6E",
  pillarCreativity:  "#8B5FA3",
  pillarArticulation:"#D9714F",
  pillarLearning:    "#C98A3E",

  // Legacy aliases (signup flow)
  gray:       "#4A5568",
  grayMid:    "#D8DDE2",
  grayLight:  "#F2F4F6",
  white:      "#FFFFFF",
  red:        "#C0392B",
  redLight:   "#FDF0EF",

  // Legacy pillar aliases
  pillar1: "#5B6FA8",
  pillar2: "#4F8B6E",
  pillar3: "#8B5FA3",
  pillar4: "#D9714F",
  pillar5: "#C98A3E",
} as const;

export const fonts = {
  display: "'Fraunces', Georgia, serif",
  body:    "'Inter', system-ui, sans-serif",
  mono:    "'IBM Plex Mono', monospace",
  // Legacy aliases
  base:    "'Inter', system-ui, sans-serif",
  heading: "'Fraunces', Georgia, serif",
};

// 4-px base spacing scale: space[n] = n × 4px
export const space: Record<number, string> = {
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "24px",
  6: "32px",
  7: "40px",
  8: "48px",
};

export const radius = {
  sm:   "6px",
  md:   "12px",
  lg:   "18px",
  xl:   "24px",
  full: "9999px",
};

export const shadow = {
  sm: "0 1px 3px rgba(0,0,0,0.08)",
  md: "0 4px 16px rgba(0,0,0,0.10)",
  lg: "0 8px 32px rgba(0,0,0,0.12)",
};

export const components = {
  card: {
    background:    "#FFFFFF",
    border:        "1px solid #E3DCC8",
    borderRadius:  "14px",
    padding:       "20px 24px",
    shadowDefault: "0 1px 3px rgba(0,0,0,0.08)",
    shadowHover:   "0 4px 16px rgba(0,0,0,0.10)",
  },
  chatBubble: {
    maxWidth: "80%",
    fontSize: "15px",
    mentor: { background: "#E1F5EE" },
    child:  { background: "#1B6E6B" },
  },
};
