import { PublicHeader } from '@/components/ui/PublicHeader';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication | Your App",
  description: "Sign in or create an account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <PublicHeader />
      {children}
    </div>
  );
}
