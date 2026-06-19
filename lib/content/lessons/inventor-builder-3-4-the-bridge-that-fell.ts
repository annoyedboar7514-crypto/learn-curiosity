import type { Lesson } from "../lesson.types";

const lesson: Lesson = {
  id: "inventor-builder-3-4-lhl-the-bridge-that-fell",
  title: "The Bridge That Fell",

  pillar: "learning-how-to-learn",
  secondaryPillars: ["resilience-character", "critical-thinking"],
  gradeBand: "3-4",
  archetype: "inventor-builder",

  moralCore:
    "Understanding WHY something failed is more valuable than the thing itself — " +
    "a mistake you truly understand is the fastest path forward, and a mistake " +
    "you ignore will find you again.",

  openingNarrative: `You are Inventor Mira, and you've been building this bridge for two weeks.

It's for the school science fair — a model bridge made of balsa wood and glue
that has to hold as much weight as possible. You've been proud of it. You stayed
up late three nights in a row getting the angles exactly right.

Now you're standing at the front of the classroom. The whole class is watching.
The judge places the first test weight on the center of the bridge.

For two seconds, it holds.

Then — with a sound like a dry twig breaking — the center collapses. The bridge
folds in half. The weight clatters to the table.

The room goes quiet.

Your teacher walks over. "Mira," she says quietly, so only you can hear. "The
judging isn't for twenty minutes. You have time to look at what happened, if you
want to."

You look at the collapsed bridge in front of you. You look at the class.`,

  decisionPrompt:
    "What do you do with those twenty minutes?",

  consequences: [
    {
      choiceType: "courageous",
      narrative: `You pick up the broken bridge and turn it over carefully.

The class has moved on to other projects. You stop caring about that.

You find it in about four minutes: one of the main support joints was glued at a
slightly wrong angle. Not much — maybe five degrees. But under weight, that
small angle became a lever that worked against everything else.

When the judge comes back, you explain what you found. You draw it on a piece
of paper. You describe what you'd change.

The judge writes something down. "You didn't win for bridge strength," she tells
you afterward. "But that analysis was genuinely impressive."

You go home that night and build a better bridge.`,
    },
    {
      choiceType: "avoidant",
      narrative: `You push the collapsed bridge to the side of the table and stand very still.

You don't want to touch it. You don't want to look at it. You don't want anyone
to look at you while you're looking at it.

The twenty minutes pass slowly.

When the judging happens, you have nothing new to say. Your bridge is still
broken and you don't know why. The teacher asks how you think it could be
improved. You say you're not sure.

On the bus home, you keep thinking about the sound it made when it collapsed.
Not the embarrassment — just the sound, like something giving up.

You wonder what would have happened if you'd looked.`,
    },
    {
      choiceType: "impulsive",
      narrative: `You try to fix it.

You grab the glue from your bag and start pressing the pieces back together,
fast. The class looks over. You don't look up.

The glue doesn't have time to set. When the judge comes, you try to place the
test weight again. The bridge collapses in the same place — a little faster this time.

"What happened here?" the judge asks.

"I tried to fix it," you say.

"Did you figure out what was wrong first?"

You didn't. You were too busy trying to fix it to understand it.

The judge nods slowly. "That's the part you'd want to do first, next time."`,
    },
    {
      choiceType: "creative",
      narrative: `You don't try to fix the bridge. You get out your notebook instead.

You draw a sketch of the bridge before it fell — from memory. Then you draw
where the collapse happened. Then you start asking: why there? Why not the edges?

You write down three possible reasons. Then you try to rule them out one by one.
After fifteen minutes, you have one that fits: the design put all the tension
in the center joint, which was also the weakest one.

"You didn't rebuild it," the teacher says when she comes by.

"I figured out what was wrong instead," you say. "I thought that was more
useful."

She reads what you wrote. "It is," she says. "Significantly."`,
    },
  ],

  reflectionQuestions: [
    {
      question:
        "When the bridge collapsed in front of everyone, what do you think would be harder — the failure itself, or the people watching?",
      scaffoldedFollowUp:
        "If nobody had been in the room, would you have reacted differently? What does that tell you?",
    },
    {
      question:
        "What's the difference between fixing a mistake and understanding a mistake — and why does the order matter?",
      scaffoldedFollowUp:
        "In the story, what happened when Mira tried to fix it before understanding it?",
    },
    {
      question:
        "Mira spent two weeks building something that failed in two seconds. Was those two weeks wasted?",
      scaffoldedFollowUp:
        "What did she know after the failure that she didn't know before it?",
    },
    {
      question:
        "Have you ever learned more from something going wrong than from something going right?",
      scaffoldedFollowUp:
        "What made it possible to learn from it — and what would have made it harder to learn from it?",
    },
  ],

  parentSummary:
    "Today's lesson placed your child in the most exposed version of failure: " +
    "something they worked on for weeks collapsed publicly. The dilemma wasn't " +
    "just about resilience but about what to do cognitively in those twenty " +
    "minutes — ignore the failure, rush to fix it without understanding it, or " +
    "genuinely investigate why it happened. The reflection questions dig into the " +
    "difference between emotional recovery from failure and intellectual engagement " +
    "with it, which is the core of metacognition. This lesson targets Pillar 5: " +
    "Learning How to Learn (Metacognition & Systems Thinking), with threads of " +
    "Pillar 2: Resilience and Pillar 1: Critical Thinking.",
};

export default lesson;
