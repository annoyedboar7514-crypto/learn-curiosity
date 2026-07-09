import { redirect } from "next/navigation";

// The sparks/rank page was removed when the Master Blueprint's forbidden list
// (no points, XP, streaks, badges, rankings) was enforced. Old bookmarks land home.
export default function StudentPage() {
  redirect("/home");
}
