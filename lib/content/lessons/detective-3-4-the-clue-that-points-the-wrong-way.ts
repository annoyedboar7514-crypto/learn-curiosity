import type { Lesson } from "../lesson.types";

const lesson: Lesson = {
  id: "detective-3-4-ct-clue-vs-proof",
  title: "The Clue That Points the Wrong Way",

  pillar: "critical-thinking",
  secondaryPillars: ["resilience-character"],
  gradeBand: "3-4",
  archetype: "detective",

  moralCore:
    "Evidence can point in a direction without being conclusive. Fair " +
    "reasoning means asking more questions before drawing a conclusion, " +
    "even when the first clue feels obvious.",

  openingNarrative: `You are Detective Mira, the best puzzle-solver in class.

This morning, someone took the red paint from the art supply cabinet. Without it,
the whole class can't finish their mural for the school hallway — and the
unveiling is tomorrow.

You've been investigating all morning. You check the cabinet, the sink, the
tables. Then you find it: a small red smudge on the corner of your best friend
Tomás's notebook.

You go to Tomás. "Do you know how this got here?" you ask, pointing to the smudge.

He looks genuinely surprised. "I have no idea. I didn't take the paint. You have
to believe me."

You look at the smudge again. It really does look like it could be red paint.
But Tomás is your best friend, and he has never lied to you — not once, in three
years of friendship.

Across the room, your teacher looks up. "Has anyone found anything?"`,

  decisionPrompt:
    "What do you do? Do you tell the teacher about the smudge on Tomás's " +
    "notebook right now — or do you stay quiet and keep looking first?",

  consequences: [
    {
      choiceType: "courageous",
      narrative: `You raise your hand. "I found something, but I'm not sure it means anything,"
you say carefully. You show the teacher the smudge and explain that it could
be from the missing paint — but Tomás says he doesn't know where it came from.

The teacher nods. "That's exactly how a detective should report a clue. You
shared what you found *and* what you don't know yet. Let's keep looking."

Ten minutes later, you find the real answer: the smudge came from a leaky red
marker in Tomás's bag — and the missing paint turns out to be sitting in the
wrong cabinet, where another student accidentally put it away.

Tomás wasn't guilty. Your careful, honest report helped everyone find the truth
faster — without blaming anyone.`,
    },
    {
      choiceType: "avoidant",
      narrative: `You decide to stay quiet. You don't want to get Tomás in trouble over
something you're not even sure about. It wouldn't be fair.

But the investigation stalls. No one finds the paint. By the end of the day,
the teacher says the mural might have to be cancelled.

Later, walking home, you keep thinking about the smudge. Would it have helped
if you had said something — even with "I'm not sure about this"? You'll never
quite know. The question stays with you.`,
    },
    {
      choiceType: "impulsive",
      narrative: `"It's Tomás!" you announce. "There's a red smudge right on his notebook —
I think he took the paint!"

Every head in the room turns. Tomás goes still. "I didn't do it," he says
quietly, not looking up.

Later, you find out you were wrong. The smudge was from a leaky marker.
The real paint was in the wrong cabinet the whole time.

Tomás isn't angry — just hurt. "You didn't even ask me more questions," he
says. "I thought detectives were supposed to find the truth, not just guess."

You think about that for a long time.`,
    },
    {
      choiceType: "creative",
      narrative: `You don't say anything yet. Instead, you go back to Tomás.
"Can I look in your bag for a second? I want to check something."

He shrugs and hands it over. At the bottom, you find a red marker with a
cracked cap — dried ink on the outside, smeared from bouncing around all morning.

"I think that's where your smudge came from," you say. He looks relieved.

Now you have something real. You go to the teacher: "I found a clue that
pointed at Tomás, so I investigated it first before saying anything. It turned
out to be a leaky marker — not the paint."

The teacher raises her eyebrows. "You checked the clue before you reported it.
That's exactly what a real detective does."`,
    },
  ],

  reflectionQuestions: [
    {
      question:
        "When you first saw the red smudge, what did your brain immediately think — and do you think that first thought was definitely right?",
      scaffoldedFollowUp:
        "What are two or three other things the smudge could have come from, besides the missing paint?",
    },
    {
      question:
        "What's the difference between a clue and proof? Can you put it in your own words?",
      scaffoldedFollowUp:
        "If a clue points at someone, does that mean they definitely did it? What else would you need to be sure?",
    },
    {
      question:
        "Tomás told you he didn't take the paint. How did you weigh that — his word on one side, the clue on the other?",
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
    "practice slowing down the first instinct ('it must be them'), asking " +
    "follow-up questions before drawing a conclusion, and understanding that " +
    "a clue is not the same as proof. The reflection questions were designed " +
    "to help your child articulate the difference in their own words — not to " +
    "arrive at a pre-set 'correct' answer. This lesson targets Pillar 1: " +
    "Critical Thinking & Philosophical Reasoning, with a secondary thread of " +
    "Pillar 2: Resilience, Character & Moral Values.",
};

export default lesson;
