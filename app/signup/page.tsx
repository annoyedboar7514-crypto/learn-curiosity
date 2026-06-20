"use client";

import { useRouter } from "next/navigation";
import { SignupFlow } from "@/app/components/SignupFlow";

export default function SignupPage() {
  const router = useRouter();

  return (
    <SignupFlow
      onStartQuiz={() => router.push("/home")}
    />
  );
}
