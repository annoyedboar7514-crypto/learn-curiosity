import type { Lesson } from "../lesson.types";

const lesson: Lesson = {
  id: "explorer-3-4-rc-the-raft-that-fell-apart",
  title: "The Raft That Fell Apart",

  pillar: "resilience-character",
  secondaryPillars: ["learning-how-to-learn"],
  gradeBand: "3-4",
  archetype: "explorer",

  moralCore:
    "Failure at something you worked hard for is painful — but the question " +
    "that matters isn't 'did I succeed?' It's 'what do I do with this now?'",

  openingNarrative: `You are Explorer Mira, and you've spent three days building a raft.

Not a toy — a real one, made from branches you dragged from the forest edge,
lashed together with rope you saved up for months. You've been planning this
since last spring: the small island in the middle of the river, the one nobody
has ever explored. Today is the day.

You lower the raft into the water. It floats. Your heart lifts.

Two strokes of the paddle later, one side drops. Then the whole thing tilts.
Then it's just sticks floating separately in the shallows, and you're standing
in knee-deep water, watching three days of work drift downstream.

Your friend Tomás is on the bank. "Just swim across," he says. "It's not that
deep."

Your other friend, Lena, shrugs. "Maybe the island isn't worth it. We can do
something else."

You look at the scattered sticks. You look at the island.`,

  decisionPrompt:
    "What do you do next?",

  consequences: [
    {
      choiceType: "courageous",
      narrative: `You wade out and gather the sticks before they float too far.

Not to rebuild right now — just to look. You turn each piece over in your hands,
trying to understand. One lashing is loose. No — not just loose. You tied it the
wrong direction. The tension pulled it open under the weight.

"I see it," you say out loud, mostly to yourself.

You don't reach the island today. But you spend the afternoon sketching the fix
in your notebook. Two weeks later, you cross. The island is exactly what you
imagined — and the raft holds.`,
    },
    {
      choiceType: "avoidant",
      narrative: `You look at the island one more time, then turn away.

"Let's just do something else," you say.

Tomás and Lena are already moving on. You follow. The afternoon is fine — you
find a good climbing tree, eat your lunch — but you keep thinking about the
sticks floating in the current. Not sadly, exactly. More like a question you
left unanswered.

On the walk home, you're quieter than usual. You keep wondering: was there
something wrong with the raft that I could have figured out?`,
    },
    {
      choiceType: "impulsive",
      narrative: `You hand Tomás the paddle and swim across.

The water is cold and faster than it looks. You make it, but barely. The island
is smaller than you thought. You stand on it for about four minutes before
swimming back, teeth chattering.

"Worth it?" Lena asks.

"Sure," you say. But you didn't explore it — you just stood on it. The raft
was supposed to let you bring supplies, stay a while, actually discover things.
Swimming got you to the island. It didn't get you what the island was for.`,
    },
    {
      choiceType: "creative",
      narrative: `You gather the sticks. You sit down on the bank.

You don't try to fix the original raft — you start asking a different question:
what if the problem wasn't the lashing, but the shape? You start sketching in
the dirt. Two parallel logs, instead of a bundle. A platform that sits lower
in the water so it's harder to tip.

"That's... actually different," Tomás says, looking over your shoulder.

It takes another week to build. It works on the first try. Later, Lena asks
you if you were upset about the first raft collapsing. You think about it
honestly. "A little," you say. "But it was the most useful thing that happened."`,
    },
  ],

  reflectionQuestions: [
    {
      question:
        "When the raft fell apart, what did you feel — and do you think that feeling made sense given how hard you'd worked?",
      scaffoldedFollowUp:
        "Was there a difference between how you felt in that first moment and what you thought about it after you had some time?",
    },
    {
      question:
        "What's the difference between giving up on a goal and giving up on one approach to a goal?",
      scaffoldedFollowUp:
        "In the story, did Mira give up on the island — or did she give up on the raft? Are those the same thing?",
    },
    {
      question:
        "If you worked really hard on something and it failed in front of other people, what would be the hardest part — the failing, or the people seeing it?",
      scaffoldedFollowUp:
        "Why do you think it might feel different when someone else is watching?",
    },
    {
      question:
        "What do you think 'starting over' actually means? Does it mean forgetting everything you learned the first time?",
      scaffoldedFollowUp:
        "Can you think of something you're better at now because you failed at it first?",
    },
  ],

  parentSummary:
    "Today's lesson put your child in the middle of a real setback — something " +
    "they worked hard on that failed publicly. The dilemma wasn't about whether " +
    "to feel bad (the story honored that feeling) but about what to do next. The " +
    "reflection questions were designed to separate 'giving up on a goal' from " +
    "'giving up on one approach,' and to explore what it means to learn from " +
    "failure rather than just recover from it. This lesson targets Pillar 2: " +
    "Resilience, Character & Moral Values, with a thread of Pillar 5: Learning " +
    "How to Learn.",
};

export default lesson;
