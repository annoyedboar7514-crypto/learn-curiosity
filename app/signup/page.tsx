import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-cream flex items-start justify-center pt-16 px-4 pb-20">
      <SignUp />
    </div>
  );
}
