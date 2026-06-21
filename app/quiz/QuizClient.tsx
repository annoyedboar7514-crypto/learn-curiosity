"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

// ─── Data ─────────────────────────────────────────────────────────────────────

const ARCH: Record<string, { m: string; c: string; d: string; dbKey: string }> = {
  explorer: { m:"Nova",  c:"#3D7A5C", dbKey:"explorer",        d:"You're an Explorer — happiest heading somewhere new. You face the unknown head-on and learn by doing." },
  astronaut:{ m:"Orion", c:"#2B4B8C", dbKey:"astronaut",       d:"You're an Astronaut — you want to know how everything works, ask for evidence, and love a mystery among the stars." },
  detective:{ m:"Scout", c:"#7A2D3C", dbKey:"detective",       d:"You're a Detective — you notice what others miss, follow the clues, and trust what the evidence shows." },
  inventor: { m:"Cog",   c:"#B85C2C", dbKey:"inventor-builder",d:"You're an Inventor — you see how things fit together and love to build. Where others see a problem, you see a project." },
  artist:   { m:"Lyra",  c:"#6B3FA0", dbKey:"artist",          d:"You're an Artist — you see the world in ideas and images, turning feelings into things other people can see." },
  healer:   { m:"Sol",   c:"#5C8C6B", dbKey:"doctor-healer",   d:"You're a Healer — you notice how people feel and want to help. You lead with care and pay attention to everyone." },
};

const PILLARS = [
  { k:"ct",    n:"Critical Thinking",    cssVar:"--p-ct" },
  { k:"res",   n:"Resilience & Character", cssVar:"--p-res" },
  { k:"cre",   n:"Creativity & Vision",  cssVar:"--p-cre" },
  { k:"com",   n:"Communication",        cssVar:"--p-com" },
  { k:"learn", n:"Learning How to Learn",cssVar:"--p-learn" },
];

export type Grade = "k2" | "grade34" | "grade56";
type Phase = "quiz" | "reveal" | "parent";

interface Card { i: string; l: string; a?: string; sc?: number; }
interface Question {
  s: string; q: string; cols: number; cards: Card[];
  intro?: string; p?: string | string[]; t?: number;
}
interface Answer { arch: string | null; p: string | string[] | null; sc: number; text: string; }
interface Result  { arch: string; pillars: Record<string, number>; }

const SCENE_ORB: Record<string, [string, string, string, string]> = {
  space:    ["#E8A33D","8%","12%","70px"],
  safari:   ["#FBF6EC","12%","8%","90px"],
  ocean:    ["#FBF6EC","14%","20%","70px"],
  treehouse:["#E8A33D","16%","14%","80px"],
  egypt:    ["#FBF6EC","10%","12%","90px"],
  summit:   ["#FBF6EC","16%","10%","100px"],
  workshop: ["#E8A33D","12%","16%","70px"],
  galileo:  ["#E8A33D","10%","18%","60px"],
};

