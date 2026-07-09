import type { Lesson } from '../lessonSchema'

// ============================================================
// ERA 1 — ANCIENT WONDERS (Levels 1-20)
// ============================================================

export const LEVEL_1: Partial<Lesson> = {
  id: 1, era: 1,
  title: "The Scribe's Dilemma",
  historicalPeriod: "Ancient Egypt, 1280 BCE",
  pillar: "critical",
  pillarLabel: "Critical Thinking",
  historicalContext: "Egyptian scribes underwent 10–12 years of training. What they wrote became the official record — forever.",
  historicalAccuracyNote: "Hieratic script used for administrative documents. Ramesses II era. Official records were demonstrably propagandistic — cross-referenced with Hittite records of same events.",
  eraBackground: "egypt",
  accentColor: "#E8A33D",
  decisionQuestion: "Kha has the decree in front of him. He knows it isn't true. What should he do?",
  decisionCards: [
    { emoji: "📜", label: "Write it as ordered", pillarScore: 1 },
    { emoji: "✏️", label: "Change what it says", pillarScore: 2 },
    { emoji: "🗣️", label: "Speak to the Vizier", pillarScore: 3 },
    { emoji: "⏳", label: "Ask for more time to think", pillarScore: 2 },
  ],
  consequenceText: "Kha wrote the decree exactly as ordered. Months later, the northern provinces received no emergency grain — the official record said there was nothing to fear. When the famine arrived, it spread further than it had to.",
  consequenceHistoricalTie: "Egyptian administrative records from this period show significant discrepancies between official accounts and archaeological evidence of conditions on the ground.",
  miniGame: {
    type: "sort",
    title: "Order from Most Honest to Least Honest",
    instruction: "Drag these actions into the order you think is most to least honest. There's no single right answer — just your thinking.",
    items: [
      "Write the truth and explain why to the Vizier",
      "Write the decree but add a quiet warning note",
      "Write what you're told without saying anything",
      "Change the decree without telling anyone",
    ],
  },
  questionBanks: {
    k2: {
      entry: "Was it wrong for Kha to write something he knew wasn't true?",
      core: [
        "Did he have a choice — or was he forced?",
        "What would happen if everyone just wrote what they were told, even when it was wrong?",
        "Do you think Kha knew it was wrong when he did it?",
        "Why didn't he say something?",
      ],
      deep: [
        "What would you have needed to feel brave enough to say something?",
        "What is the difference between a mistake and a choice?",
        "If you could go back and be Kha — what would you do differently, and what would the hardest part be?",
      ],
      disengagement: "If it was your friend who had to make this choice, what would you say to them?",
    },
    grade34: {
      entry: "Kha was afraid of what would happen to him if he refused. Was fear a good enough reason to write something he knew was false?",
      core: [
        "What's the difference between being told to do something wrong and choosing to do something wrong?",
        "Kha told himself it wasn't his decision to make. Do you think that's true?",
        "The people in the northern provinces made decisions based on what Kha wrote. What does that tell us about why accurate information matters?",
        "Could there have been a way for Kha to raise the problem without directly refusing?",
        "If Kha had known the famine was coming three months later, do you think he would have decided differently?",
      ],
      deep: [
        "Do you think Kha was a bad person — or a person who made a bad choice? Is there a difference?",
        "What would you have needed to know, or believe, to make the harder choice in that moment?",
        "Is there something you've stayed quiet about because it felt like it wasn't your decision to make?",
        "What would change about your answer if Kha had been wrong — if the decree actually was true?",
        "The Vizier gave the order. Kha wrote it. The Pharaoh approved it. Who bears the most responsibility for what happened — and why?",
        "What do you think the word 'responsibility' actually means, based on this story?",
      ],
      disengagement: "Let's think about a simpler version: if you saw a friend write something wrong on a test, would that feel different? Why?",
    },
    grade56: {
      entry: "Kha's decision rested on an assumption — what was it, and was it correct?",
      core: [
        "He told himself it wasn't his decision to make. Is that a reason or an excuse — and what's the difference?",
        "There's a distinction between causing harm and failing to prevent it. Where does Kha sit on that line?",
        "The people who died in the famine didn't know Kha existed. Does that change his moral responsibility?",
        "If Kha had raised the concern and been ignored, would he be less responsible for the outcome? Why or why not?",
        "What would the strongest argument be for Kha's choice — the one that actually makes it defensible?",
      ],
      deep: [
        "Is there a system here that's more responsible than any individual person — and if so, what does that change?",
        "What obligation does someone have when an order conflicts with what they know to be true?",
        "Kha was a scribe — his whole role was to preserve accurate records. Does his specific job change what he owed the truth?",
        "Think about the concept of moral courage — courage that has nothing to do with physical danger. What would that have looked like for Kha?",
        "Is it possible to be simultaneously a good scribe and a morally responsible person in that situation? How?",
        "What would you need to believe about yourself to make the harder choice — not just about what's right, but about who you are?",
        "Centuries after Kha, Galileo faced a similar choice — say what the authorities required, or say what he knew to be true. Does the pattern tell us anything?",
        "Is there a version of this situation in your own life — something smaller, but the same shape?",
        "If you could redesign the system Kha worked in to make it less likely for this to happen, what would you change?",
      ],
      disengagement: "Let's approach this differently: what would a completely honest person do in Kha's position, and what would that cost them?",
    },
  },
  mentorClosing: "We talked about what it means to tell the truth when it costs something. I think you have more thoughts on that than you started with.",
}

export const LEVEL_2: Partial<Lesson> = {
  id: 2, era: 1,
  title: "The Flaw in the Wall",
  historicalPeriod: "Ancient Egypt, 1250 BCE",
  pillar: "resilience",
  pillarLabel: "Resilience & Character",
  historicalContext: "Pyramid construction workers were paid professionals — not enslaved laborers. They had craft pride, team names, and a professional code.",
  historicalAccuracyNote: "Workers' graffiti at Giza confirms team identities and competitive spirit. Paid in bread, beer, and medical care. Foreman hierarchy was real.",
  eraBackground: "egypt",
  accentColor: "#E8A33D",
  decisionQuestion: "Neferu found the flaw. She didn't make it. Is it her responsibility to say something?",
  decisionCards: [
    { emoji: "🏗️", label: "Tell Karem — even if he's angry", pillarScore: 3 },
    { emoji: "📢", label: "Report above Karem's head", pillarScore: 2 },
    { emoji: "📝", label: "Write it down and report later", pillarScore: 2 },
    { emoji: "🚶", label: "Leave it — not my mistake", pillarScore: 1 },
  ],
  consequenceText: "Neferu stayed quiet. Three months later, the section collapsed during emergency reconstruction. Six workers she knew were injured. Karem was dismissed. Neferu had known.",
  consequenceHistoricalTie: "Construction failure records from the New Kingdom period show multiple instances of re-building that archaeological evidence suggests were due to foundational issues.",
  miniGame: {
    type: "sort",
    title: "Rank These — Most Courageous to Least",
    instruction: "Real courage usually costs something. Put these in order from what takes the most courage to what takes the least.",
    items: [
      "Speak up immediately even knowing Karem will be angry",
      "Wait quietly and see if anyone else notices",
      "Report it to someone safer, above Karem",
      "Tell yourself it probably won't matter",
    ],
  },
  questionBanks: {
    k2: {
      entry: "Did Neferu do the right thing by staying quiet?",
      core: [
        "How do you think the workers who got hurt felt?",
        "Could Neferu have stopped what happened?",
        "Why do you think she didn't say anything?",
      ],
      deep: [
        "What stopped her from speaking up?",
        "If you saw something dangerous and told someone about it, what would happen?",
        "Is it possible to hurt someone by not doing something — without doing anything wrong yourself?",
        "What would you do if you noticed something dangerous but were told to stay quiet?",
      ],
      disengagement: "Have you ever seen something that looked unsafe and wondered whether to tell a grown-up?",
    },
    grade34: {
      entry: "Neferu found the flaw but didn't make it. Does that mean it wasn't her problem to solve?",
      core: [
        "The co-worker told her Karem would be angry if she reported it. Was that a good reason to stay quiet?",
        "What's the difference between minding your own business and ignoring something you should report?",
        "Is there a difference between doing something that hurts someone and letting something happen that hurts someone?",
        "What would it have taken for Neferu to speak up — what would she have needed to believe about herself or the situation?",
      ],
      deep: [
        "If she had told Karem and he had still done nothing, would that change her responsibility?",
        "What does responsibility mean when you didn't cause the problem but you're the one who knows about it?",
        "How would you feel if you'd known about a problem, said nothing, and then someone got hurt?",
        "The other workers also knew about the pressure on Karem. Why didn't any of them say something?",
        "Is there such a thing as collective responsibility — where a group is responsible for something no individual person fully caused?",
        "What would a truly brave action have looked like here — not just what was right, but what was genuinely hard?",
        "Think about a situation where you noticed something wrong and had to decide whether to say something. What made that decision hard?",
      ],
      disengagement: "Let's think about a simpler case: if you broke something at a friend's house by accident, would you tell them? How is that the same or different from Neferu's situation?",
    },
    grade56: {
      entry: "Neferu's choice rested on a calculation: the discomfort of speaking up vs. the probability of harm. What was wrong with her math?",
      core: [
        "There's a philosophical concept called the 'duty to warn' — an obligation to speak when you have information that could prevent harm. Do you think this obligation exists? Where does it come from?",
        "Neferu didn't cause the flaw. She didn't build that section. What is the philosophical basis for saying she had any responsibility at all?",
        "The co-worker warned her that Karem would be angry. Is social cost — the risk of conflict, disapproval, or punishment — a morally valid reason to withhold information that could prevent harm?",
        "If Neferu had spoken and been ignored, and the collapse had still happened, would she be less culpable? Morally? Professionally? What's the difference?",
      ],
      deep: [
        "What's the distinction between a mistake of action and a mistake of omission — and does that distinction change the moral weight?",
        "Everyone else on the site who saw or suspected the flaw also said nothing. Does collective silence change individual responsibility?",
        "Karem was under pressure — he'd been reprimanded twice. Does understanding why someone makes a bad decision change how responsible we think they are for the outcome?",
        "Moral courage is often defined as the willingness to do what's right when there's a social cost. Where on the moral courage spectrum does Neferu's choice sit?",
        "This story is about construction. But the shape of the problem — noticing something wrong, calculating the risk of speaking up, staying silent — where else does this pattern appear?",
        "Is there a structural or systemic problem here beyond any individual choice? How would you design a better system?",
        "Neferu later thought about the conversation she could have had. What do you think that conversation should have sounded like — specifically?",
        "What would it look like for someone to build a practice of speaking up — to make it a habit rather than a heroic one-time act?",
      ],
      disengagement: "Let's try a different angle: describe the last time you knew about a problem and had to decide whether to say something. What made that decision hard?",
    },
  },
  mentorClosing: "We explored what responsibility looks like when you didn't cause the problem but you're the one who knows. That's a question worth carrying.",
}

