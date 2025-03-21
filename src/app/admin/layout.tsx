import SideBar from "@/components/ui/SideBar";
import type { Metadata } from "next";
// import { PayPalProvider } from "@/providers/PayPalProvider";

export const metadata: Metadata = {
  title: "Shop | Your Store Name",
  description: "Browse our collection of products",
};

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <PayPalProvider>
    <div className="flex h-screen">
        <SideBar />

        <main className="flex-1 p-6 bg-gray-100">
          {children}
        </main>
      </div>
    // </PayPalProvider>
  );
}