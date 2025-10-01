import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/navbar";
import { UserProvider } from "@/context/UserContext";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const notoSansKR = Noto_Sans_KR({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Expense Tracker",
  description:
    "Track, manage, and analyze your expenses efficiently with real-time insights",
  icons: {
    icon: "/logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user ?? null;

  return (
    <UserProvider user={user}>
      <Navbar />
      <html
        lang="en"
        className={`${notoSansKR.variable}`}
        suppressHydrationWarning
      >
        <body className="antialiased bg-background text-foreground">
          <NextTopLoader
            showSpinner={false}
            height={6}
            color="var(--primary)"
          />
          <Toaster richColors position="top-right" />
          <main className="min-h-screen">{children}</main>
        </body>
      </html>
    </UserProvider>
  );
}