export const LEVEL_3: Partial<Lesson> = {
  id: 3, era: 1,
  title: "The Problem With No Answer",
  historicalPeriod: "Syracuse, Sicily, 250 BCE",
  pillar: "creativity",
  pillarLabel: "Creativity & Vision",
  historicalContext: "Archimedes' displacement principle — the basis of measuring volume — became a foundation of physics. It came from an unexpected observation, not a planned experiment.",
  historicalAccuracyNote: "Documented in Vitruvius. The 'eureka' story is the most famous example of serendipitous scientific observation.",
  eraBackground: "space",
  accentColor: "#E8A33D",
  decisionQuestion: "Myrrha has tried every obvious method. The crown can't be cut, melted, or scratched. What would you try?",
  decisionCards: [
    { emoji: "⚖️", label: "Weigh it against pure gold", pillarScore: 2 },
    { emoji: "💡", label: "Examine it under bright light", pillarScore: 1 },
    { emoji: "💧", label: "Put it in water and observe", pillarScore: 3 },
    { emoji: "🔄", label: "Change what question I'm asking", pillarScore: 3 },
  ],
  consequenceText: "The water level rose when she lowered the crown in — and rose a different amount when she put in the same weight of pure gold. The crown displaced more water, meaning something less dense was inside. The goldsmith had cheated.",
  consequenceHistoricalTie: "This method — Archimedes' principle of displacement — is still used today in materials science and engineering.",
  miniGame: {
    type: "sort",
    title: "Order These Thinking Moves — Most Creative to Least",
    instruction: "When the obvious things don't work, what do you try? Put these in order from most creatively useful to least.",
    items: [
      "Change the question you're asking",
      "Look for answers in a completely different domain",
      "Try the same approach but harder",
      "Ask someone who knows nothing about the problem",
    ],
  },
  questionBanks: {
    k2: {
      entry: "What did Myrrha try first that didn't work?",
      core: [
        "Where did she find her answer?",
        "How did she know to put the crown in water?",
        "What would you have tried?",
      ],
      deep: [
        "Have you ever solved a problem by trying something that seemed like it wasn't related?",
        "Why do you think the other students gave up?",
        "What makes someone keep trying when the obvious things don't work?",
        "Can you think of a problem you'd like to solve — what would you try first?",
      ],
      disengagement: "Think about a puzzle you've tried to solve — what happens when the first idea doesn't work?",
    },
    grade34: {
      entry: "Myrrha found her solution in something she almost walked past. What do you think made her pay attention to the water basin?",
      core: [
        "What stopped the other students from thinking of that answer?",
        "Is there a difference between looking for an answer and noticing one? What is it?",
        "Myrrha's approach worked because she changed the question — she stopped asking 'what is it made of?' and asked 'how does it behave?' What other problems might open up if you changed the question?",
        "The obvious approaches all failed. Have you ever had an experience where the answer was in a completely different direction from where you were looking?",
      ],
      deep: [
        "Archimedes' principle — that displacement reveals volume — is now a foundation of physics. But Myrrha found it by accident, following her curiosity. What does that tell us about where important ideas come from?",
        "If you could only use what was already in the room, what would you try to solve a problem you're currently stuck on?",
        "What's the difference between a creative solution and a lucky one? Was Myrrha's solution creative, lucky, or both?",
        "The students who gave up weren't less intelligent than Myrrha. What do you think was different about her approach?",
        "Can you think of a problem that seems impossible right now that might have an answer in a completely unexpected place?",
        "What's the difference between a problem that can't be solved and a problem you haven't figured out how to solve yet?",
        "If someone told you the answer was 'somewhere in that room' — without telling you what it was — what would you do?",
      ],
      disengagement: "Let's try something: what's a problem in your life right now — even a small one? What's the most unexpected place an answer might be hiding?",
    },
    grade56: {
      entry: "Myrrha didn't solve the problem Archimedes gave her. She reframed it — changed what kind of problem it was. What's the cognitive difference between solving a problem and reframing one?",
      core: [
        "The problem was defined as 'determine composition without damage.' Myrrha changed it to 'find a property that reveals composition indirectly.' What prompted that shift, and how would you learn to make those shifts habitually?",
        "There's a concept in design thinking called 'problem finding' — the idea that identifying the right question is more valuable than finding the right answer. How does Myrrha's story illustrate this?",
        "The other students gave up. They weren't unintelligent. What was the actual cognitive difference between them and Myrrha in that afternoon?",
        "Myrrha noticed something she wasn't looking for — the water rising when she put her hand in for a completely different reason. This is called 'serendipitous observation.' What conditions make serendipity more or less likely?",
      ],
      deep: [
        "Archimedes' principle came from looking at a crown in a bath. What does this tell us about the relationship between constraint and discovery?",
        "Can you think of a contemporary problem — something in the world right now — that might be stuck because people are solving the wrong version of it?",
        "What assumptions were the other students making that prevented them from finding Myrrha's answer? How do you identify your own assumptions when you're stuck?",
        "Is creativity a talent you're born with, or a set of habits you can build? What would those habits look like?",
        "'If you can't solve the problem, change the problem' — is that always good advice? When might it be the wrong move?",
        "What's the difference between a creative solution that actually works and a creative solution that just feels novel?",
        "Myrrha worked within real constraints — she couldn't damage the crown, couldn't melt it. How might constraints actually be generative — pushing you toward better answers?",
        "Where in your own life are you approaching a problem from the same direction repeatedly? What would a completely different approach look like?",
        "What role did persistence play versus insight in Myrrha's solution? Could she have found the same answer faster — or was the time she spent looking a necessary part of the discovery?",
      ],
      disengagement: "Let's ground this in something concrete: describe a time when you found an answer by noticing something you weren't originally looking for.",
    },
  },
  mentorClosing: "We talked about what it looks like to change a question instead of just trying harder to answer the wrong one. That's a tool you can use anywhere.",
}

export const LEVEL_4: Partial<Lesson> = {
  id: 4, era: 1,
  title: "The Wisest Man in Athens",
  historicalPeriod: "Athens, Greece, 420 BCE",
  pillar: "communication",
  pillarLabel: "Communication & Articulation",
  historicalContext: "Socrates never wrote anything down. His method of questioning (the elenchus) is the foundation of Western philosophy.",
  historicalAccuracyNote: "The Oracle at Delphi story is documented in Plato's Apology, considered historically reliable. Socrates was tried and executed in 399 BCE at age 70.",
  eraBackground: "egypt",
  accentColor: "#E8A33D",
  decisionQuestion: "Socrates said the wisest thing he knew was that he knew nothing. Do you think that's real wisdom — or false humility?",
  decisionCards: [
    { emoji: "🧠", label: "Real wisdom — knowing limits is powerful", pillarScore: 3 },
    { emoji: "🤷", label: "Too humble — he clearly knew a lot", pillarScore: 2 },
    { emoji: "⚖️", label: "Both can be true at once", pillarScore: 3 },
    { emoji: "❓", label: "I'm not sure yet", pillarScore: 2 },
  ],
  consequenceText: "The student who understood what Socrates actually meant — that claiming to know closes off learning — became one of his closest followers. The student who took it as mere humility learned nothing new that day.",
  consequenceHistoricalTie: "Socrates' students included Plato, Xenophon, and Alcibiades — some of the most influential thinkers in Western history. His method of questioning outlasted everything else he did.",
  miniGame: {
    type: "argument-builder",
    title: "Build the Argument",
    instruction: "Pick one position, then choose the reason that actually proves it — not just explains it.",
    claims: [
      "Admitting you don't know something makes you wiser",
      "Confidence in your knowledge makes you more effective",
    ],
    reasons: [
      "Because it keeps you open to learning more",
      "Because it impresses people who are listening",
      "Because it forces you to keep questioning your assumptions",
      "Because other people trust confident people more",
    ],
    strongReasons: [0, 2],
  },
  questionBanks: {
    k2: {
      entry: "What did Socrates say that surprised people?",
      core: [
        "Is it possible to be smart and still not know things?",
        "What's something you know you don't know yet?",
        "Why do you think some people pretend to know things they don't?",
      ],
      deep: [
        "Is it okay to say 'I don't know'?",
        "What's the difference between pretending to know and actually knowing?",
        "Socrates asked questions instead of giving speeches. Why do you think he did that?",
        "What question would you ask Socrates if you could?",
      ],
      disengagement: "Can you think of something you used to think you knew, but then found out was different than you thought?",
    },
    grade34: {
      entry: "Socrates said the wisest thing he knew was that he knew nothing. Why would admitting that make someone wiser than someone who believes they know everything?",
      core: [
        "The politician in the story said confident, impressive things — but Socrates' questions exposed that he couldn't explain his own ideas. What does that tell us about the difference between sounding smart and actually thinking clearly?",
        "What happens in a conversation when someone believes they already have all the answers?",
        "In one sentence — what do you think Socrates was actually trying to teach?",
        "Why is it sometimes harder to say something simple and true than something complicated and impressive?",
      ],
      deep: [
        "Have you ever been in a conversation where someone kept asking questions that made you think harder? How did it feel?",
        "Socrates never told people they were wrong. He just kept asking questions until they discovered it themselves. Why is that approach more effective than just telling someone the answer?",
        "Is there a situation in your own life where saying 'I don't know' would actually be more powerful than giving a confident answer?",
        "What's the difference between asking a question to understand something and asking a question to make someone look bad?",
        "Socrates eventually chose to die rather than stop asking questions. What does that tell you about what he believed his questions were worth?",
        "If you had to explain the Socratic method to someone in two sentences, what would you say?",
        "What question has been in your mind lately that you haven't asked anyone?",
      ],
      disengagement: "Try this: what's a question you've been wondering about — something you're genuinely unsure about? Let's start there.",
    },
    grade56: {
      entry: "Socrates said 'I know that I know nothing.' This is called epistemic humility. What does it mean to be genuinely uncertain about what you know — and why would that be a foundation for learning rather than a limitation?",
      core: [
        "The politician used impressive rhetoric — appeals to tradition, the gods, history. Socrates used persistent questions. Both are forms of communication. What's the fundamental difference between them as tools for finding truth?",
        "Socrates' method — the elenchus — is designed to reveal the limits of someone's claimed knowledge. What are the ethics of that? When is it respectful and when does it become a kind of intellectual attack?",
        "There's a paradox in Socrates' statement: claiming to know that you know nothing is itself a claim to knowledge. Is Socrates being inconsistent — or is the paradox the point?",
        "Why do you think it's psychologically difficult for people to say 'I don't know' — especially in public? What does that difficulty tell us about how we think about knowledge and status?",
      ],
      deep: [
        "Socrates was eventually tried and executed for corrupting the youth of Athens. In what sense might asking persistent questions be genuinely threatening to a society?",
        "What's the difference between genuine Socratic questioning — designed to help someone think — and sophistry, which uses questions to manipulate or win?",
        "In your own life, when has the most learning happened — when you received information or when you were asked a question you couldn't immediately answer?",
        "What does it mean to 'know' something versus to 'believe' something? Is there a meaningful distinction?",
        "Apply the Socratic method to your own most confident belief. Ask: what assumption does this belief rest on? Is that assumption correct? What would have to be true for this belief to be wrong?",
        "Socrates said his conversations were a service to Athens — that he was helping people think more clearly. The jury disagreed strongly enough to kill him. What does that gap tell us about the relationship between intellectual honesty and social comfort?",
        "Is there a question you're afraid to ask — about anything — because you're worried about what the answer might be?",
      ],
      disengagement: "Let's try the method itself: I'll ask you one question, and you try to answer it as honestly as you can — what's something you're confident about that you've never actually examined closely?",
    },
  },
  mentorClosing: "We explored why questions can be more powerful than answers — and why that's harder than it sounds.",
}

