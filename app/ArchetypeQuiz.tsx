"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { questions, archetypeResults, scoreQuiz } from "@/lib/quiz/archetype-quiz";
import type { Archetype } from "@/lib/content/lesson.types";

export default function ArchetypeQuiz() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Partial<Record<Archetype, number>>>({});
  const [chosen, setChosen] = useState<Archetype | null>(null);
  const [result, setResult] = useState<Archetype | null>(null);

  function pick(archetype: Archetype) {
    if (chosen !== null) return;
    setChosen(archetype);
    const next = { ...scores, [archetype]: (scores[archetype] ?? 0) + 1 };
    setScores(next);
    setTimeout(() => {
      if (step + 1 >= questions.length) {
        setResult(scoreQuiz(next));
      } else {
        setStep((s) => s + 1);
        setChosen(null);
      }
    }, 420);
  }

  function restart() {
    setStep(0);
    setScores({});
    setChosen(null);
    setResult(null);
  }

  if (result !== null) {
    const r = archetypeResults[result];
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center px-6 py-16 ${r.bgColor}`}>
        <div className="max-w-lg w-full text-center">
          {/* Brand mark on result screen */}
          <div className="flex justify-center mb-6">
            <div className="relative w-[80px] h-[60px]">
              <Image
                src="/brand/Logo.png"
                alt="Learn Curiosity"
                fill
                sizes="80px"
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="text-7xl mb-4 select-none">{r.emoji}</div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
            You are
          </p>
          <h1 className={`text-4xl font-bold mb-3 ${r.textColor}`}>{r.name}</h1>
          <p className={`text-lg font-medium mb-6 ${r.textColor} opacity-75`}>
            {r.tagline}
          </p>
          <p className="text-base text-gray-600 leading-relaxed mb-10 max-w-sm mx-auto">
            {r.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={restart}
              className="px-6 py-3 rounded-full border-2 border-gray-300 text-gray-600 font-medium hover:bg-white transition-colors cursor-pointer"
            >
              Try again
            </button>
            <button
              onClick={() => router.push(`/mentor?archetype=${result}`)}
              className={`px-8 py-3 rounded-full text-white font-semibold transition-colors cursor-pointer ${r.accentColor} opacity-90 hover:opacity-100`}
            >
              Start learning →
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[step];
  const progressPct = (step / questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-[#faf9f7]">
      <div className="max-w-2xl w-full">

        {/* Brand header */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative w-[140px] h-[105px] mb-3">
            <Image
              src="/brand/Logo.png"
              alt="Learn Curiosity"
              fill
              sizes="140px"
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-[#1e3a52]">Find your guide</h1>
          <p className="text-sm text-gray-400 mt-1">Answer 5 quick questions</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Question {step + 1} of {questions.length}</span>
            <span>{Math.round(progressPct)}% done</span>
          </div>
          <div className="w-full h-2 bg-[#f0e8d8] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1e3a52] rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center mb-8 leading-snug">
          {q.prompt}
        </h2>

        {/* Options */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {q.options.map((opt) => {
            const isChosen = chosen === opt.archetype;
            const isDimmed = chosen !== null && !isChosen;
            return (
              <button
                key={opt.archetype}
                onClick={() => pick(opt.archetype)}
                disabled={chosen !== null}
                className={[
                  "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 text-center transition-all duration-200 cursor-pointer",
                  isChosen
                    ? "border-[#1e3a52] bg-[#f0e8d8] scale-95 shadow-sm"
                    : isDimmed
                    ? "border-gray-100 opacity-40 cursor-default"
                    : "border-gray-200 hover:border-[#1e3a52] hover:bg-[#f0e8d8] hover:scale-[1.02] active:scale-95",
                ].join(" ")}
              >
                <span className="text-4xl select-none">{opt.emoji}</span>
                <span className="text-sm font-medium text-gray-700 leading-snug">
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
