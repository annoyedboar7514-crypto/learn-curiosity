import { TermsContent } from "@/app/components/TermsContent";

export const metadata = {
  title: "Terms of Service & Privacy Policy — Learn Curiosity",
  description: "Full Terms of Service, Privacy Policy, and COPPA disclosure for Learn Curiosity.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAF6EE]">
      <TermsContent variant="full" />
    </div>
  );
}