export const LEVEL_5: Partial<Lesson> = {
  id: 5, era: 1,
  title: "Seeing and Observing",
  historicalPeriod: "Athens, Greece, 335 BCE",
  pillar: "learning",
  pillarLabel: "Learning How to Learn",
  historicalContext: "Aristotle founded the Lyceum in Athens and taught while walking — the peripatetic method. His biological works describe over 500 species with extraordinary accuracy.",
  historicalAccuracyNote: "Historia Animalium and De Partibus Animalium show observation detail that wasn't surpassed for 2000 years. Aristotle's insistence on direct observation over received wisdom was genuinely revolutionary.",
  eraBackground: "safari",
  accentColor: "#E8A33D",
  decisionQuestion: "Aristotle told Alexios he had been 'seeing, not observing.' What do you think the difference is?",
  decisionCards: [
    { emoji: "👁️", label: "Looking vs. really paying attention", pillarScore: 2 },
    { emoji: "⏱️", label: "Fast vs. slow — slowing down changes everything", pillarScore: 3 },
    { emoji: "📝", label: "Noticing small things vs. just big ones", pillarScore: 3 },
    { emoji: "🎯", label: "Knowing what to look for in advance", pillarScore: 2 },
  ],
  consequenceText: "The second time, without trying to write quickly, Alexios noticed things that hadn't existed for him before: which foot the bird favored, the exact angle of its head when a sound occurred, the yellow-orange of its feet, slightly darker on the left. The bird hadn't changed. Alexios had.",
  consequenceHistoricalTie: "Aristotle's observational approach was the foundation of the scientific method — and wasn't formally extended or systematized for nearly 2,000 years.",
  miniGame: {
    type: "improve-solution",
    title: "Improve the Observation",
    instruction: "Here are Alexios's first notes. What would you add or change to make them a true observation?",
    items: [
      "The bird was small and brown.",
      "It sat in the tree for a while.",
      "It flew away when a noise happened.",
      "It looked like other birds I have seen.",
    ],
    improvements: [
      "Add exactly which foot it favored and the angle of its head",
      "Make the handwriting neater",
      "Write the notes faster next time",
      "Add how watching the bird made you feel",
    ],
    bestImprovement: 0,
    reflection: "Yes — the more exact and specific you get, the more you actually see. That's the whole difference between looking and observing.",
  },
  questionBanks: {
    k2: {
      entry: "What did Alexios write about the bird the first time?",
      core: [
        "Why did he write so much more the second time?",
        "What's the difference between looking at something and watching it?",
        "Have you ever noticed something really interesting when you slowed down and paid attention?",
      ],
      deep: [
        "What would you notice about a bird if you watched it for one whole hour?",
        "What made Alexios better at observing the second time around?",
        "Why did Aristotle tell him NOT to write anything for the first thirty minutes?",
        "What's something around you right now that you could really observe if you tried?",
      ],
      disengagement: "Look around the room you're in right now. What's something you see every day but haven't really paid attention to?",
    },
    grade34: {
      entry: "Alexios was trying to finish quickly the first time. How did that change what he saw?",
      core: [
        "What's the difference between looking at something and actually observing it?",
        "When Aristotle said Alexios had been 'seeing, not observing' — what did he mean?",
        "Why did Aristotle make him wait thirty minutes before writing? What happened in that time?",
        "Alexios's second set of notes had much more detail. Did the bird change — or did Alexios change?",
      ],
      deep: [
        "Have you ever noticed something surprising about something ordinary when you paid careful attention to it?",
        "What does this story suggest about the relationship between patience and learning?",
        "What habit of observation did Alexios start to build — and where else in his life do you think it would be useful?",
        "Aristotle's whole approach to knowledge was based on direct observation. Why do you think that was unusual enough to matter?",
        "Is there something in your own life that you look at every day but have never really observed?",
        "What's the difference between information that comes from reading and information that comes from direct observation? When is each more valuable?",
        "If you had to teach someone the skill of observing rather than just seeing — what would you tell them?",
      ],
      disengagement: "Tell me about something you know really well from close observation — a place, an animal, a person. What details do you notice that most people wouldn't?",
    },
    grade56: {
      entry: "Aristotle believed that all knowledge begins with direct observation. What's the argument for that position — and what's the strongest argument against it?",
      core: [
        "Alexios was intelligent and educated. What exactly was the cognitive mistake he made in his first hour of observation?",
        "There's a concept called 'selective attention' — the fact that we naturally filter out most of what's happening around us. What determines what we notice and what we ignore?",
        "Aristotle's instruction to not write for the first thirty minutes was pedagogically significant. What was he trying to prevent — and what was he trying to enable?",
        "The difference between Alexios's first and second observation wasn't intelligence or effort — he worked hard both times. What was actually different?",
      ],
      deep: [
        "Aristotle's biological works show extraordinary observational detail — over 500 species with notes on behavior, anatomy, and habitat. What does that level of observation require that most people don't develop?",
        "'Seeing but not observing' is a distinction that extends far beyond birdwatching. Where in your own life do you think you are seeing rather than observing?",
        "What is the relationship between observation and curiosity — does curiosity drive observation, or does observation generate curiosity?",
        "Alexios found that the bird's feet were yellow-orange, slightly darker on the left. What does noticing that kind of detail require — and what does it give you that general observation doesn't?",
        "In science, the quality of observation determines the quality of hypothesis. In what other domains does the quality of initial observation determine the quality of what follows?",
        "Is there something like 'observational bias' — a tendency to observe in ways that confirm what you already expect to see? How would you identify and counteract that in yourself?",
        "Aristotle's approach — observe first, theorize second — was in contrast to Plato's approach — theorize from first principles, observe as illustration. Which approach do you find more convincing, and why?",
        "What skill is Aristotle teaching Alexios that has nothing to do with birds?",
        "Describe a situation in your own life where you realized, after the fact, that you had been 'seeing not observing' — and what you missed as a result.",
      ],
      disengagement: "Let's try an experiment: think about a room or place you know well. Describe it as specifically as you can — what details do you actually know, and what are you guessing or filling in?",
    },
  },
  mentorClosing: "We looked at what it actually means to pay attention — not just look. That's a skill that works everywhere, not just with birds.",
}

// Levels 6-20: Partial data with abbreviated question banks
export const LEVEL_6: Partial<Lesson> = {
  id: 6, era: 1, title: "The Girl Who Could Not Study Philosophy",
  historicalPeriod: "Athens, Greece, 400 BCE", pillar: "critical", pillarLabel: "Critical Thinking",
  historicalContext: "Women were excluded from formal education in ancient Athens — yet philosophical texts by women from this era have survived.",
  eraBackground: "treehouse", accentColor: "#E8A33D",
  decisionQuestion: "Helia's family told her philosophy wasn't for her — not because they were cruel, but because everyone believed it. Should she believe them?",
  decisionCards: [
    { emoji: "👨‍👩‍👧", label: "Trust her family — they know best", pillarScore: 1 },
    { emoji: "❓", label: "Ask for the reason behind the rule", pillarScore: 3 },
    { emoji: "📚", label: "Find evidence herself", pillarScore: 3 },
    { emoji: "🗣️", label: "Find someone who disagrees", pillarScore: 2 },
  ],
  consequenceText: "Helia studied in secret. Manuscripts found in her house, discovered generations later, showed a mind asking exactly the questions that the men in her father's study had never thought to ask — because they'd never had to.",
  miniGame: {
    type: "match",
    title: "Match the clue to what it really means",
    instruction: "Tap a clue on the left, then tap what it actually tells you on the right.",
    pairs: [
      { left: "Everyone agrees it's true", right: "Still worth checking for yourself" },
      { left: "A rule with no reason given", right: "Fair to ask why the rule exists" },
      { left: "You figured it out yourself", right: "Now you can explain how you know" },
    ],
    reflection: "Nice — noticing what a clue actually proves (and what it doesn't) is the heart of thinking clearly.",
  },
  questionBanks: {
    k2: {
      entry: "Is something true just because a lot of people believe it?",
      core: ["Has anyone ever told you something is true that later turned out to be wrong?", "How do you decide if something is really true?"],
      deep: ["What would help you decide who to believe?"],
      disengagement: "Can you think of something lots of people used to believe that we now know isn't true?",
    },
    grade34: {
      entry: "What is the difference between believing something because someone said so and believing it because of a reason?",
      core: ["Why is it hard to question what most people believe?", "What's a way to check if something is actually true?"],
      deep: ["When do you think it is right to question something an older person tells you?"],
      disengagement: "Think of something you believed for a long time and then changed your mind about — what made you change?",
    },
    grade56: {
      entry: "Her family's argument was 'everyone knows this is true.' What is wrong with that as an argument — technically, logically?",
      core: ["What's the difference between consensus and proof?", "Helia studied anyway. What do you think drove that decision?"],
      deep: ["Can you think of something people 'just know' today that the weight of evidence actually challenges? How would someone go about questioning it respectfully but rigorously?"],
      disengagement: "What's a belief you hold strongly right now — what's the evidence for it, and what would count as evidence against it?",
    },
  },
  mentorClosing: "We explored the difference between 'everyone knows this' and actually knowing something. Those are very different things.",
}

export const LEVEL_7: Partial<Lesson> = {
  id: 7, era: 1, title: "The Friend's Secret",
  historicalPeriod: "Babylon, 600 BCE", pillar: "resilience", pillarLabel: "Resilience & Character",
  historicalContext: "Babylonian commercial law under Hammurabi's code governed trade partnerships strictly. A merchant's reputation was legally enforced — and worth more than money.",
  eraBackground: "egypt", accentColor: "#E8A33D",
  decisionQuestion: "Enlil discovered his closest friend has been cheating their customers. Staying silent makes him complicit. Speaking up might end the friendship. What does he do?",
  decisionCards: [
    { emoji: "🤫", label: "Stay quiet — protect the friendship", pillarScore: 1 },
    { emoji: "🗣️", label: "Tell Nabu directly — friend to friend", pillarScore: 3 },
    { emoji: "⚖️", label: "Report to the authorities", pillarScore: 2 },
    { emoji: "⏳", label: "Wait to see if it stops on its own", pillarScore: 1 },
  ],
  consequenceText: "Enlil waited. Six weeks later the scheme collapsed anyway. Nabu was fined two years of earnings. Enlil, as a knowing partner, lost his trading license. The friendship ended — with Nabu blaming Enlil for not stopping him sooner.",
  questionBanks: {
    k2: {
      entry: "Was it kind to stay quiet and protect his friend?",
      core: ["Did staying quiet actually help Nabu?", "What do you think a real friend would have done?"],
      deep: ["Can something feel kind but still be wrong?"],
      disengagement: "Has a friend ever done something wrong and you didn't know whether to say something?",
    },
    grade34: {
      entry: "Why is it harder to tell the truth about someone you love than about a stranger?",
      core: ["What did Enlil actually owe Nabu — as a friend?", "Is protecting someone from consequences the same as being loyal?"],
      deep: ["What would a genuinely good friend have done when they first discovered the scheme?"],
      disengagement: "Think about what it would feel like if a close friend lied to you — how would you want them to have handled knowing that about you?",
    },
    grade56: {
      entry: "The trader thought he was choosing between his friend and the truth. Was that actually the choice he was making?",
      core: ["What is the difference between loyalty and complicity?", "Enlil's silence eventually harmed Nabu more than honesty would have. Does that change the moral calculation — or was the outcome just unlucky?"],
      deep: ["If you knew telling the truth would harm someone you love while protecting people you've never met — what would you do, and what principle would you be acting on?"],
      disengagement: "What's the hardest honest conversation you can imagine having with a close friend? What would make it worth having?",
    },
  },
  mentorClosing: "We talked about what real loyalty to a friend looks like when they're doing something wrong. That question doesn't have an easy answer.",
}

