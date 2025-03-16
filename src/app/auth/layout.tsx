import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication | Your App",
  description: "Sign in or create an account",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className="w-full max-w-md">
        {children}
      </div>
  );
}
