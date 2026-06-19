"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { mentorCharacters } from "@/lib/mentor/mentor-characters";

export default function MentorSelector() {
  const params = useSearchParams();
  const router = useRouter();
  const archetype = params.get("archetype") ?? "explorer";

  function choose(mentorId: string) {
    router.push(`/lesson?archetype=${archetype}&mentor=${mentorId}`);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-[#faf9f7]">
      <div className="max-w-2xl w-full text-center">

        {/* Brand header */}
        <div className="flex justify-center mb-8">
          <div className="relative w-[120px] h-[90px]">
            <Image
              src="/brand/Logo.png"
              alt="Learn Curiosity"
              fill
              sizes="120px"
              className="object-contain"
              priority
            />
          </div>
        </div>

        <p className="text-xs font-bold uppercase tracking-widest text-[#b8860b] mb-2">
          Step 2 of 2
        </p>
        <h1 className="text-3xl font-bold text-[#1e3a52] mb-2">
          Choose your guide
        </h1>
        <p className="text-gray-400 text-sm mb-10">
          Pick the mentor you want to learn with today.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {mentorCharacters.map((m) => (
            <button
              key={m.id}
              onClick={() => choose(m.id)}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-[#f0e8d8] bg-white hover:border-[#1e3a52] hover:bg-[#f0e8d8] transition-all cursor-pointer text-center group"
            >
              <span className="text-6xl select-none group-hover:scale-110 transition-transform">
                {m.emoji}
              </span>
              <div>
                <p className="font-bold text-[#1e3a52] text-lg">{m.name}</p>
                <p className="text-xs text-[#b8860b] font-semibold uppercase tracking-wide mb-2">
                  {m.title}
                </p>
                <p className="text-sm text-gray-500 leading-snug">{m.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
