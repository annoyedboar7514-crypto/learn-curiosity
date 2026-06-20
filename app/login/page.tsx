import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-cream flex items-start justify-center pt-16 px-4 pb-20">
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#2a7c6f",
            colorBackground: "#fffdf7",
            fontFamily: "inherit",
            borderRadius: "1rem",
          },
          elements: {
            card: "shadow-lg border border-parchment",
            headerTitle: "font-serif",
            formButtonPrimary: "rounded-full font-semibold",
          },
        }}
      />
    </div>
  );
}