export const LEVEL_8: Partial<Lesson> = {
  id: 8, era: 1, title: "The Beaver's Bridge",
  historicalPeriod: "Roman Empire, 55 BCE", pillar: "creativity", pillarLabel: "Creativity & Vision",
  historicalContext: "Caesar's Rhine bridge (55 BCE) is documented in his own Gallic Wars. Built in 10 days using interlocking pile techniques, it was genuinely innovative. Engineers still study it.",
  eraBackground: "safari", accentColor: "#E8A33D",
  decisionQuestion: "Marcus can't build the bridge with standard methods — not enough materials, not enough time. He's looking at a beaver dam. What would you try next?",
  decisionCards: [
    { emoji: "📖", label: "Go back to the engineering manual", pillarScore: 1 },
    { emoji: "🦫", label: "Study how the beaver dam actually works", pillarScore: 3 },
    { emoji: "📐", label: "Redesign using available materials", pillarScore: 2 },
    { emoji: "🌊", label: "Use the river current as part of the structure", pillarScore: 3 },
  ],
  consequenceText: "Marcus built using interlocking timber — the beaver's principle. The current pressed the structure tighter rather than wearing it down. The bridge held. Caesar crossed. Locals used it for 40 more years.",
  questionBanks: {
    k2: {
      entry: "Where did the architect's idea come from?",
      core: ["Why didn't he look at the beaver dam earlier?", "Can you think of something in nature that works like something people made?"],
      deep: ["Can you think of something in nature that works like something people made?"],
      disengagement: "What's an animal you know about — how does it solve problems that humans also have to solve?",
    },
    grade34: {
      entry: "Why didn't anyone think to look at the beaver's dam before?",
      core: ["What made Marcus willing to try something no engineer had done before?", "What's the difference between copying something and being inspired by it?"],
      deep: ["What would you do to give yourself a better chance of finding unexpected answers when you're stuck?"],
      disengagement: "Think about something in your house — what does it have in common with something in nature?",
    },
    grade56: {
      entry: "Marcus solved an engineering problem using a principle from biology. What does this tell us about the relationship between different fields of knowledge?",
      core: ["There's a field called biomimicry — designing human solutions based on natural ones. What makes this approach valuable, and what are its limits?", "Expertise in engineering might actually make it harder to think like a beaver — what does that tell us about how specialization shapes thinking?"],
      deep: ["The history of innovation is full of cross-domain breakthroughs — someone from one field noticing what experts in another field missed. Why does expertise sometimes make you less likely to find those connections?"],
      disengagement: "Name a problem that feels stuck to you. Now: what does nature do when it faces a similar constraint?",
    },
  },
  mentorClosing: "We looked at what it takes to find an answer in an unexpected place — and what makes that genuinely hard to do.",
}

export const LEVEL_9: Partial<Lesson> = {
  id: 9, era: 1, title: "The Argument at the Council",
  historicalPeriod: "Athens, Greece, 430 BCE", pillar: "communication", pillarLabel: "Communication & Articulation",
  historicalContext: "The Athenian Ekklesia was one of history's earliest democratic assemblies. The ability to make a clear argument was the most valued civic skill.",
  eraBackground: "mountain", accentColor: "#E8A33D",
  decisionQuestion: "The orator was impressive but said almost nothing. Lena has one question and one reason. How does she use them?",
  decisionCards: [
    { emoji: "🔥", label: "Match his energy — speak louder", pillarScore: 1 },
    { emoji: "❓", label: "Ask the one question he can't answer", pillarScore: 3 },
    { emoji: "📜", label: "Point directly to the archive record", pillarScore: 3 },
    { emoji: "🎭", label: "Appeal to the council's emotions", pillarScore: 1 },
  ],
  consequenceText: "Lena stated her position in one sentence and gave one verifiable reason: the archive document from 40 years ago. When asked to respond, the orator couldn't. The council voted in the villages' favor.",
  questionBanks: {
    k2: {
      entry: "Does being louder make you more right?",
      core: ["What did Lena do that the orator didn't?", "Why do people sometimes talk a lot but not really say much?"],
      deep: ["What did Lena do that was better than being impressive?"],
      disengagement: "Think of a time you tried to explain something to someone. What made it go well or go badly?",
    },
    grade34: {
      entry: "Why did Lena win even though the orator was much more confident?",
      core: ["What is the difference between an impressive argument and a true one?", "What did Lena's one question do that a counter-argument wouldn't have?"],
      deep: ["What is the difference between an argument that sounds convincing and an argument that actually proves something?"],
      disengagement: "Think of a disagreement you've had — what would have made your side more convincing, not louder, more convincing?",
    },
    grade56: {
      entry: "Lena asked a question instead of arguing back. Why is a well-placed question sometimes more powerful than a counter-argument?",
      core: ["What's the strategic difference between refuting someone and asking them a question they can't answer?", "The orator used authority, tradition, and impressive language. Lena used one document. What does that contrast reveal about what actually matters in a real argument?"],
      deep: ["Is there a difference between persuading someone and being right? When they conflict, which matters more — and does your answer change depending on the situation?"],
      disengagement: "What's a position you hold that you've never had to actually defend? What's the one best piece of evidence for it?",
    },
  },
  mentorClosing: "We looked at why a question that can't be answered is worth more than ten arguments that can be ignored.",
}

export const LEVEL_10: Partial<Lesson> = {
  id: 10, era: 1, title: "The Proof That Was Wrong",
  historicalPeriod: "Alexandria, Egypt, 300 BCE", pillar: "learning", pillarLabel: "Learning How to Learn",
  historicalContext: "The Library of Alexandria was the greatest center of learning in the ancient world. Mathematical proof culture was rigorous — a flawed proof was not acceptable, no matter how close.",
  eraBackground: "workshop", accentColor: "#E8A33D",
  decisionQuestion: "Thais found a mistake in her proof the night before her presentation. She can hide it or start over. What does she do?",
  decisionCards: [
    { emoji: "😰", label: "Present it — hope nobody notices", pillarScore: 1 },
    { emoji: "🔄", label: "Start over and work through the night", pillarScore: 3 },
    { emoji: "🙋", label: "Tell the teacher and ask for more time", pillarScore: 2 },
    { emoji: "🔍", label: "Follow the error — see where it leads", pillarScore: 3 },
  ],
  consequenceText: "She followed the error. It pointed to a more complex truth than her original proof captured. At sunrise she had something better than what she'd planned to present. The teacher read it in silence, then said: 'Now you have proved something worth proving.'",
  questionBanks: {
    k2: {
      entry: "What happened when Thais found the mistake in her work?",
      core: ["What did she do instead of hiding it?", "Was that the right choice?"],
      deep: ["Is it okay to make mistakes? What matters most about what you do after?"],
      disengagement: "Think of a time you made a mistake at something. What did you do — and what would you do differently now?",
    },
    grade34: {
      entry: "Why do most people try to hide mistakes instead of fixing them, even when fixing would lead somewhere better?",
      core: ["What made Thais decide to follow the error instead of hiding it?", "How is following a mistake different from just fixing it?"],
      deep: ["Thais found that following her error led her to a more interesting answer. Have you ever fixed a mistake and ended up somewhere better than where you started?"],
      disengagement: "Think about a mistake you made recently. What did you learn from it — if anything? What would you have needed to do differently to actually learn something from it?",
    },
    grade56: {
      entry: "The error in Thais's proof pointed at a more complex truth than her original approach captured. What does that suggest about what mistakes actually are — at a fundamental level?",
      core: ["What's the difference between a mistake that teaches you something and one that doesn't?", "Why is hiding a mistake in math worse than hiding one in, say, a social situation?"],
      deep: ["There's a concept in mathematics and science called a 'productive failure' — a mistake that advances understanding. How would you build a practice of treating your own errors as productive rather than as evidence of inadequacy?"],
      disengagement: "What's a mistake you're still learning from? What specifically did following it — rather than hiding it — teach you?",
    },
  },
  mentorClosing: "We talked about what mistakes actually are when you're willing to follow them honestly. That reframe changes everything.",
}

// Levels 11-20: Skeleton data
export const LEVEL_11: Partial<Lesson> = {
  id: 11, era: 1, title: "The Weight of a Name", pillar: "critical", pillarLabel: "Critical Thinking",
  historicalPeriod: "Ancient Egypt, 1200 BCE",
  historicalContext: "Egyptian official records were demonstrably propagandistic. Ramesses II's account of Kadesh presents it as a great victory; Hittite records show the same battle as a Hittite victory.",
  eraBackground: "egypt", accentColor: "#E8A33D",
  questionBanks: {
    k2: { entry: "Is it okay to write down something you know isn't true, if someone tells you to?", core: ["What would happen if everyone did that?"], deep: ["How would you feel reading a history book and knowing it might not be true?"], disengagement: "Have you ever been told to say something you didn't think was true?" },
    grade34: { entry: "If official records say one thing and soldiers who were there say another — how would you figure out which is more accurate?", core: ["What makes a source trustworthy?"], deep: ["Does it matter who wins when it comes to what gets remembered?"], disengagement: "What's the difference between a story and a fact?" },
    grade56: { entry: "The phrase 'history is written by the winners' suggests that official records are inherently biased toward those in power. What are the implications of that for how we understand the past?", core: ["What tools do historians use to check official accounts?"], deep: ["How should this awareness change how you read news or official statements today?"], disengagement: "What's a historical event you know two very different accounts of?" },
  },
  mentorClosing: "History is always someone's version of events — learning to ask 'whose?' is how you start thinking critically.",
}

export const LEVEL_12: Partial<Lesson> = {
  id: 12, era: 1, title: "The Shorter Road", pillar: "resilience", pillarLabel: "Resilience & Character",
  historicalPeriod: "Greece, 480 BCE",
  historicalContext: "The original Marathon story involved a run of approximately 240km. Messenger reliability was the difference between victory and defeat in Persian Wars battles.",
  eraBackground: "mountain", accentColor: "#E8A33D",
  questionBanks: {
    k2: { entry: "Why did Doros choose the easier road instead of the harder one?", core: ["Did it work out the way he expected?"], deep: ["Can you think of a time the easy choice made something harder later?"], disengagement: "What's something that was hard at first but you're glad you did?" },
    grade34: { entry: "Doros made the choice that seemed faster and easier in the moment. What information did he have wrong — and what would have helped him decide better?", core: ["Is it always wrong to choose the easier path?"], deep: ["Does it matter why something is hard?"], disengagement: "Think of something you chose the easier version of. How did it turn out?" },
    grade56: { entry: "Doros chose the path of least resistance and justified it to himself as being faster. This is called motivated reasoning — finding reasons to support the choice you already want to make. How do you identify motivated reasoning in your own decisions?", core: ["What's the difference between genuine trade-off thinking and rationalization?"], deep: ["How would you build a habit of catching yourself doing this?"], disengagement: "What's a decision you made recently that you told yourself was the smart choice — was it really?" },
  },
  mentorClosing: "The path that looks easier isn't always the one that costs less — that's a lesson that shows up everywhere.",
}

