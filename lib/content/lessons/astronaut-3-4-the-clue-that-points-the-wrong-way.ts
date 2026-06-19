import type { Lesson } from "../lesson.types";

// Same moralCore and reflectionQuestions as the Detective skin.
// The story world, characters, and narrative are reskinned for space exploration.
const lesson: Lesson = {
  id: "astronaut-3-4-ct-clue-vs-proof",
  title: "The Clue That Points the Wrong Way",

  pillar: "critical-thinking",
  secondaryPillars: ["resilience-character"],
  gradeBand: "3-4",
  archetype: "astronaut",

  moralCore:
    "Evidence can point in a direction without being conclusive. Fair " +
    "reasoning means asking more questions before drawing a conclusion, " +
    "even when the first clue feels obvious.",

  openingNarrative: `You are Navigator Mira, the best problem-solver on Space Station Orion.

This morning, someone took the signal crystal from the navigation bay. Without it,
the station can't plot its route home — and the crew needs to leave by sundown.

You've been investigating all morning. You check the storage lockers, the lab,
the observation deck. Then you find it: a faint smear of red crystal dust on
the glove of your best friend Tomás's spacesuit, hanging in his bunk area.

You go to Tomás. "Do you know how this got here?" you ask, pointing to the dust.

He looks genuinely surprised. "I have no idea. I didn't take it. You have to
believe me."

You look at the dust again. It really does look like it could be from the signal
crystal. But Tomás is your best friend — three years on the crew together, and
he has never lied to you once.

Across the bay, your commander looks up. "Has anyone found anything?"`,

  decisionPrompt:
    "What do you do? Do you tell the commander about the crystal dust on " +
    "Tomás's glove right now — or do you stay quiet and keep investigating first?",

  consequences: [
    {
      choiceType: "courageous",
      narrative: `You raise your hand. "I found something, but I'm not sure what it means yet,"
you say carefully. You show the commander the dust on the glove and explain
that it could be from the crystal — but Tomás says he has no idea how it got there.

The commander nods. "Smart reporting, Navigator. You shared what you found
*and* what you don't know. Let's keep looking."

Twenty minutes later, you find the real answer: the dust came from a cracked
red lens in Tomás's personal scanner — something that leaked when he dropped
it yesterday. The missing signal crystal turns out to be behind the navigation
console, where it slipped off the shelf during a small shudder in the hull.

Tomás was not involved. But your careful, honest report helped the crew find
the truth before the departure window closed.`,
    },
    {
      choiceType: "avoidant",
      narrative: `You decide to stay quiet. You don't want to get Tomás in trouble over
something you're not even sure about. It wouldn't be fair.

But the investigation stalls. No one finds the crystal. The departure window
gets closer.

Later that evening, floating alone in the observation bay, you keep thinking
about the dust on the glove. Would it have helped if you had said something —
even with "I'm not certain about this"? You'll never quite know. The question
stays with you as the station drifts.`,
    },
    {
      choiceType: "impulsive",
      narrative: `"It's Tomás!" you announce to the whole crew. "There's red crystal dust
right on his glove — I think he took the signal crystal!"

Every head in the bay turns. Tomás goes very still. "I didn't do it," he says
quietly, not looking up.

Later, you find out you were wrong. The dust was from a cracked lens in his
scanner. The signal crystal was behind the navigation console the whole time.

Tomás isn't angry — just hurt. "You didn't even ask me any more questions
first," he says. "I thought investigators were supposed to find the truth, not
just guess."

You think about that for a long time.`,
    },
    {
      choiceType: "creative",
      narrative: `You don't say anything yet. Instead, you go back to Tomás.
"Can I look at your scanner for a second? I want to check something."

He hands it over. Sure enough — a cracked red lens on the inside, leaking
tiny particles of dust. The same color as the signal crystal.

"I think I know where the dust came from," you say. He looks relieved.

Now you have something real. You go to the commander: "I found a clue that
pointed at Tomás, so I investigated it before saying anything. It turned out
to be a broken lens in his scanner — not the crystal."

The commander raises an eyebrow. "You checked the clue before you reported it.
That's exactly what a careful navigator does."`,
    },
  ],

  reflectionQuestions: [
    {
      question:
        "When you first saw the crystal dust on Tomás's glove, what did your brain immediately think — and do you think that first thought was definitely right?",
      scaffoldedFollowUp:
        "What are two or three other things the dust could have come from, besides the missing signal crystal?",
    },
    {
      question:
        "What's the difference between a clue and proof? Can you put it in your own words?",
      scaffoldedFollowUp:
        "If a clue points at someone, does that mean they definitely did it? What else would you need to be sure?",
    },
    {
      question:
        "Tomás told you he didn't take the crystal. How did you weigh that — his word on one side, the clue on the other?",
      scaffoldedFollowUp:
        "What would have made you more certain he was telling the truth? What would have made you more certain the clue was right?",
    },
    {
      question:
        "In the story, finding the right answer mattered — but so did how you treated Tomás along the way. Can both of those things be important at the same time?",
      scaffoldedFollowUp:
        "Is it possible to find the truth and still hurt someone in the process? What would you want to avoid doing?",
    },
  ],

  parentSummary:
    "Today's lesson put your child in a situation where a clue pointed at " +
    "someone they trusted, but the evidence was incomplete. The goal was to " +
    "practice slowing down the first instinct, asking follow-up questions before " +
    "drawing a conclusion, and understanding that a clue is not the same as proof. " +
    "This lesson targets Pillar 1: Critical Thinking & Philosophical Reasoning, " +
    "with a secondary thread of Pillar 2: Resilience, Character & Moral Values.",
};

export default lesson;
