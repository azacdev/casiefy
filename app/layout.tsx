import type { Metadata } from "next";
import { Recursive } from "next/font/google";

import "@/styles/globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const recursive = Recursive({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Casiefy",
  description: "Your image on a custom phone case",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={recursive.className}>
          <Navbar />
          <main className="grainy-light flex flex-col min-h-[calc(100vh-3.5rem-1px)]">
            <div className="flex-1 flex flex-col h-full">
              <Providers>{children}</Providers>
            </div>
            <Footer />
          </main>

          <Toaster />
        </body>
      </html>
    </SessionProvider>
  );
}