export const LEVEL_13: Partial<Lesson> = {
  id: 13, era: 1, title: "The Unfinished Map", pillar: "creativity", pillarLabel: "Creativity & Vision",
  historicalPeriod: "Babylon, 600 BCE",
  historicalContext: "The Babylonian Map of the World (circa 600 BCE) is the oldest surviving world map. It labeled distant regions with mythological descriptions — an early form of honest uncertainty.",
  eraBackground: "egypt", accentColor: "#E8A33D",
  questionBanks: {
    k2: { entry: "Why did Shala mark parts of the map as 'unknown' instead of guessing what was there?", core: ["What's the problem with guessing?"], deep: ["Is it okay to say you don't know something on something official like a map?"], disengagement: "What's something you'd draw on a map of your neighborhood that nobody else would know about?" },
    grade34: { entry: "Shala's honest 'unknown' sections actually protected the trading party. What does that tell us about the value of being honest about what you don't know — even when it looks less impressive?", core: ["Is it braver to make something up or to admit you don't know?"], deep: ["Where in your own life does admitting uncertainty actually lead to better outcomes?"], disengagement: "When was the last time someone said 'I don't know' to you? Did you trust them more or less for it?" },
    grade56: { entry: "The Babylonian Map labeled distant territories with mythological creatures rather than blank spaces. What does the human tendency to fill in unknowns with myths tell us about how we relate to uncertainty?", core: ["Is filling in blanks always a problem — or does it sometimes help?"], deep: ["How should we handle uncertainty in maps we use today — weather forecasts, economic models, medical predictions?"], disengagement: "What's something in your life where you've filled in an 'unknown' with a guess that felt more comfortable than leaving it blank?" },
  },
  mentorClosing: "Saying 'I don't know' is sometimes the most accurate and courageous thing you can put on a map.",
}

export const LEVEL_14: Partial<Lesson> = {
  id: 14, era: 1, title: "The Argument at the Fountain", pillar: "communication", pillarLabel: "Communication & Articulation",
  historicalPeriod: "Athens, 440 BCE",
  historicalContext: "Athenian public life centered on the Agora. Disputes between merchants were often argued publicly, and the ability to reframe a conflict was a valued civic skill.",
  eraBackground: "egypt", accentColor: "#E8A33D",
  questionBanks: {
    k2: { entry: "Why were Kreon and Basil arguing, and why wasn't it working?", core: ["What did Clea do differently?"], deep: ["Have you ever helped two people stop fighting? What did you do?"], disengagement: "What's the hardest part about staying calm when someone is being unfair to you?" },
    grade34: { entry: "Clea changed the question from 'what happened?' to 'what do you want to happen?' Why did that make the conversation more useful?", core: ["What's the difference between talking about the past and talking about the future in an argument?"], deep: ["When in an argument is it useful to reframe — and when would it make things worse?"], disengagement: "Think of a conflict you've been in. What question would have helped move it forward?" },
    grade56: { entry: "Clea's intervention was a reframe — she changed the structure of the conversation rather than adding a new argument within it. What conditions allow a reframe to work — and when does it fail?", core: ["Is reframing a form of manipulation or a form of wisdom — or can it be both?"], deep: ["What would you need to believe about the other person in a conflict to attempt a reframe rather than a counter-argument?"], disengagement: "What's a conflict you know about — in your life or in the world — that seems stuck? What question would reframe it?" },
  },
  mentorClosing: "Changing the question can end an argument that no one inside the argument could ever win.",
}

export const LEVEL_15: Partial<Lesson> = {
  id: 15, era: 1, title: "What the River Knows", pillar: "learning", pillarLabel: "Learning How to Learn",
  historicalPeriod: "Egypt, 1400 BCE",
  historicalContext: "The Nilometer — one of history's earliest scientific instruments — was used to measure flood levels and predict agricultural yields. Farmers developed highly sophisticated observational systems over generations.",
  eraBackground: "safari", accentColor: "#E8A33D",
  questionBanks: {
    k2: { entry: "Why did Hapi wait while Renni planted early?", core: ["Who was right? How do you know?"], deep: ["How do you get better at something over a long time?"], disengagement: "Who is someone you know who is really good at something because they've done it for a long time?" },
    grade34: { entry: "Hapi's knowledge came from thirty years of watching. Renni's confidence came from one season. What is the difference between those two kinds of knowing?", core: ["Is experience always better than new ideas?"], deep: ["When should you trust someone's experience, and when should you question it?"], disengagement: "Think of something you're getting better at. What will you know in ten years that you don't know now?" },
    grade56: { entry: "There's a concept called 'tacit knowledge' — knowledge that is real and actionable but difficult to fully articulate or transfer. Hapi's knowledge of the Nile is this kind. What does the existence of tacit knowledge tell us about the limits of what can be taught explicitly versus what must be learned through experience?", core: ["What kinds of knowledge can be written down, and what kinds can only be gained through doing?"], deep: ["If tacit knowledge can't be fully transferred, what are the implications for how we design schools, training, or expertise?"], disengagement: "What's something you know how to do that you could never fully explain in words? What would it take to teach someone else?" },
  },
  mentorClosing: "Some knowledge lives in years of quiet attention — and can't be borrowed from someone who has it.",
}

export const LEVEL_16: Partial<Lesson> = {
  id: 16, era: 1, title: "The Borrowed Idea", pillar: "critical", pillarLabel: "Critical Thinking",
  historicalPeriod: "Athens, 380 BCE",
  historicalContext: "Philosophical attribution was contested in ancient Athens. The line between building on someone's work and claiming it as your own was genuinely unclear — and genuinely contested.",
  eraBackground: "treehouse", accentColor: "#E8A33D",
  questionBanks: {
    k2: { entry: "Is it okay to use someone else's idea without saying where you got it from?", core: ["Does it matter if you made the idea better?"], deep: ["How would you feel if someone used your idea without telling anyone it was yours?"], disengagement: "What's an idea you came up with that you're proud of?" },
    grade34: { entry: "Theo's teacher built on another philosopher's idea and made it better — but didn't say where it came from. Is that stealing, borrowing, or something else?", core: ["Where is the line between being inspired by someone and taking from them?"], deep: ["Does it matter if the person whose idea it was is still alive?"], disengagement: "Think of something you learned from someone else. How much credit did you give them when you used it?" },
    grade56: { entry: "All ideas build on previous ideas — Newton famously said he stood on the shoulders of giants. Where is the line between building on someone's work and taking credit for it, and what principle would you use to draw that line?", core: ["Is proper attribution about fairness, accuracy, or both?"], deep: ["How does attribution function differently in different fields — art vs. science vs. business — and why?"], disengagement: "Name an idea that is widely credited to one person that actually built heavily on others. What does that tell you about how we construct the history of ideas?" },
  },
  mentorClosing: "All thinking builds on someone else's thinking — which is exactly why attribution matters.",
}

export const LEVEL_17: Partial<Lesson> = {
  id: 17, era: 1, title: "The Sick Village", pillar: "resilience", pillarLabel: "Resilience & Character",
  historicalPeriod: "Greece, 430 BCE",
  historicalContext: "The Plague of Athens (430-426 BCE) killed approximately 25% of the city's population. Thucydides, who survived it, wrote one of history's most detailed accounts of epidemic disease and moral breakdown.",
  eraBackground: "ocean", accentColor: "#E8A33D",
  questionBanks: {
    k2: { entry: "Lysia couldn't help everyone. How do you think she felt?", core: ["What did she have to decide?"], deep: ["Is it okay to help some people even if you can't help everyone?"], disengagement: "Have you ever had to choose between two things and couldn't do both?" },
    grade34: { entry: "When there is no good option — only less-bad options — what is the best way to decide? What would you use to decide who to help?", core: ["Does it matter who needs help most vs. who is most likely to survive with help?"], deep: ["How do you make a decision that will have consequences either way?"], disengagement: "Think of a time you had to choose between two things you both wanted or both felt were important. How did you decide?" },
    grade56: { entry: "Medical triage — deciding who to treat when resources are scarce — is a real and ongoing ethical problem. What principle would you use to make those decisions: most likely to survive, most severe need, most dependents, or something else? What does your answer reveal about your deepest values?", core: ["Are there situations where 'fairness' and 'best outcomes' pull in opposite directions?"], deep: ["What would it do to Lysia — to any person — to make decisions like this repeatedly? What does that cost?"], disengagement: "Name a current situation in the world where someone is having to make decisions about who gets limited resources. What principle do you think they're using — and what principle should they be using?" },
  },
  mentorClosing: "When all choices cost something, how you decide reveals what you actually value — not just what you say you value.",
}

export const LEVEL_18: Partial<Lesson> = {
  id: 18, era: 1, title: "The Wall Nobody Finished", pillar: "creativity", pillarLabel: "Creativity & Vision",
  historicalPeriod: "Rome, 75 BCE",
  historicalContext: "Roman engineering was the most sophisticated in the ancient world. Many construction problems required engineers to first understand the actual failure mode before solving it — drainage problems were often misidentified as structural ones.",
  eraBackground: "workshop", accentColor: "#E8A33D",
  questionBanks: {
    k2: { entry: "Why did Gaius spend two weeks just looking before he did anything?", core: ["What did he notice that the others missed?"], deep: ["Is it ever faster to slow down and think before you act?"], disengagement: "Have you ever rushed at something and then had to start over? What would have helped?" },
    grade34: { entry: "Three engineers tried the same approach and it failed each time. What would you want to understand before trying anything new?", core: ["What's the difference between trying harder and trying differently?"], deep: ["How do you know when you've actually understood the problem vs. when you're just doing more of the same?"], disengagement: "Think of a puzzle or problem you've worked on. How did you decide when to try a new approach?" },
    grade56: { entry: "Gaius solved a structural problem by first reframing it as a water problem. He had to completely change the domain in which he was working. How do you develop the habit of asking 'am I solving the right problem?' before investing energy in a solution?", core: ["What does it cost to discover you've been solving the wrong problem after you've already invested time?"], deep: ["What questions would you build into a problem-solving routine that would catch domain mismatch earlier?"], disengagement: "What's a problem in your life where you've been working on what might be the wrong version of it? What's the right version?" },
  },
  mentorClosing: "The right problem is often not the one that looks obvious — finding it is sometimes the whole job.",
}

export const LEVEL_19: Partial<Lesson> = {
  id: 19, era: 1, title: "The Speech That Cost Everything", pillar: "communication", pillarLabel: "Communication & Articulation",
  historicalPeriod: "Athens, 399 BCE",
  historicalContext: "The trial of Socrates is one of the most documented events in ancient history. Plato's Apology records his actual defense speech. He was 70 years old. He chose honesty over survival.",
  eraBackground: "mountain", accentColor: "#E8A33D",
  questionBanks: {
    k2: { entry: "Why didn't Socrates just say what the jury wanted to hear?", core: ["What did he believe was more important than saying what people wanted?"], deep: ["Is it always wrong to say what people want to hear even if it isn't true?"], disengagement: "Have you ever told the truth knowing it would make someone unhappy?" },
    grade34: { entry: "Socrates was told he could survive if he said the right things. He chose not to. What do you think he believed that made that choice feel like the right one?", core: ["Is it brave or foolish to tell the truth when it costs you everything?"], deep: ["Where is the line between standing on principle and being unnecessarily stubborn?"], disengagement: "What do you believe so strongly that you'd be willing to stand up for it even if it made people angry at you?" },
    grade56: { entry: "Socrates chose honesty knowing it would cost him his life. Most ethical decisions don't involve life and death. But the structure is the same: a cost for honesty, a benefit for saying what others want to hear. What principle would help you navigate that trade-off in smaller, everyday situations?", core: ["Does Socrates' choice seem more admirable from a distance than it would in the moment?"], deep: ["Is there a difference between being principled and being willing to die for a principle? Should the stakes change what you're willing to do?"], disengagement: "Think of a situation — past, present, or hypothetical — where honesty would cost you something real. What would you do?" },
  },
  mentorClosing: "Socrates chose to be honest even knowing what it would cost. That choice is still being talked about 2,400 years later.",
}

