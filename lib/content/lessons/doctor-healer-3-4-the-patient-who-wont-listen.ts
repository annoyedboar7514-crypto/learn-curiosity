import type { Lesson } from "../lesson.types";

const lesson: Lesson = {
  id: "doctor-healer-3-4-cp-the-patient-who-wont-listen",
  title: "The Patient Who Won't Listen",

  pillar: "communication-persuasion",
  secondaryPillars: ["resilience-character"],
  gradeBand: "3-4",
  archetype: "doctor-healer",

  moralCore:
    "Persuading someone isn't about being louder or more insistent — it's about " +
    "understanding why they're resisting, and meeting them there instead of " +
    "pushing harder from where you already are.",

  openingNarrative: `You are Healer Mira, and your younger brother has a problem.

He's been sick for three days — a bad cough that kept the whole family up last
night. The doctor prescribed bitter medicine: two spoonfuls, twice a day, for a
week. Your parents had to go back to work. They asked you to make sure he takes it.

Your brother, Tomás, is sitting at the kitchen table. He says he feels fine.

He does look a little better. And the medicine does smell awful — you can tell
from across the room.

"I don't need it," he says. "I'm basically better."

You know he's not. The doctor said the cough will come back worse if he stops
too early. But Tomás has crossed his arms.

You have the medicine in your hand. He's looking out the window.`,

  decisionPrompt:
    "How do you get Tomás to take the medicine?",

  consequences: [
    {
      choiceType: "courageous",
      narrative: `"Okay," you say. "Tell me what's actually wrong with it."

He looks at you, surprised you asked. "It smells like old socks and it's slimy."

"The smell or the taste?"

He thinks. "The smell, mostly. Once it's in my mouth it's not as bad."

You get a small glass of apple juice. You put the medicine in first, then the
juice. Then you hand him his favorite snack — the crackers he only gets when
he's sick.

"Drink it fast," you say. "Don't smell it first."

He tries it. He makes a face but he swallows it. He eats two crackers.

"Same time tonight," you say.

He nods. Not happily — but he nods.`,
    },
    {
      choiceType: "avoidant",
      narrative: `You put the medicine down on the counter.

"Okay," you say. "I'll tell Mom and Dad you didn't want it."

He looks relieved. You go into the other room.

That night his cough comes back. Your parents look at you when they come home.
"Did he take his medicine?" your mother asks.

"He said he felt fine," you say.

It's true. But it's not the whole truth, and you know it.`,
    },
    {
      choiceType: "impulsive",
      narrative: `"You HAVE to take it," you say, putting the spoon in front of him. "The doctor
said so. Mom and Dad said so. You're going to make yourself sicker."

"No."

"Tomás—"

"No!"

You push the spoon closer. He knocks it over. Now there's medicine on the table
and Tomás is crying and you're frustrated and the medicine is wasted.

He takes none of it.

Later, when your parents ask, you explain what happened. Your father sighs.
"That's not how you help someone who doesn't want help."

You know he's right. You just don't know yet what the right way is.`,
    },
    {
      choiceType: "creative",
      narrative: `Instead of holding out the medicine, you sit down across from him.

"Tell me honestly — if the medicine didn't smell or taste like anything, would
you take it?"

He shrugs. "Probably."

"So it's not that you don't believe you need it."

He's quiet for a moment. "It's really gross."

"I know. I smelled it." You pause. "What if you didn't have to smell it first?"

You hold the glass below the table, pour the medicine in without him seeing it,
then pour juice over the top quickly. "Don't smell. Just drink."

He drinks it down fast. His face is complicated.

"Same trick tonight?" he asks.

"If it works," you say.`,
    },
  ],

  reflectionQuestions: [
    {
      question:
        "Mira could have just told Tomás what the doctor said and what their parents said. Why didn't that work?",
      scaffoldedFollowUp:
        "Have you ever had someone explain all the reasons you should do something — and it still didn't make you want to do it?",
    },
    {
      question:
        "What's the difference between persuading someone and forcing them? Does the result matter, or does the method matter too?",
      scaffoldedFollowUp:
        "If Mira had forced the medicine and it worked, would that have been a good outcome? What might have been lost?",
    },
    {
      question:
        "In the story, Mira asked Tomás a question before trying to solve the problem. Why did that change things?",
      scaffoldedFollowUp:
        "What did asking the question help Mira understand that she didn't know before she asked?",
    },
    {
      question:
        "When you need to get someone to do something they don't want to do, what usually works — and why do you think that is?",
      scaffoldedFollowUp:
        "Is there a version of convincing someone that respects them, and a version that doesn't? What's the difference?",
    },
  ],

  parentSummary:
    "Today's lesson gave your child a persuasion problem with real stakes — " +
    "getting a resistant younger sibling to take medicine without forcing or " +
    "tricking them in a way that breaks trust. The four consequence branches " +
    "explore the difference between understanding resistance vs. overpowering it, " +
    "and between avoidance and creative problem-solving. The reflection questions " +
    "examine what it means to truly persuade someone vs. coerce them, and why " +
    "asking questions often works better than stating reasons. This lesson targets " +
    "Pillar 4: Communication & Persuasion, with a thread of Pillar 2: Resilience.",
};

export default lesson;
