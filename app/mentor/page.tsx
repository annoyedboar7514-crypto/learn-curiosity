import { Suspense } from "react";
import MentorSelector from "./MentorSelector";

export default function MentorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-400">Loading…</p>
        </div>
      }
    >
      <MentorSelector />
    </Suspense>
  );
}
