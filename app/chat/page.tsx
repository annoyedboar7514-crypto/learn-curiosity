export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getChildProfile } from "@/lib/session";
import { mentorCharacters } from "@/lib/mentor/mentor-characters";
import ChatInterface from "./ChatInterface";

export default async function ChatPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const profile = await getChildProfile();
  if (!profile) redirect("/signup/complete");

  // Default mentor: first character, or the one matching archetype if set
  const defaultMentorId =
    profile.archetype === "explorer" || profile.archetype === "astronaut" ? "rex"
    : profile.archetype === "detective" || profile.archetype === "inventor-builder" ? "luna"
    : profile.archetype === "artist" || profile.archetype === "doctor-healer" ? "sage"
    : "luna";

  return (
    <ChatInterface
      childName={profile.nickname}
      gradeBand={profile.gradeBand ?? "3-4"}
      defaultMentorId={defaultMentorId}
      mentors={mentorCharacters}
      childProfileId={profile.id ?? null}
    />
  );
}