export const LEVEL_20: Partial<Lesson> = {
  id: 20, era: 1, title: "Knowing When to Stop", pillar: "learning", pillarLabel: "Learning How to Learn",
  historicalPeriod: "Syracuse, 250 BCE",
  historicalContext: "Archimedes worked on problems for years at a time. His manuscripts show multiple approaches to the same problem — evidence of someone who knew the difference between real persistence and banging against a wall.",
  eraBackground: "workshop", accentColor: "#E8A33D",
  questionBanks: {
    k2: { entry: "What's the difference between not giving up and being stuck?", core: ["How did Polys know Archimedes was stuck?"], deep: ["Is it giving up if you try something completely different?"], disengagement: "Have you ever tried the same thing over and over and it didn't work? What did you eventually do?" },
    grade34: { entry: "Polys noticed that Archimedes was trying the same things harder instead of trying different things. How would you know if you were doing the same thing?", core: ["What's the difference between persistence and stubbornness?"], deep: ["What would a good rule be for when to keep going vs. when to change direction?"], disengagement: "Think of something you keep trying the same way. What would a completely different approach look like?" },
    grade56: { entry: "There's a concept called the 'sunk cost fallacy' — the tendency to continue investing in something because of what you've already put in, even when it's not working. How do you distinguish between genuine persistence and sunk cost thinking in your own decisions?", core: ["Is there a version of quitting that is actually the braver, smarter choice?"], deep: ["What mental habits or questions would help you catch yourself falling into sunk cost thinking?"], disengagement: "Name something you've invested significant time or effort in that isn't working as well as you hoped. What would it look like to make a clean-eyed assessment of it right now?" },
  },
  mentorClosing: "Knowing when to change approach — not just try harder — is one of the most useful skills there is.",
}

// ============================================================
// ERA 2 — AGE OF EXPLORATION (Levels 21-40)
// ============================================================
export const ERA2_LEVELS: Partial<Lesson>[] = [
  { id: 21, era: 2, title: "The Weight of a Journal", pillar: "resilience", pillarLabel: "Resilience & Character", historicalPeriod: "Africa, 1325 CE", historicalContext: "Ibn Battuta traveled approximately 120,000 km over 29 years — further than any recorded traveler before him.", eraBackground: "safari", accentColor: "#4F8B6E" },
  { id: 22, era: 2, title: "Here Be Dragons", pillar: "critical", pillarLabel: "Critical Thinking", historicalPeriod: "Europe, 1490 CE", historicalContext: "The Hereford Mappa Mundi (1300 CE) is one of the most complete medieval world maps. Most maps simply left unknown regions blank.", eraBackground: "ocean", accentColor: "#4F8B6E" },
  { id: 23, era: 2, title: "The Other Shore", pillar: "resilience", pillarLabel: "Resilience & Character", historicalPeriod: "Pacific Ocean, 1521 CE", historicalContext: "Magellan's circumnavigation (1519-1522) began with 270 men and 5 ships. It ended with 18 men and 1 ship.", eraBackground: "ocean", accentColor: "#4F8B6E" },
  { id: 24, era: 2, title: "What She Noticed", pillar: "critical", pillarLabel: "Critical Thinking", historicalPeriod: "West Africa, 1895 CE", historicalContext: "Mary Kingsley traveled alone through West Africa. Her published observations were remarkably free of the prejudice typical of the era.", eraBackground: "safari", accentColor: "#4F8B6E" },
  { id: 25, era: 2, title: "The Two Translations", pillar: "communication", pillarLabel: "Communication & Articulation", historicalPeriod: "Indian Ocean, 1498 CE", historicalContext: "Vasco da Gama's first voyage to India required navigating multiple languages, cultures, and political systems.", eraBackground: "ocean", accentColor: "#4F8B6E" },
  { id: 26, era: 2, title: "The River Nobody Named", pillar: "creativity", pillarLabel: "Creativity & Vision", historicalPeriod: "Americas, 1541 CE", historicalContext: "Francisco de Orellana's descent of the Amazon (1541-42) is the first documented European navigation of the river.", eraBackground: "safari", accentColor: "#4F8B6E" },
  { id: 27, era: 2, title: "Uncharted", pillar: "learning", pillarLabel: "Learning How to Learn", historicalPeriod: "Pacific Ocean, 1778 CE", historicalContext: "Polynesian navigation — using stars, waves, birds, and currents — is one of the most sophisticated non-instrumental navigational systems ever developed.", eraBackground: "ocean", accentColor: "#4F8B6E" },
  { id: 28, era: 2, title: "The Wrong Kind of Gold", pillar: "resilience", pillarLabel: "Resilience & Character", historicalPeriod: "Americas, 1539 CE", historicalContext: "Hernando de Soto's expedition through the American Southeast was one of the most destructive in the continent's history.", eraBackground: "safari", accentColor: "#4F8B6E" },
  { id: 29, era: 2, title: "The Question Before the Sword", pillar: "critical", pillarLabel: "Critical Thinking", historicalPeriod: "Caribbean, 1492 CE", historicalContext: "Columbus's first contact with the Taino people shows him immediately calculating their suitability for labor.", eraBackground: "ocean", accentColor: "#4F8B6E" },
  { id: 30, era: 2, title: "The Empty Journal", pillar: "learning", pillarLabel: "Learning How to Learn", historicalPeriod: "Atlantic Ocean, 1600 CE", historicalContext: "Ship's logs from the Age of Exploration are among our most valuable historical records — and among the most inconsistent.", eraBackground: "ocean", accentColor: "#4F8B6E" },
  { id: 31, era: 2, title: "The Long Way Around", pillar: "creativity", pillarLabel: "Creativity & Vision", historicalPeriod: "Southern Africa, 1488 CE", historicalContext: "Bartolomeu Dias rounded the Cape of Good Hope in 1488 — a route considered impossible.", eraBackground: "ocean", accentColor: "#4F8B6E" },
  { id: 32, era: 2, title: "What They Brought Back", pillar: "resilience", pillarLabel: "Resilience & Character", historicalPeriod: "Europe, 1522 CE", historicalContext: "The 18 survivors of Magellan's circumnavigation returned to find themselves almost three years older than they expected.", eraBackground: "treehouse", accentColor: "#4F8B6E" },
  { id: 33, era: 2, title: "The Promise at the Shore", pillar: "communication", pillarLabel: "Communication & Articulation", historicalPeriod: "East Africa, 1500 CE", historicalContext: "Portuguese-Swahili coast encounters involved complex negotiations around trade rights, tribute, and alliance.", eraBackground: "safari", accentColor: "#4F8B6E" },
  { id: 34, era: 2, title: "The Two Fires", pillar: "critical", pillarLabel: "Critical Thinking", historicalPeriod: "Americas, 1519 CE", historicalContext: "Cortés received contradictory accounts of the Aztec Empire from multiple sources.", eraBackground: "safari", accentColor: "#4F8B6E" },
  { id: 35, era: 2, title: "The Language of Hands", pillar: "communication", pillarLabel: "Communication & Articulation", historicalPeriod: "Pacific, 1770 CE", historicalContext: "Captain Cook's first contact with Aboriginal Australians at Botany Bay was conducted entirely through gesture, expression, and observation.", eraBackground: "safari", accentColor: "#4F8B6E" },
  { id: 36, era: 2, title: "The Seed That Traveled", pillar: "creativity", pillarLabel: "Creativity & Vision", historicalPeriod: "Global, 1400-1600 CE", historicalContext: "The Columbian Exchange — the transfer of plants, animals, disease, and culture between hemispheres after 1492 — is one of history's most transformative events.", eraBackground: "safari", accentColor: "#4F8B6E" },
  { id: 37, era: 2, title: "Turning Back", pillar: "resilience", pillarLabel: "Resilience & Character", historicalPeriod: "Arctic, 1610 CE", historicalContext: "Henry Hudson's final voyage (1610-11) ended when his crew mutinied and set him adrift in the bay that now bears his name.", eraBackground: "ocean", accentColor: "#4F8B6E" },
  { id: 38, era: 2, title: "What Zheng He Didn't Take", pillar: "critical", pillarLabel: "Critical Thinking", historicalPeriod: "Indian Ocean, 1421 CE", historicalContext: "Zheng He commanded the largest fleet in history across seven voyages. Unlike European contemporaries, he established trade relationships rather than conquest.", eraBackground: "ocean", accentColor: "#4F8B6E" },
  { id: 39, era: 2, title: "The Last Entry", pillar: "learning", pillarLabel: "Learning How to Learn", historicalPeriod: "Antarctica, 1912 CE", historicalContext: "Robert Falcon Scott's final journal entries, written as he was dying in his Antarctic tent, describe what went wrong with extraordinary clarity.", eraBackground: "mountain", accentColor: "#4F8B6E" },
  { id: 40, era: 2, title: "The Return", pillar: "resilience", pillarLabel: "Resilience & Character", historicalPeriod: "Europe, 1522 CE", historicalContext: "The survivors of Magellan's circumnavigation had been gone for three years and arrived home with almost nothing.", eraBackground: "treehouse", accentColor: "#4F8B6E" },
]