const QUIZ: Record<Grade, Question[]> = {
  k2:[
    {s:"space",q:"What sounds most fun?",cols:2,cards:[{i:"🌲",l:"Outside exploring",a:"explorer"},{i:"🚀",l:"Up in space",a:"astronaut"},{i:"🔍",l:"Solving a mystery",a:"detective"},{i:"🔧",l:"Building something",a:"inventor"}]},
    {s:"space",q:"Which animal is most like you?",cols:3,cards:[{i:"🦊",l:"Fox",a:"detective"},{i:"🦉",l:"Owl",a:"astronaut"},{i:"🐬",l:"Dolphin",a:"explorer"},{i:"🦫",l:"Beaver",a:"inventor"},{i:"🦎",l:"Chameleon",a:"artist"},{i:"🦌",l:"Deer",a:"healer"}]},
    {s:"safari",q:"What's inside the treasure chest?",cols:2,cards:[{i:"🗺️",l:"A map to somewhere new",a:"explorer"},{i:"🔭",l:"A telescope for the stars",a:"astronaut"},{i:"🧩",l:"A puzzle with no box",a:"detective"},{i:"🖌️",l:"A paintbrush that makes anything",a:"artist"}]},
    {s:"safari",q:"Which path do you take?",cols:2,cards:[{i:"🌴",l:"Into the jungle",a:"explorer"},{i:"✨",l:"To the stars",a:"astronaut"},{i:"🕵️",l:"Into the mystery",a:"detective"},{i:"🌿",l:"To the healer's garden",a:"healer"}]},
    {s:"ocean",q:"Your friend is sad. What do you do?",cols:3,p:"res",cards:[{i:"🤗",l:"Give them a hug",a:"healer",sc:2},{i:"👂",l:"Ask what's wrong",a:"healer",sc:3},{i:"😄",l:"Make them laugh",a:"artist",sc:1}]},
    {s:"ocean",q:"One cookie, two kids. What happens?",cols:3,p:"ct",cards:[{i:"🍪",l:"One gets it",sc:1},{i:"➗",l:"They share it",sc:3},{i:"🪙",l:"Flip a coin",sc:2}]},
    {s:"treehouse",q:"Your tower fell. Now what?",cols:3,p:"learn",cards:[{i:"😣",l:"Feel upset",sc:1},{i:"🔁",l:"Try again",sc:3},{i:"🙋",l:"Ask for help",sc:2}]},
    {s:"treehouse",q:"Your friend took your toy. What do you do?",cols:3,p:"res",cards:[{i:"😠",l:"Get upset",sc:1},{i:"💬",l:"Talk to them",sc:3},{i:"🚶",l:"Walk away",sc:2}]},
    {s:"egypt",q:"Paper, crayons, tape. What do you make?",cols:2,p:"cre",cards:[{i:"✈️",l:"Something that flies",sc:2},{i:"🏠",l:"A tiny house",sc:2},{i:"🔭",l:"Something to look through",sc:3},{i:"🎨",l:"Something beautiful",sc:2}]},
    {s:"egypt",q:"The robot doesn't know what a sandwich is. Show it how.",cols:2,p:"com",cards:[{i:"🪜",l:"Show the steps",sc:3},{i:"🖍️",l:"Draw a picture",sc:2},{i:"🎭",l:"Act it out",sc:2},{i:"🗣️",l:"Say it's food",sc:1}]},
    {s:"summit",q:"Your drawing looks wrong. What do you do?",cols:3,p:"learn",cards:[{i:"📄",l:"Start over",sc:1},{i:"🩹",l:"Fix the part that's wrong",sc:3},{i:"💡",l:"Ask someone for ideas",sc:2}]},
    {s:"summit",q:"New kid. No friends yet. What do you do?",cols:3,p:"res",cards:[{i:"👋",l:"Go say hi",sc:3},{i:"👀",l:"Wait and watch",sc:1},{i:"🧑‍🏫",l:"Tell a teacher",sc:2}]},
    {s:"workshop",q:"Stuck in a room. How do you get out?",cols:2,p:"cre",cards:[{i:"📦",l:"Stack things up",sc:3},{i:"🚪",l:"Knock and wait",sc:1},{i:"✉️",l:"Send a message",sc:2},{i:"🔎",l:"Look for another way",sc:3}]},
    {s:"workshop",q:"Both think they're right. Who is?",cols:3,p:"com",cards:[{i:"📣",l:"The louder one",sc:1},{i:"🗺️",l:"Check together",sc:3},{i:"🧑",l:"Ask someone else",sc:2}]},
    {s:"galileo",q:"What's a question nobody knows the answer to?",cols:2,p:["ct","learn"],cards:[{i:"🌌",l:"What's at the end of space?",sc:3},{i:"💭",l:"Why do we dream?",sc:3},{i:"🫂",l:"Why do people fight?",sc:3},{i:"🪞",l:"What makes me, me?",sc:3}]},
  ],
  grade34:[
    {s:"space",q:"When you have free time, what do you want to do?",cols:3,cards:[{i:"🧭",l:"Explore somewhere new",a:"explorer"},{i:"🔬",l:"Do a science experiment",a:"astronaut"},{i:"🧩",l:"Solve a mystery or puzzle",a:"detective"},{i:"🔧",l:"Build or invent something",a:"inventor"},{i:"🎨",l:"Create something",a:"artist"},{i:"❤️‍🩹",l:"Help someone / how the body works",a:"healer"}]},
    {s:"space",q:"Which story would you most want to be in?",cols:2,cards:[{i:"🗺️",l:"Lost in a jungle with a map and a mystery",a:"explorer"},{i:"🪐",l:"First human on a new planet",a:"astronaut"},{i:"💡",l:"Inventing something that changes everything",a:"inventor"},{i:"🌊",l:"Helping a village survive a flood",a:"healer"}]},
    {s:"safari",q:"Which skill would you most want?",cols:3,cards:[{i:"🧭",l:"Reading any map or trail",a:"explorer"},{i:"🌌",l:"Understanding how the universe works",a:"astronaut"},{i:"🔍",l:"Seeing what others miss",a:"detective"},{i:"🛠️",l:"Building anything from scratch",a:"inventor"},{i:"🎭",l:"Making people feel something",a:"artist"},{i:"🩺",l:"Knowing how to heal and help",a:"healer"}]},
    {s:"safari",q:"If you could fix one problem, what kind would it be?",cols:2,p:"cre",cards:[{i:"🌱",l:"Something in nature",a:"explorer",sc:2},{i:"🧗",l:"Something that makes lives harder",a:"inventor",sc:2},{i:"❓",l:"Something nobody has figured out",a:"detective",sc:3},{i:"🫂",l:"Something that makes people feel alone",a:"healer",sc:2}]},
    {s:"ocean",q:"Which person would you most want to spend a day with?",cols:3,cards:[{i:"🧭",l:"Ibn Battuta, the traveler",a:"explorer"},{i:"🔭",l:"Galileo, the questioner",a:"astronaut"},{i:"🕵️",l:"A great detective",a:"detective"},{i:"⚙️",l:"Ada Lovelace, the thinker",a:"inventor"},{i:"🎨",l:"A bold painter",a:"artist"},{i:"🩺",l:"A wise healer",a:"healer"}]},
    {s:"ocean",q:"Your friend says the sky is green because their mom said so. What do you think?",cols:2,p:"ct",cards:[{i:"🙆",l:"They're probably right",sc:1},{i:"🔎",l:"I'd look up to check",sc:3},{i:"❓",l:"I'd ask why their mom thinks that",sc:3},{i:"🚫",l:"I'd say they're wrong",sc:2}]},
    {s:"treehouse",q:"You get a lower grade than you expected. First thing you do?",cols:2,p:"learn",cards:[{i:"😤",l:"Feel frustrated and move on",sc:1},{i:"📑",l:"Look at what I got wrong",sc:3},{i:"🧑‍🏫",l:"Ask the teacher what happened",sc:2},{i:"🙈",l:"Try to forget about it",sc:1}]},
    {s:"treehouse",q:"You promised to help a friend but something more fun came up. What do you do?",cols:2,p:"res",cards:[{i:"🤝",l:"Keep my promise",sc:3},{i:"🙋",l:"See if my friend minds",sc:2},{i:"⏳",l:"Do the fun thing, make it up later",sc:1},{i:"😟",l:"Feel bad but go anyway",sc:1}]},
    {s:"egypt",q:"You have a great idea but nobody thinks it'll work. What do you do?",cols:2,p:"cre",cards:[{i:"🛑",l:"Drop it",sc:1},{i:"🧪",l:"Try it anyway and see",sc:2},{i:"🙋",l:"Find one person who believes it",sc:2},{i:"🔍",l:"Figure out why they doubt it",sc:3}]},
    {s:"egypt",q:"Your project partner isn't doing their part. What do you say?",cols:2,p:"com",t:1,cards:[{i:"🙇",l:"Nothing — I'll do it myself",sc:1},{i:"🧑‍🏫",l:"Tell the teacher",sc:1},{i:"💬",l:"Ask them what's going on",sc:3},{i:"⚖️",l:"Tell them it's not fair",sc:2}]},
    {s:"summit",q:"Two friends are arguing and both think they're right. How do you find out who is?",cols:2,p:"ct",cards:[{i:"📣",l:"The more confident one is right",sc:1},{i:"🔎",l:"Look it up together",sc:3},{i:"✅",l:"Ask each one to prove it",sc:3},{i:"🤷",l:"It doesn't matter — move on",sc:1}]},
    {s:"summit",q:"Something goes wrong on a school trip. Everyone panics. What do you do?",cols:2,p:"res",t:1,cards:[{i:"😱",l:"Panic too — it feels serious",sc:1},{i:"🧘",l:"Stay calm and think",sc:3},{i:"🧑",l:"Find an adult",sc:2},{i:"🤝",l:"Help others stay calm",sc:3}]},
    {s:"workshop",q:"One hour and anything in a junk drawer. What do you make?",cols:2,p:"cre",cards:[{i:"🧩",l:"Something that solves a problem",sc:3},{i:"✨",l:"Something just because it's cool",sc:2},{i:"🎁",l:"A gift for someone",sc:2},{i:"📝",l:"I'd plan it out first",sc:3}]},
    {s:"workshop",q:"Explain to someone who's never seen snow what it feels like.",cols:2,p:"com",t:1,cards:[{i:"❄️",l:"It's cold and white, falls from the sky",sc:1},{i:"🪶",l:"Like tiny cold feathers landing on you",sc:3},{i:"🧊",l:"Like the whole world in a freezer",sc:3},{i:"🤲",l:"You'd have to feel it",sc:2}]},
    {s:"galileo",q:"Something you used to think was true that you now know isn't?",cols:2,p:"learn",t:1,cards:[{i:"🥇",l:"Smart meant getting it right the first time",sc:3},{i:"😌",l:"Being good at something meant it was easy",sc:3},{i:"😣",l:"If it's hard, I'm not good at it",sc:3},{i:"🤷",l:"I can't think of anything",sc:1}]},
  ],
  grade56:[
    {s:"space",intro:"Let's start with you.",q:"If you could spend a year doing one thing, what would it be?",cols:3,cards:[{i:"🧭",l:"Travel somewhere completely unknown",a:"explorer"},{i:"🔬",l:"Research something nobody understands yet",a:"astronaut"},{i:"🕵️",l:"Solve a real unsolved mystery",a:"detective"},{i:"🔧",l:"Build something that doesn't exist yet",a:"inventor"},{i:"🎨",l:"Create something that makes people feel",a:"artist"},{i:"🩺",l:"Help people who need it, deeply",a:"healer"}]},
    {s:"space",q:"Which challenge actually sounds interesting to you?",cols:2,cards:[{i:"🏕️",l:"Surviving with no technology",a:"explorer"},{i:"🧩",l:"Why something that should work, doesn't",a:"detective"},{i:"🎨",l:"Making something beautiful out of nothing",a:"artist"},{i:"🫂",l:"Helping someone figure out what they need",a:"healer"}]},
    {s:"safari",intro:"Tell me about the kind of person you think about.",q:"What kind of person do you most admire?",cols:2,p:"res",cards:[{i:"🌍",l:"Someone who discovered something new",a:"explorer",sc:1},{i:"⚖️",l:"Someone who stood up for what's right when it was hard",a:"detective",sc:3},{i:"🎨",l:"Someone who changed how people see the world",a:"artist",sc:1},{i:"🤲",l:"Someone who helped in a way nobody thought of",a:"healer",sc:2}]},
    {s:"safari",q:"Which project would you actually want to work on?",cols:3,cards:[{i:"🌊",l:"Map an unexplored part of the ocean",a:"explorer"},{i:"👽",l:"Figure out if there's life in the universe",a:"astronaut"},{i:"🔍",l:"Solve a cold case using evidence",a:"detective"},{i:"⚙️",l:"Design a machine for a daily problem",a:"inventor"},{i:"✍️",l:"Write a story that changes how someone thinks",a:"artist"},{i:"💊",l:"Develop a treatment for a disease",a:"healer"}]},
    {s:"ocean",intro:"Almost there. Last one before we switch gears.",q:"If you could ask one question nobody knows the answer to, what would it be?",cols:2,p:"ct",cards:[{i:"🌌",l:"Is there something outside the universe?",sc:3},{i:"🧠",l:"Nature or experience — what makes us us?",sc:3},{i:"⚖️",l:"Can we ever know if something is truly fair?",sc:3},{i:"🕰️",l:"What if one thing in history had gone differently?",sc:3}]},
    {s:"ocean",intro:"Someone tells you a fact you've never heard before.",q:"What's the first thing you do?",cols:2,p:"ct",cards:[{i:"🙆",l:"Believe it — they probably know more",sc:1},{i:"🔎",l:"Look for a second source",sc:2},{i:"❓",l:"Ask them where they heard it",sc:3},{i:"🤔",l:"Think about whether it makes sense",sc:3}]},
    {s:"treehouse",q:"You've worked on something for two weeks and it's not going well.",cols:2,p:"learn",cards:[{i:"💪",l:"Push through — I've put in too much",sc:1},{i:"🔙",l:"Step back and find what's wrong",sc:3},{i:"🙋",l:"Ask someone who's done it",sc:2},{i:"🆕",l:"Accept it and start something new",sc:2}]},
    {s:"treehouse",q:"Your friend hurt someone but didn't mean to. Do you say something?",cols:2,p:"res",t:1,cards:[{i:"✅",l:"Yes — they should know, even if it's uncomfortable",sc:3},{i:"🌱",l:"Only if it comes up naturally",sc:1},{i:"🚫",l:"No — they didn't mean to",sc:1},{i:"⚖️",l:"Depends how close we are",sc:2}]},
    {s:"egypt",q:"You need to solve a problem but your usual approach isn't working.",cols:2,p:"cre",cards:[{i:"🔁",l:"Try the same approach but harder",sc:1},{i:"👥",l:"Ask someone who sees it differently",sc:2},{i:"🧭",l:"Question whether I framed it right",sc:3},{i:"☕",l:"Take a break and come back",sc:2}]},
    {s:"egypt",q:"Someone disagrees with your opinion. What do you do?",cols:2,p:"com",t:1,cards:[{i:"🗣️",l:"Explain my position more clearly",sc:2},{i:"❓",l:"Ask why they think differently",sc:3},{i:"👂",l:"Listen for the strongest part of their argument",sc:3},{i:"🧍",l:"Stand my ground",sc:1}]},
    {s:"summit",q:"Is it ever okay to lie?",cols:2,p:["ct","res"],t:1,cards:[{i:"🚫",l:"No — honesty matters even when it's hard",sc:2},{i:"🛡️",l:"Yes, if it protects someone",sc:2},{i:"⚖️",l:"It depends why and who it affects",sc:3},{i:"🤔",l:"There's no single right answer",sc:3}]},
    {s:"summit",q:"Tell me about something you failed at and what you took from it.",cols:2,p:"learn",t:1,cards:[{i:"🎯",l:"I figured out exactly what I did wrong",sc:3},{i:"🚪",l:"I realized it wasn't for me",sc:1},{i:"👥",l:"I talked to someone who'd been through it",sc:2},{i:"🔁",l:"I tried again differently",sc:3}]},
    {s:"workshop",q:"Unlimited materials, one hour. What do you create and why?",cols:2,p:"cre",cards:[{i:"🧩",l:"Something that solves a daily problem",sc:2},{i:"✨",l:"Something that's never existed, to see if I can",sc:3},{i:"🎁",l:"Something for a person I care about",sc:2},{i:"💭",l:"Something that makes people think differently",sc:3}]},
    {s:"workshop",q:"How do you explain something complex to someone who doesn't get it?",cols:2,p:"com",t:1,cards:[{i:"🔑",l:"Find the simplest version first",sc:2},{i:"🌍",l:"Use an example from their life",sc:3},{i:"❓",l:"Ask what they know and build from there",sc:3},{i:"😅",l:"Honestly, I find it hard",sc:2}]},
    {s:"galileo",intro:"Last one.",q:"What's something you changed your mind about, and what changed it?",cols:2,p:["ct","learn"],t:1,cards:[{i:"🥇",l:"That being talented meant things came easily",sc:3},{i:"👔",l:"That people in charge always had the answers",sc:3},{i:"⚖️",l:"That fairness meant everyone gets the same",sc:3},{i:"🤷",l:"I'm not sure I've changed my mind yet",sc:1}]},
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function robotSVG(c: string): string {
  return "data:image/svg+xml;utf8," + encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 230 300'><g transform='translate(115,150)'><line x1='0' y1='-92' x2='0' y2='-110' stroke='#FBF6EC' stroke-width='5'/><path d='M0 -118 l5 8 9 1 -7 6 2 9 -9 -5 -9 5 2 -9 -7 -6 9 -1z' fill='#E8A33D'/><rect x='-52' y='-92' width='104' height='84' rx='26' fill='${c}'/><rect x='-40' y='-78' width='80' height='52' rx='16' fill='#FBF6EC'/><circle cx='-16' cy='-52' r='8' fill='#233137'/><circle cx='16' cy='-52' r='8' fill='#233137'/><path d='M-12 -38 Q0 -30 12 -38' stroke='#233137' stroke-width='3' fill='none' stroke-linecap='round'/><rect x='-46' y='-6' width='92' height='96' rx='24' fill='${c}'/><circle cx='0' cy='30' r='16' fill='#FBF6EC'/><path d='M0 22 a8 8 0 010 16 8 8 0 010 -16z' fill='#E8A33D'/><g stroke='${c}' stroke-width='14' stroke-linecap='round'><line x1='-46' y1='14' x2='-72' y2='-22'/><line x1='46' y1='14' x2='74' y2='44'/></g><circle cx='-74' cy='-26' r='9' fill='#E8A33D'/><circle cx='78' cy='48' r='9' fill='#E8A33D'/><g stroke='${c}' stroke-width='15' stroke-linecap='round'><line x1='-22' y1='90' x2='-22' y2='128'/><line x1='22' y1='90' x2='22' y2='128'/></g></g></svg>`
  );
}

function pillarLabel(v: number): [string, number] {
  if (v >= 7) return ["Ready to Lead", 1];
  if (v >= 5) return ["Thinking Deeply", 0.72];
  if (v >= 3) return ["Building Nicely", 0.42];
  return ["Just Getting Started", 0.18];
}

function scoreAnswers(answers: Answer[]): Result {
  const tally: Record<string, number> = {};
  const pillars: Record<string, number> = { ct:0, res:0, cre:0, com:0, learn:0 };
  answers.forEach(a => {
    if (a.arch) tally[a.arch] = (tally[a.arch] ?? 0) + 1;
    if (a.p && a.sc) {
      (Array.isArray(a.p) ? a.p : [a.p]).forEach(pk => { pillars[pk] = (pillars[pk] ?? 0) + a.sc; });
    }
  });
  let arch = "explorer", best = -1;
  Object.keys(ARCH).forEach(k => { if ((tally[k] ?? 0) > best) { best = tally[k] ?? 0; arch = k; } });
  return { arch, pillars };
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props { initialGrade?: Grade; nickname?: string; }

export default function QuizClient({ initialGrade = "grade34", nickname = "Explorer" }: Props) {
  const router = useRouter();
  const [grade, setGrade]   = useState<Grade>(initialGrade);
  const [idx, setIdx]       = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [moreText, setMoreText] = useState("");
  const [phase, setPhase]   = useState<Phase>("quiz");
  const [overlay, setOverlay] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [saving, setSaving] = useState(false);
  const particlesRef = useRef<HTMLDivElement>(null);

  const questions = QUIZ[grade];
  const Q = questions[idx];

  // Particles
  const makeParticles = useCallback(() => {
    const el = particlesRef.current;
    if (!el) return;
    el.innerHTML = "";
    for (let i = 0; i < 28; i++) {
      const d = document.createElement("div");
      d.className = "qz-particle";
      d.style.left = Math.random() * 100 + "%";
      d.style.top  = Math.random() * 100 + "%";
      const sz = 2 + Math.random() * 4;
      d.style.width = sz + "px"; d.style.height = sz + "px";
      d.style.animationDuration = (6 + Math.random() * 8) + "s";
      d.style.animationDelay = (-Math.random() * 8) + "s";
      d.style.background = Math.random() > 0.5 ? "#E8A33D" : "#FBF6EC";
      el.appendChild(d);
    }
  }, []);

  useEffect(() => { makeParticles(); }, [makeParticles]);

  // Restart
  const restart = useCallback((g: Grade) => {
    setGrade(g); setIdx(0); setAnswers([]); setPicked(null); setMoreText(""); setPhase("quiz");
  }, []);

  // Pick a card
  function pick(ci: number) { setPicked(ci); }

  // Advance
  function advance() {
    if (picked === null) return;
    const card = Q.cards[picked];
    const newAnswer: Answer = { arch: card.a ?? null, p: Q.p ?? null, sc: card.sc ?? 0, text: moreText };
    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);
    setPicked(null); setMoreText("");

    const nextIdx = idx + 1;
    // Transition between Q5 (index 4) and Q6 (index 5)
    if (idx === 4) {
      setOverlay(true);
      setTimeout(() => {
        setOverlay(false);
        setTimeout(() => {
          if (nextIdx >= questions.length) { finish(newAnswers); } else { setIdx(nextIdx); }
        }, 500);
      }, 2000);
      return;
    }
    if (nextIdx >= questions.length) { finish(newAnswers); return; }
    setIdx(nextIdx);
  }

  function finish(finalAnswers: Answer[]) {
    setResult(scoreAnswers(finalAnswers));
    setPhase("reveal");
  }

  // Save archetype and go to /home
  async function handleMeetMentor() {
    if (!result) return;
    setSaving(true);
    try {
      await fetch("/api/profile/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field: "archetype", value: ARCH[result.arch].dbKey }),
      });
    } catch { /* non-fatal — proceed to /home anyway */ }
    router.push("/home");
  }

  // Orb style from scene
  const orbCfg = SCENE_ORB[Q?.s ?? "space"];
  const orbStyle: React.CSSProperties = {
    background: orbCfg[0], top: orbCfg[1], right: orbCfg[2],
    width: orbCfg[3], height: orbCfg[3],
    opacity: (Q?.s === "ocean" || Q?.s === "workshop") ? 0.25 : 0.8,
  };

  const finalScene = phase === "reveal" || phase === "parent" ? "galileo" : Q?.s ?? "space";

  return (
    <>
      {/* Animated background */}
      <div className="qz-bg" data-scene={finalScene}>
        <div className="qz-orb" style={orbStyle} />
        {(phase === "quiz" && Q?.s === "workshop") && (
          <svg className="qz-gear" viewBox="0 0 100 100" fill="#B85C2C">
            <path d="M50 0l6 12a40 40 0 018 3l13-5 8 14-10 9a40 40 0 010 9l10 9-8 14-13-5a40 40 0 01-8 3L50 100l-6-12a40 40 0 01-8-3l-13 5-8-14 10-9a40 40 0 010-9l-10-9 8-14 13 5a40 40 0 018-3z"/>
            <circle cx="50" cy="50" r="16" fill="#233137"/>
          </svg>
        )}
        <div ref={particlesRef} style={{ position:"absolute", inset:0, overflow:"hidden" }} />
      </div>

      {/* ── QUIZ ── */}
      {phase === "quiz" && (
        <>
          <div className="qz-wrap">
            {/* Trail */}
            <div className="qz-trail">
              {questions.map((_, i) => (
                <span key={i} className={`qz-star ${i < idx ? "done" : i === idx ? "now" : ""}`}>
                  {i === idx ? "★" : "✦"}
                </span>
              ))}
            </div>

            {/* Stage */}
            <div className="qz-stage">
              {Q.intro && <div className="qz-intro">{Q.intro}</div>}

              <div className="qz-mentor-row">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={robotSVG("#1B6E6B")} alt="Mentor" />
                <div className="qz-q">{Q.q}</div>
              </div>

              <div className={`qz-cards ${Q.cols === 3 ? "c3" : "c2"} ${picked !== null ? "haspick" : ""}`}>
                {Q.cards.map((c, ci) => (
                  <button key={ci} className={`qz-card ${picked === ci ? "sel" : ""}`} onClick={() => pick(ci)}>
                    <span className="ill">{c.i}</span>
                    <span className="lbl">{c.l}</span>
                  </button>
                ))}
              </div>

              {Q.t && picked !== null && (
                <div className="qz-moretext">
                  <div className="lab">Want to say more? (optional)</div>
                  <textarea
                    value={moreText}
                    onChange={e => setMoreText(e.target.value)}
                    placeholder="Type here if you'd like…"
                  />
                </div>
              )}
            </div>
          </div>

          <button className={`qz-continue ${picked !== null ? "show" : ""}`} onClick={advance}>
            Continue →
          </button>
        </>
      )}

      {/* ── TRANSITION OVERLAY ── */}
      <div className={`qz-overlay ${overlay ? "show" : ""}`}>
        <div className="big">Nice. Now let&apos;s see how your mind works.</div>
      </div>

      {/* ── REVEAL ── */}
      <div className={`qz-reveal ${phase === "reveal" ? "show" : ""}`}>
        {result && (() => {
          const a = ARCH[result.arch];
          return (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="av" src={robotSVG(a.c)} alt={result.arch} />
              <div className="ey">Your story world is…</div>
              <h1>{result.arch.charAt(0).toUpperCase() + result.arch.slice(1)}</h1>
              <p>{a.d}&nbsp; Your mentor will be {a.m}.</p>
              <button className="btn" onClick={handleMeetMentor} disabled={saving}>
                {saving ? "Saving…" : "Meet your mentor →"}
              </button>
              <button className="pl" onClick={() => setPhase("parent")}>
                Peek at what parents see
              </button>
            </>
          );
        })()}
      </div>

      {/* ── PARENT VIEW ── */}
      <div className={`qz-parent ${phase === "parent" ? "show" : ""}`}>
        <div className="inner">
          <div className="ey">Parent dashboard · private</div>
          <h2>Where {nickname} started</h2>
          <div className="note">
            A starting snapshot across the five pillars. Every lesson {nickname} finishes adds a new point — so you&apos;ll watch this grow over time. Your child never sees these scores.
          </div>
          {PILLARS.map(p => {
            const v = result?.pillars[p.k] ?? 0;
            const [lab, fill] = pillarLabel(v);
            return (
              <div key={p.k} className="pbar-row">
                <div className="top">
                  <span className="nm">{p.n}</span>
                  <span className="lab" style={{ color: `var(${p.cssVar})` }}>{lab}</span>
                </div>
                <div className="qz-track">
                  <span style={{ width: Math.round(fill * 100) + "%", background: `var(${p.cssVar})` }} />
                </div>
              </div>
            );
          })}
          <button className="back" onClick={() => setPhase("reveal")}>← Back to reveal</button>
          <div className="disc">No numbers, percentages, or comparisons are ever shown to the child. This baseline is visible only on parent-authenticated screens.</div>
        </div>
      </div>

      {/* ── Grade switcher (bottom-left) ── */}
      <div className="qz-grade-bar">
        <span className="l">Grade</span>
        {(["k2","grade34","grade56"] as Grade[]).map(g => (
          <button key={g} className={grade === g ? "active" : ""} onClick={() => restart(g)}>
            {g === "k2" ? "K–2" : g === "grade34" ? "3–4" : "5–6"}
          </button>
        ))}
        <button onClick={() => restart(grade)} style={{ opacity: 0.8 }}>↻</button>
      </div>
    </>
  );
}
