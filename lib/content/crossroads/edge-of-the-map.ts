// Crossroads seed story — "The Edge of the Map" (Magellan, 1520).
// Concept: risk vs. reward. Not a no-win story.
// TODO(editorial): all narration below is a working draft for Dylan's pass.
// True path = what history records: enter the strait → press across the
// Pacific → make landfall in the islands (where Magellan himself is lost;
// the Victoria completes the circle under Elcano). A triumph inside a loss.

import type { CrossroadsStory } from "./schema";

export const EDGE_OF_THE_MAP: CrossroadsStory = {
  id: "edge-of-the-map",
  era: 2,
  title: "The Edge of the Map",
  pillarTag: "critical",
  conceptTag: "risk-reward",
  noWin: false,
  ageBands: ["k2", "grade34", "grade56"],
  landmarkAfterLevel: 20,
  startNodeId: "intro",
  truePathNodeIds: ["intro", "d1", "strait", "d2", "ocean", "d3", "landfall", "end-world"],
  whatReallyHappened:
    "This really happened in 1520. Magellan's fleet entered the wild strait at the tip of South America, crossed an ocean so calm and so endless he named it 'Pacific,' and made landfall in the islands — where Magellan himself was killed. One ship, the Victoria, kept going and became the first to sail all the way around the world. The captain never finished the journey. His question did.",
  nodes: [
    {
      id: "intro",
      type: "scene",
      panelEmoji: "⛵",
      nextNodeId: "d1",
      narrationByBand: {
        k2: "Five little ships sail to the very bottom of the map. Past here, nobody has ever drawn anything. Captain Magellan wants to find a secret water door through the land — but the sea here is cold and angry.",
        grade34: "Five ships reach the bottom of South America — the edge of every map ever drawn. Captain Magellan believes there's a hidden passage through the land to another ocean. The crew isn't so sure. The water is freezing, the wind screams, and winter is coming.",
        grade56: "1520. Five ships, three hundred men, at the last inked line of every chart in existence. Magellan is certain a strait cuts through the continent to an unknown ocean. His captains are certain of something else: that this far south, in this season, certainty gets people killed.",
      },
    },
    {
      id: "d1",
      type: "decision",
      panelEmoji: "🌊",
      narrationByBand: {
        k2: "The storm door is here. Do the ships go in now, or wait for the sun to come back?",
        grade34: "The mouth of the passage is ahead — dark, narrow, and stormy. Magellan must decide now.",
        grade56: "The strait's mouth opens ahead — uncharted, storm-fed, and narrowing into darkness. Every day spent waiting burns food. Every mile inside could be a dead end.",
      },
      choices: [
        {
          id: "enter",
          label: "Sail into the strait now",
          stakesLine: "You might find the way through before the food runs out — or the storms might smash the ships in a place no rescue will ever come.",
          nextNodeId: "strait",
          isTruePath: true,
        },
        {
          id: "wait",
          label: "Camp and wait for spring",
          stakesLine: "Waiting is safer from storms — but the food shrinks every single day, and a bored, hungry crew starts asking who's really in charge.",
          nextNodeId: "camp",
          isTruePath: false,
        },
      ],
    },
    {
      id: "strait",
      type: "scene",
      panelEmoji: "🏔️",
      nextNodeId: "d2",
      consequenceEchoes: [
        {
          triggeredByChoiceId: "enter",
          narrationInsert: "Remember what you said about going now? The storms heard you. One ship turns and runs home in the night — taking a big share of the food with it.",
        },
      ],
      narrationByBand: {
        k2: "Inside the water door it is dark and twisty. The mountains have snow hats. One ship gets scared and sails home. But then — the water opens up. A whole new ocean!",
        grade34: "For 38 days the ships thread a maze of cliffs and freezing channels. One crew mutinies and slips away home in the dark, taking precious supplies. Then the channel opens — and an ocean no European has ever crossed spreads to the horizon.",
        grade56: "Thirty-eight days inside the labyrinth: williwaw winds, false channels, cliffs like closed doors. The San Antonio deserts in the night — with the fleet's largest food stores aboard. And then the walls part. An unmeasured ocean, flat and silver, runs to the edge of the sky.",
      },
    },
    {
      id: "camp",
      type: "scene",
      panelEmoji: "🏕️",
      nextNodeId: "d2",
      narrationByBand: {
        k2: "The ships wait and wait. The food bags get small. Some sailors get grumpy and want to go home. When spring comes, the ships finally go through the water door — but with much less food.",
        grade34: "The fleet winters in a freezing bay. Rations shrink. A mutiny breaks out and has to be faced down. When spring finally comes, they thread the passage — but months of food are already gone.",
        grade56: "The long wait at Port San Julián: rationed bread, frozen rigging, and a mutiny that ends with captains in chains. Spring comes late. The passage, when they finally run it, costs less blood — but the calendar has quietly eaten the stores.",
      },
    },
    {
      id: "d2",
      type: "decision",
      panelEmoji: "🧭",
      narrationByBand: {
        k2: "A new giant ocean! But the food bags are small. Keep going into the big blue, or turn around and go home?",
        grade34: "A brand-new ocean lies ahead — nobody knows how wide. The food is already low. Press on, or turn back with the map half-finished?",
        grade56: "The new ocean has no measured width. It could be days across; it could be months. The stores say weeks. Pressing on bets every life on an unknown number. Turning back trades the discovery of the age for certainty.",
      },
      choices: [
        {
          id: "press",
          label: "Press on across the unknown ocean",
          stakesLine: "If it's small, you make history. If it's huge, you will be very far from land with very little food.",
          nextNodeId: "ocean",
          isTruePath: true,
        },
        {
          id: "turnback",
          label: "Turn back with what you've found",
          stakesLine: "You keep your crew safe and bring home the map of the strait — but someone else will cross that ocean and finish your story.",
          nextNodeId: "retreat",
          isTruePath: false,
        },
      ],
    },
    {
      id: "ocean",
      type: "scene",
      panelEmoji: "🌅",
      nextNodeId: "d3",
      consequenceEchoes: [
        {
          triggeredByChoiceId: "wait",
          narrationInsert: "The winter you waited out is following you now — those months of eaten food would matter more than anyone guessed.",
        },
      ],
      narrationByBand: {
        k2: "The ocean is so big. Days and days and days of just blue. The sailors are very hungry. Where is the land?",
        grade34: "Weeks pass with no land. The ocean is far, far bigger than anyone imagined. The biscuit runs out; the crew is starving and sick. Still — the sea stays gentle, so they name it 'Pacific,' the peaceful one.",
        grade56: "Ninety-eight days. The ocean is not weeks wide — it is a quarter of the planet. Scurvy hollows the crew; they eat leather and sawdust and name the merciless-calm water 'Pacific.' The bet is placed. Now the ocean decides.",
      },
    },
    {
      id: "retreat",
      type: "scene",
      panelEmoji: "↩️",
      nextNodeId: "end-return",
      narrationByBand: {
        k2: "The ships turn around and sail all the way home. Everyone is safe. The new ocean stays a secret behind them.",
        grade34: "The fleet re-threads the strait and limps home. The crew survives. The charts show a passage now — and a blank ocean beyond it, waiting for someone braver or luckier.",
        grade56: "The fleet returns the way it came, alive and unfamous. The strait enters the charts; the ocean beyond stays blank. Within a decade, other sails cross it — carrying someone else's name into the histories.",
      },
    },
    {
      id: "d3",
      type: "decision",
      panelEmoji: "🏝️",
      narrationByBand: {
        k2: "Land! A little island! But you don't know who lives there. Stop for food, or keep sailing past?",
        grade34: "Islands at last — but unknown ones. Stopping means food and water… and meeting people who never asked you to come. Sailing past means more empty ocean on an empty stomach.",
        grade56: "Landfall — inhabited islands, no chart, no shared language. Stopping risks conflict you cannot predict and cannot un-choose. Passing means gambling the last of three hundred lives on more empty blue.",
      },
      choices: [
        {
          id: "island",
          label: "Stop at the islands",
          stakesLine: "Food and fresh water could save everyone — but you don't know how you'll be met, and some meetings can't be taken back.",
          nextNodeId: "landfall",
          isTruePath: true,
        },
        {
          id: "sailon",
          label: "Sail on past",
          stakesLine: "You avoid the unknown meeting — but the crew is starving now, and the next land might be weeks away, or nowhere.",
          nextNodeId: "hunger",
          isTruePath: false,
        },
      ],
    },
    {
      id: "landfall",
      type: "scene",
      panelEmoji: "🤝",
      nextNodeId: "end-world",
      narrationByBand: {
        k2: "The islands share food and water. The sailors get strong again. But in one sad fight, Captain Magellan doesn't make it. His ship keeps sailing without him — all the way around the whole world.",
        grade34: "The islands bring food, water, and recovery — and then, in a battle Magellan chose to join, the captain is killed. His crew sails on without him. One ship, the Victoria, makes it all the way around the world.",
        grade56: "Resupply, recovery — and then Mactan, where Magellan wades into a fight he did not have to pick and does not survive. The expedition outlives its author. The Victoria, leaking and half-crewed, closes the circle around the Earth.",
      },
    },
    {
      id: "hunger",
      type: "scene",
      panelEmoji: "💀",
      nextNodeId: "end-ghost",
      narrationByBand: {
        k2: "The ships keep going, but tummies are empty. It gets very hard. At last they find friendly land — but some sailors were too hungry to make it.",
        grade34: "The fleet sails past salvation. The hunger gets worse than the fear ever was. When land finally comes, weeks later, the ships arrive half-crewed — the ocean quietly kept the rest.",
        grade56: "They pass the islands, and the arithmetic of hunger finishes what the ocean started. Land comes eventually. It always does. The muster rolls, when they're finally read, are the real map of that decision.",
      },
    },
    {
      id: "end-return",
      type: "ending",
      panelEmoji: "🏠",
      narrationByBand: {
        k2: "Home safe! The map has a new water door on it. But the big blue ocean is still a mystery.",
        grade34: "Everyone comes home. The strait bears your charts. The ocean beyond belongs to whoever tries next.",
        grade56: "A safe return: the strait charted, the crew alive, the question unanswered. History remembers the ones who crossed. It rarely argues with the ones who came home.",
      },
      endingSummary: {
        whatWasLost: "The crossing — and the name in the history books that went with it.",
        whatWasGained: "Every sailor's life, and the first true chart of the strait.",
      },
    },
    {
      id: "end-world",
      type: "ending",
      panelEmoji: "🌍",
      narrationByBand: {
        k2: "One little ship goes all the way around the world — the first ever! The captain isn't on it. But his big idea made it home.",
        grade34: "The Victoria completes the first voyage around the world. Magellan never sees it. The idea finishes the journey the man couldn't.",
        grade56: "September 1522: eighteen survivors sail the Victoria into Seville, the first humans to circle the Earth. The captain has been dead a year. The reward was real. So was every one of the risks.",
      },
      endingSummary: {
        whatWasLost: "The captain himself, most of the fleet, and most of the crew.",
        whatWasGained: "The proof the world could be circled — a map no one could ever un-draw.",
      },
    },
    {
      id: "end-ghost",
      type: "ending",
      panelEmoji: "🕯️",
      narrationByBand: {
        k2: "The ships made it very far. The map got bigger. But everyone wishes they had stopped for food at the little island.",
        grade34: "The expedition survives — smaller, quieter, and haunted by one island it sailed past. The map grows anyway. The cost is counted in empty hammocks.",
        grade56: "The map gains an ocean; the fleet loses its margin. Survivors tell the story for the rest of their lives — and every telling returns to the island they didn't stop at.",
      },
      endingSummary: {
        whatWasLost: "The crew members hunger took — a cost chosen at the moment it was avoidable.",
        whatWasGained: "The crossing itself, and a hard lesson about which risks are actually optional.",
      },
    },
  ],
};