// ============================================================
// ERA 3 — RENAISSANCE & REASON (Levels 41-60)
// ============================================================
export const ERA3_LEVELS: Partial<Lesson>[] = [
  { id: 41, era: 3, title: "Moons of Jupiter", pillar: "critical", pillarLabel: "Critical Thinking", historicalPeriod: "Padua, Italy, 1610 CE", historicalContext: "Galileo's Sidereus Nuncius (1610) documented the four moons of Jupiter — the first direct proof that not everything orbited Earth.", eraBackground: "space", accentColor: "#8B5FA3" },
  { id: 42, era: 3, title: "The Unfinished Painting", pillar: "creativity", pillarLabel: "Creativity & Vision", historicalPeriod: "Milan, Italy, 1490 CE", historicalContext: "Da Vinci is estimated to have completed fewer than 20 paintings in his lifetime. He started many more.", eraBackground: "workshop", accentColor: "#8B5FA3" },
  { id: 43, era: 3, title: "The Body Nobody Opened", pillar: "critical", pillarLabel: "Critical Thinking", historicalPeriod: "Brussels, 1543 CE", historicalContext: "Andreas Vesalius conducted his own human dissections when every other anatomist was simply illustrating Galen's 1,400-year-old texts.", eraBackground: "workshop", accentColor: "#8B5FA3" },
  { id: 44, era: 3, title: "The Apprentice's Question", pillar: "communication", pillarLabel: "Communication & Articulation", historicalPeriod: "Florence, Italy, 1480 CE", historicalContext: "The apprentice system in Renaissance workshops meant students spent years learning from masters who were often genuinely wrong about some things.", eraBackground: "workshop", accentColor: "#8B5FA3" },
  { id: 45, era: 3, title: "Two Ways to Look at a Ceiling", pillar: "creativity", pillarLabel: "Creativity & Vision", historicalPeriod: "Rome, Italy, 1508 CE", historicalContext: "Michelangelo initially resisted the Sistine Chapel commission — he considered himself a sculptor, not a painter.", eraBackground: "workshop", accentColor: "#8B5FA3" },
  { id: 46, era: 3, title: "The Letter She Never Sent", pillar: "communication", pillarLabel: "Communication & Articulation", historicalPeriod: "Europe, 1600 CE", historicalContext: "Sophie Brahe assisted her brother Tycho Brahe in the most extensive pre-telescope astronomical observations ever made.", eraBackground: "treehouse", accentColor: "#8B5FA3" },
  { id: 47, era: 3, title: "The Clock That Was Wrong", pillar: "learning", pillarLabel: "Learning How to Learn", historicalPeriod: "Pisa, Italy, 1583 CE", historicalContext: "Galileo's observation of a pendulum in the Cathedral of Pisa led to the discovery of isochronism — he wasn't looking for it.", eraBackground: "workshop", accentColor: "#8B5FA3" },
  { id: 48, era: 3, title: "The Proof Nobody Wanted", pillar: "critical", pillarLabel: "Critical Thinking", historicalPeriod: "Poland, 1514-1543 CE", historicalContext: "Copernicus completed his heliocentric model around 1514 but didn't publish it until 1543 — the year of his death.", eraBackground: "space", accentColor: "#8B5FA3" },
  { id: 49, era: 3, title: "What the Sketch Said", pillar: "creativity", pillarLabel: "Creativity & Vision", historicalPeriod: "Milan, Italy, 1490 CE", historicalContext: "Da Vinci's notebooks contain approximately 7,000 surviving pages of anatomical drawings, engineering designs, and philosophical observations.", eraBackground: "workshop", accentColor: "#8B5FA3" },
  { id: 50, era: 3, title: "Halfway Through", pillar: "resilience", pillarLabel: "Resilience & Character", historicalPeriod: "Rome, 1510 CE", historicalContext: "Two years into the Sistine Chapel project, Michelangelo wrote to his father that he was miserable and considering abandoning the commission.", eraBackground: "mountain", accentColor: "#8B5FA3" },
  { id: 51, era: 3, title: "The Wrong Patient", pillar: "resilience", pillarLabel: "Resilience & Character", historicalPeriod: "Europe, 1550 CE", historicalContext: "Renaissance physicians faced the problem of diagnosing without instruments — only observation, touch, and reasoning.", eraBackground: "treehouse", accentColor: "#8B5FA3" },
  { id: 52, era: 3, title: "The Price of Being Right", pillar: "resilience", pillarLabel: "Resilience & Character", historicalPeriod: "Rome, 1600 CE", historicalContext: "Giordano Bruno was burned at the stake in 1600 for proposing that stars were distant suns with their own planetary systems. He refused to recant. His ideas were largely correct.", eraBackground: "space", accentColor: "#8B5FA3" },
  { id: 53, era: 3, title: "The Silent Collaborator", pillar: "communication", pillarLabel: "Communication & Articulation", historicalPeriod: "Denmark/Prague, 1600 CE", historicalContext: "Johannes Kepler worked from Tycho Brahe's observational data after Brahe's death. The question of credit and ownership shaped one of astronomy's most important discoveries.", eraBackground: "space", accentColor: "#8B5FA3" },
  { id: 54, era: 3, title: "How It Actually Works", pillar: "critical", pillarLabel: "Critical Thinking", historicalPeriod: "Brussels, 1543 CE", historicalContext: "Galen's anatomical texts, written in 130 CE, contained over 200 errors. Medical schools taught them as fact for 1,400 years. Vesalius corrected them by simply looking.", eraBackground: "workshop", accentColor: "#8B5FA3" },
  { id: 55, era: 3, title: "The Idea He Gave Away", pillar: "creativity", pillarLabel: "Creativity & Vision", historicalPeriod: "Germany, 1450 CE", historicalContext: "Gutenberg's printing press was the most consequential invention of the millennium. Gutenberg himself died in poverty, having been stripped of his equipment.", eraBackground: "workshop", accentColor: "#8B5FA3" },
  { id: 56, era: 3, title: "What She Published Under His Name", pillar: "resilience", pillarLabel: "Resilience & Character", historicalPeriod: "Harvard, USA, 1925 CE", historicalContext: "Cecilia Payne-Gaposchkin's 1925 doctoral thesis demonstrated that stars are composed primarily of hydrogen and helium. Her supervisor convinced her to add a note saying the result was 'almost certainly not real.'", eraBackground: "space", accentColor: "#8B5FA3" },
  { id: 57, era: 3, title: "The Two Experiments", pillar: "critical", pillarLabel: "Critical Thinking", historicalPeriod: "Europe, 1600 CE", historicalContext: "The Scientific Revolution involved a genuine philosophical debate: should you trust careful theory or messy, unpredictable experimental evidence?", eraBackground: "workshop", accentColor: "#8B5FA3" },
  { id: 58, era: 3, title: "What the Music Said", pillar: "creativity", pillarLabel: "Creativity & Vision", historicalPeriod: "Germany, 1700 CE", historicalContext: "Bach's mathematical approach to music was controversial in his time. His contemporary Handel was more popular. Bach was largely rediscovered in the 19th century.", eraBackground: "treehouse", accentColor: "#8B5FA3" },
  { id: 59, era: 3, title: "The Last Student", pillar: "learning", pillarLabel: "Learning How to Learn", historicalPeriod: "Venice, Italy, 1519 CE", historicalContext: "Da Vinci trained many apprentices but is not documented to have had a single student who matched his breadth.", eraBackground: "workshop", accentColor: "#8B5FA3" },
  { id: 60, era: 3, title: "Reason Alone", pillar: "learning", pillarLabel: "Learning How to Learn", historicalPeriod: "France, 1637 CE", historicalContext: "Descartes' Meditations (1641) attempted to rebuild all knowledge from first principles using reason alone — doubting everything that could be doubted.", eraBackground: "space", accentColor: "#8B5FA3" },
]

// ============================================================
// ERA 4 — INDUSTRIAL INNOVATION (Levels 61-80)
// ============================================================
export const ERA4_LEVELS: Partial<Lesson>[] = [
  { id: 61, era: 4, title: "999 Ways That Don't Work", pillar: "creativity", pillarLabel: "Creativity & Vision", historicalPeriod: "Menlo Park, USA, 1879 CE", historicalContext: "Edison tested approximately 6,000 materials for the lightbulb filament before finding carbonized bamboo.", eraBackground: "workshop", accentColor: "#B85C2C" },
  { id: 62, era: 4, title: "The Idea He Stole", pillar: "resilience", pillarLabel: "Resilience & Character", historicalPeriod: "USA, 1880-1943 CE", historicalContext: "Tesla worked for Edison and was promised $50,000 for solving a problem Edison said was impossible. When he solved it, Edison said he had been joking.", eraBackground: "workshop", accentColor: "#B85C2C" },
  { id: 63, era: 4, title: "The First Program", pillar: "critical", pillarLabel: "Critical Thinking", historicalPeriod: "London, England, 1843 CE", historicalContext: "Ada Lovelace's notes on Babbage's Analytical Engine contain the first algorithm designed for a machine.", eraBackground: "workshop", accentColor: "#B85C2C" },
  { id: 64, era: 4, title: "The Factory at Night", pillar: "resilience", pillarLabel: "Resilience & Character", historicalPeriod: "England, 1833 CE", historicalContext: "The Factory Act of 1833 — the first effective factory legislation — prohibited children under 9 from working in textile mills.", eraBackground: "treehouse", accentColor: "#B85C2C" },
  { id: 65, era: 4, title: "The Letter to the Investor", pillar: "communication", pillarLabel: "Communication & Articulation", historicalPeriod: "USA, 1876 CE", historicalContext: "Western Union declined to purchase Alexander Graham Bell's telephone patent in 1876, calling it 'an electrical toy.'", eraBackground: "workshop", accentColor: "#B85C2C" },
  { id: 66, era: 4, title: "What the Machine Couldn't Do", pillar: "creativity", pillarLabel: "Creativity & Vision", historicalPeriod: "England, 1811-1816 CE", historicalContext: "The Luddite movement was not anti-technology — it was a skilled craftsman's movement against machinery that eliminated their craft while producing inferior goods.", eraBackground: "workshop", accentColor: "#B85C2C" },
  { id: 67, era: 4, title: "The Better Steel", pillar: "learning", pillarLabel: "Learning How to Learn", historicalPeriod: "England, 1856 CE", historicalContext: "Henry Bessemer accidentally discovered his steelmaking process when a stream of air happened to hit a pig-iron sample in his furnace.", eraBackground: "workshop", accentColor: "#B85C2C" },
  { id: 68, era: 4, title: "The Book Nobody Was Supposed to Write", pillar: "critical", pillarLabel: "Critical Thinking", historicalPeriod: "Geneva, Switzerland, 1818 CE", historicalContext: "Mary Shelley wrote Frankenstein at 18. The central question — who is responsible for what you create? — is still unresolved.", eraBackground: "treehouse", accentColor: "#B85C2C" },
  { id: 69, era: 4, title: "Two Engineers, One Bridge", pillar: "communication", pillarLabel: "Communication & Articulation", historicalPeriod: "USA, 1870s CE", historicalContext: "The construction of the Brooklyn Bridge (1869-1883) involved multiple catastrophic disagreements between engineers about design approaches.", eraBackground: "mountain", accentColor: "#B85C2C" },
  { id: 70, era: 4, title: "The Shorter Shift", pillar: "resilience", pillarLabel: "Resilience & Character", historicalPeriod: "USA/Europe, 1880s CE", historicalContext: "The 8-hour workday movement grew from the documented health consequences of 14-16 hour factory days.", eraBackground: "workshop", accentColor: "#B85C2C" },
  { id: 71, era: 4, title: "What the Patent Protected", pillar: "critical", pillarLabel: "Critical Thinking", historicalPeriod: "USA, 1870-1880 CE", historicalContext: "Alexander Graham Bell filed his telephone patent hours before Elisha Gray filed a similar patent in 1876. The subsequent legal battles (over 600 lawsuits) shaped patent law for a century.", eraBackground: "workshop", accentColor: "#B85C2C" },
  { id: 72, era: 4, title: "The Machine That Took the Job", pillar: "resilience", pillarLabel: "Resilience & Character", historicalPeriod: "England, 1780s CE", historicalContext: "The spinning jenny eliminated approximately 800,000 hand-spinning jobs in Britain within two generations.", eraBackground: "workshop", accentColor: "#B85C2C" },
  { id: 73, era: 4, title: "The Argument That Changed the Design", pillar: "communication", pillarLabel: "Communication & Articulation", historicalPeriod: "USA, 1883 CE", historicalContext: "Washington Roebling's wife Emily managed construction of the Brooklyn Bridge for 11 years and repeatedly argued against design decisions made by engineers who outranked her. She was consistently correct.", eraBackground: "workshop", accentColor: "#B85C2C" },
  { id: 74, era: 4, title: "The Untested Track", pillar: "creativity", pillarLabel: "Creativity & Vision", historicalPeriod: "England, 1830 CE", historicalContext: "The opening of the Liverpool and Manchester Railway involved solving engineering problems that had never been encountered before.", eraBackground: "workshop", accentColor: "#B85C2C" },
  { id: 75, era: 4, title: "What She Built in Secret", pillar: "resilience", pillarLabel: "Resilience & Character", historicalPeriod: "USA, 1843-1856 CE", historicalContext: "Ellen Eglin invented a clothes wringer that was sold to a manufacturer for $18, citing that 'white ladies would not buy the wringer' if they knew a Black woman had invented it.", eraBackground: "treehouse", accentColor: "#B85C2C" },
  { id: 76, era: 4, title: "The First Prototype", pillar: "learning", pillarLabel: "Learning How to Learn", historicalPeriod: "Kitty Hawk, USA, 1900-1903 CE", historicalContext: "The Wright Brothers built and tested over 200 aircraft designs before the 1903 Flyer. They made and documented every failure.", eraBackground: "workshop", accentColor: "#B85C2C" },
  { id: 77, era: 4, title: "The Question at the End of the Line", pillar: "critical", pillarLabel: "Critical Thinking", historicalPeriod: "USA/Europe, 1890s CE", historicalContext: "Alfred Nobel invented dynamite in 1867 intending it for mining and construction. When he read his own premature obituary — 'The merchant of death is dead' — he established the Nobel Prizes.", eraBackground: "mountain", accentColor: "#B85C2C" },
  { id: 78, era: 4, title: "Two Factories, One Town", pillar: "communication", pillarLabel: "Communication & Articulation", historicalPeriod: "England, 1845 CE", historicalContext: "Friedrich Engels' The Condition of the Working Class in England (1845) was the first systematic documentation of industrial poverty — using observation, statistics, and testimony.", eraBackground: "workshop", accentColor: "#B85C2C" },
  { id: 79, era: 4, title: "The Night Shift", pillar: "resilience", pillarLabel: "Resilience & Character", historicalPeriod: "Florence, Italy, 1854-1856 CE", historicalContext: "Florence Nightingale invented statistical infographics to demonstrate that most Crimean War casualties died from preventable disease, not wounds.", eraBackground: "treehouse", accentColor: "#B85C2C" },
  { id: 80, era: 4, title: "What Remains", pillar: "learning", pillarLabel: "Learning How to Learn", historicalPeriod: "Global, 1800-1900 CE", historicalContext: "The Industrial Revolution transformed the world in one century. It also produced consequences — inequality, environmental damage, displacement — that took another century to name.", eraBackground: "mountain", accentColor: "#B85C2C" },
]

