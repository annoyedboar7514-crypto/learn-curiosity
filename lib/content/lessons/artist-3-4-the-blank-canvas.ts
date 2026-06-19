import type { Lesson } from "../lesson.types";

const lesson: Lesson = {
  id: "artist-3-4-cv-the-blank-canvas",
  title: "The Blank Canvas",

  pillar: "creativity-vision",
  secondaryPillars: ["resilience-character"],
  gradeBand: "3-4",
  archetype: "artist",

  moralCore:
    "Creativity often starts with the discomfort of not knowing what to make — " +
    "working through that discomfort, rather than escaping it, is how original " +
    "ideas are actually found.",

  openingNarrative: `You are Artist Mira, and the canvas has been blank for an hour.

The assignment seemed simple: paint whatever you want, as long as it feels true
to you. The art teacher left the room. Everyone else started immediately.

Your friend Tomás is painting a landscape — rolling hills, a bright sky. It's
beautiful. He found a photograph in a book and he's copying it almost exactly.
It looks professional.

You look at your canvas. You've started three times. Three times you've painted
over it. Nothing feels right. Nothing feels like yours.

"Why don't you just copy something?" Tomás says. Not meanly — he just doesn't
understand what's stopping you. "It would look really good. And you'd be done."

He's right that it would look good. You've copied from photos before.

You look at your canvas. Then you look at Tomás's beautiful, finished painting.
Then back at your blank canvas.`,

  decisionPrompt:
    "What does Mira do?",

  consequences: [
    {
      choiceType: "courageous",
      narrative: `You put the brush down and just look at the blank canvas for a while longer.

You're not sure what you're waiting for. It's uncomfortable. A few people glance
at you. You ignore them.

Then, slowly, you paint something small in the corner. Not a landscape. Not
anything pretty. Just the feeling of sitting there not knowing what to paint —
a kind of tangled, unresolved shape. You build from there.

When the teacher comes back, she stops at your painting for a long time. "This
is interesting," she says quietly. "I can feel you in it."

Tomás's landscape is on the wall beside yours. Both paintings are good. But
yours is the only one that couldn't have been made by anyone else.`,
    },
    {
      choiceType: "avoidant",
      narrative: `You find a photograph in the supply drawer — a winter forest, clean and
geometric — and you start copying it carefully.

It comes out well. Better than you expected, honestly. You're technically skilled
and you know it. By the time the teacher returns, you have a finished painting.

She nods at it. "Very nice." She moves on.

You look at it for a moment, then look away. It's beautiful. You feel almost
nothing looking at it. You're not sure if that matters.`,
    },
    {
      choiceType: "impulsive",
      narrative: `You just start painting. Anything. A house, a sun, a tree — the first things
that come to your hand.

It goes quickly. When you're done, it looks like a painting made quickly. Not
bad, not good — just there. Filled in. The canvas isn't blank anymore.

The teacher looks at it briefly. "Good start," she says.

You look at Tomás's landscape and then at yours. Yours is faster, his is better.
You wonder if you should have waited — or if waiting was the problem to begin with.`,
    },
    {
      choiceType: "creative",
      narrative: `You ask yourself: what if the blank canvas is what I paint?

You mix a pale color — barely there — and paint the whole canvas that almost-
white. Then you add one single brushstroke in a different direction. Then you
study it.

It's strange. It doesn't look like a painting of anything. But it looks exactly
like what you were feeling when you couldn't begin.

The teacher takes a long time at your canvas. "What is this?" she asks.

"I'm not completely sure," you say. Which is true.

"Good," she says. "The most honest answer is often that one."`,
    },
  ],

  reflectionQuestions: [
    {
      question:
        "Why do you think the blank canvas was uncomfortable — even though Mira is good at painting and loves it?",
      scaffoldedFollowUp:
        "Is there a difference between being good at something and knowing exactly what to do with it?",
    },
    {
      question:
        "Tomás's painting was beautiful and finished. Mira's took longer and was harder. Does 'better' always mean the same thing in art?",
      scaffoldedFollowUp:
        "What do you think the teacher meant when she said 'I can feel you in it'?",
    },
    {
      question:
        "Have you ever started something creative and felt stuck — and if so, what did you do with that feeling?",
      scaffoldedFollowUp:
        "Did avoiding the feeling make it better, or did it just make it go away faster?",
    },
    {
      question:
        "If copying something leads to a beautiful result and inventing leads to something messy and uncertain, is it always worth choosing the uncertain path?",
      scaffoldedFollowUp:
        "Can you think of a time when copying is actually the right choice — and a time when it isn't?",
    },
  ],

  parentSummary:
    "Today's lesson put your child in front of a creative problem with no single " +
    "right answer — a blank canvas and the discomfort of not knowing what to make. " +
    "The dilemma was between taking the safe, technically accomplished path (copying " +
    "something beautiful) and staying with the discomfort long enough to find " +
    "something original. The reflection questions explore what creativity actually " +
    "requires versus what it looks like from the outside, and when the uncertain " +
    "path is worth choosing. This lesson targets Pillar 3: Creativity & Vision " +
    "(Imagination + Problem Framing), with a thread of Pillar 2: Resilience.",
};

export default lesson;