// ============================================================
// ERA 5 — SPACE AGE & BEYOND (Levels 81-100)
// ============================================================
export const ERA5_LEVELS: Partial<Lesson>[] = [
  { id: 81, era: 5, title: "What Katherine Knew", pillar: "learning", pillarLabel: "Learning How to Learn", historicalPeriod: "Houston, USA, 1962 CE", historicalContext: "Katherine Johnson calculated trajectories for Alan Shepard's first American spaceflight. John Glenn refused to fly unless she personally verified the computer's calculations. She found an error.", eraBackground: "space", accentColor: "#5B6FA8" },
  { id: 82, era: 5, title: "The Message He Left Behind", pillar: "communication", pillarLabel: "Communication & Articulation", historicalPeriod: "USSR, April 1961 CE", historicalContext: "Before launching into space, Yuri Gagarin wrote a letter to his wife to be delivered if he didn't return. He survived. The letter was opened only after his death in a 1968 plane crash.", eraBackground: "space", accentColor: "#5B6FA8" },
  { id: 83, era: 5, title: "First, But Not Alone", pillar: "resilience", pillarLabel: "Resilience & Character", historicalPeriod: "USA, 1983 CE", historicalContext: "Sally Ride was selected as the first American woman in space knowing that every action, word, and decision she made would be interpreted as representing all women in science.", eraBackground: "space", accentColor: "#5B6FA8" },
  { id: 84, era: 5, title: "The Signal from Nowhere", pillar: "critical", pillarLabel: "Critical Thinking", historicalPeriod: "Ohio, USA, August 15, 1977 CE", historicalContext: "The Wow! Signal — a strong narrowband radio signal detected at the Big Ear telescope — lasted 72 seconds and has never been detected again. It remains unexplained.", eraBackground: "space", accentColor: "#5B6FA8" },
  { id: 85, era: 5, title: "The Web Nobody Owned", pillar: "creativity", pillarLabel: "Creativity & Vision", historicalPeriod: "Geneva, Switzerland, 1989-1991 CE", historicalContext: "Tim Berners-Lee invented the World Wide Web while working at CERN in 1989. He deliberately chose not to patent it, making it freely available.", eraBackground: "workshop", accentColor: "#5B6FA8" },
  { id: 86, era: 5, title: "The Number That Changed", pillar: "learning", pillarLabel: "Learning How to Learn", historicalPeriod: "Global, 1988-present CE", historicalContext: "The IPCC has revised its climate projections multiple times as new data arrived — sometimes upward, occasionally downward. The willingness to revise rather than defend previous projections is what makes the science trustworthy.", eraBackground: "space", accentColor: "#5B6FA8" },
  { id: 87, era: 5, title: "The Team That Disagreed", pillar: "communication", pillarLabel: "Communication & Articulation", historicalPeriod: "Houston, USA, April 1970 CE", historicalContext: "Apollo 13's rescue — an oxygen tank explosion 200,000 miles from Earth — was solved in 87 hours by a team that disagreed constantly about the best approach.", eraBackground: "space", accentColor: "#5B6FA8" },
  { id: 88, era: 5, title: "What the Data Showed", pillar: "critical", pillarLabel: "Critical Thinking", historicalPeriod: "Florida, USA, January 28, 1986 CE", historicalContext: "The night before the Challenger launch, engineers presented data showing O-ring failures at low temperatures. NASA managers asked them to 'take off their engineering hat and put on their management hat.' Seven astronauts died.", eraBackground: "space", accentColor: "#5B6FA8" },
  { id: 89, era: 5, title: "Two Countries, One Station", pillar: "resilience", pillarLabel: "Resilience & Character", historicalPeriod: "International Space Station, 1998-present CE", historicalContext: "The ISS has been continuously occupied since November 2000, housing astronauts from the US, Russia, Europe, Japan, and Canada — including during periods of severe political conflict between their governments.", eraBackground: "space", accentColor: "#5B6FA8" },
  { id: 90, era: 5, title: "The Long Study", pillar: "learning", pillarLabel: "Learning How to Learn", historicalPeriod: "Global, 1950s-present CE", historicalContext: "The Mauna Loa CO2 record — the longest continuous atmospheric measurement in history — began in 1958. Short-term data showed noise; long-term data showed a pattern that changed everything.", eraBackground: "mountain", accentColor: "#5B6FA8" },
  { id: 91, era: 5, title: "The Algorithm and the Judge", pillar: "critical", pillarLabel: "Critical Thinking", historicalPeriod: "USA, 2010s-present CE", historicalContext: "COMPAS — a risk assessment algorithm used in US sentencing decisions — was found to incorrectly flag Black defendants as higher risk at roughly twice the rate of white defendants.", eraBackground: "workshop", accentColor: "#5B6FA8" },
  { id: 92, era: 5, title: "What She Left in the Capsule", pillar: "resilience", pillarLabel: "Resilience & Character", historicalPeriod: "ISS, 2019 CE", historicalContext: "Christina Koch completed the longest spaceflight by a woman (328 days) in 2019-2020 and participated in the first all-female spacewalk.", eraBackground: "space", accentColor: "#5B6FA8" },
  { id: 93, era: 5, title: "The Problem Everyone Agreed On", pillar: "communication", pillarLabel: "Communication & Articulation", historicalPeriod: "Paris, France, 2015 CE", historicalContext: "The Paris Agreement (2015) was signed by 196 parties — simultaneously the most universally accepted and least enforceable climate agreement.", eraBackground: "mountain", accentColor: "#5B6FA8" },
  { id: 94, era: 5, title: "The Last Forest", pillar: "creativity", pillarLabel: "Creativity & Vision", historicalPeriod: "Global, 2020s CE", historicalContext: "Conservation engineering — designing ecosystems, not just protecting them — requires solving problems that have no historical precedent.", eraBackground: "safari", accentColor: "#5B6FA8" },
  { id: 95, era: 5, title: "The First Message to Another World", pillar: "communication", pillarLabel: "Communication & Articulation", historicalPeriod: "Global, 1974 CE", historicalContext: "The Arecibo Message (1974) was the first deliberate radio transmission intended for extraterrestrial intelligence. It assumed any civilization would understand binary and have the same visual processing as humans.", eraBackground: "space", accentColor: "#5B6FA8" },
  { id: 96, era: 5, title: "What We Brought Back", pillar: "learning", pillarLabel: "Learning How to Learn", historicalPeriod: "Moon/Earth, 1969-2020 CE", historicalContext: "The 382kg of lunar samples brought back by Apollo missions have been re-analyzed with new techniques every decade, yielding new findings each time — including, in 2020, the first confirmed water molecules.", eraBackground: "space", accentColor: "#5B6FA8" },
  { id: 97, era: 5, title: "The Invisible System", pillar: "critical", pillarLabel: "Critical Thinking", historicalPeriod: "Global, 1970s-present CE", historicalContext: "Systems thinking — the study of how components of a system interact — emerged as a formal discipline in the 1970s. Its central insight: changing one part of a system changes other parts in ways that are often non-obvious.", eraBackground: "workshop", accentColor: "#5B6FA8" },
  { id: 98, era: 5, title: "The Cost of Speed", pillar: "resilience", pillarLabel: "Resilience & Character", historicalPeriod: "Global, 2000s-present CE", historicalContext: "'Move fast and break things' was a genuine engineering philosophy before it became a cultural joke. The things that got broken included privacy norms, democratic information systems, and mental health.", eraBackground: "workshop", accentColor: "#5B6FA8" },
  { id: 99, era: 5, title: "What the Children Will Inherit", pillar: "creativity", pillarLabel: "Creativity & Vision", historicalPeriod: "Global, present CE", historicalContext: "Design for future generations is one of the most difficult engineering and ethical challenges. The people most affected by decisions made today — children not yet born — have no voice in making them.", eraBackground: "galileo-path", accentColor: "#5B6FA8" },
  { id: 100, era: 5, title: "The Next Question", pillar: "learning", pillarLabel: "Learning How to Learn", historicalPeriod: "Wherever you are, right now", historicalContext: "Level 100 is not an ending. It is a recognition that the skill built across 100 levels — asking a better question, following it honestly, sitting with the answer and asking another — does not stop at the edge of a curriculum.", eraBackground: "galileo-path", accentColor: "#5B6FA8" },
]

// ============================================================
// LOOKUP
// ============================================================

const ERA1_LEVELS: Partial<Lesson>[] = [
  LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4, LEVEL_5,
  LEVEL_6, LEVEL_7, LEVEL_8, LEVEL_9, LEVEL_10,
  LEVEL_11, LEVEL_12, LEVEL_13, LEVEL_14, LEVEL_15,
  LEVEL_16, LEVEL_17, LEVEL_18, LEVEL_19, LEVEL_20,
]

export const ALL_LEVELS: Partial<Lesson>[] = [
  ...ERA1_LEVELS,
  ...ERA2_LEVELS,
  ...ERA3_LEVELS,
  ...ERA4_LEVELS,
  ...ERA5_LEVELS,
]

export function getLevelById(id: number): Partial<Lesson> | undefined {
  return ALL_LEVELS.find(l => l.id === id)
}

export function getLevelsForEra(era: number): Partial<Lesson>[] {
  return ALL_LEVELS.filter(l => l.era === era)
}
