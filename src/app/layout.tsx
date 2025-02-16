import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Providers } from "./providers";
import { getServerSession } from "next-auth";
import SessionProvider from "./components/SessionProvider";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { isAdminEmail } from "@/lib/auth";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Jessica Lee - Portfolio",
  description: "Portfolio website showcasing the work of Jessica Lee",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const isAdmin = isAdminEmail(session?.user?.email);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans min-h-screen flex flex-col`}>
        <Providers>
          <SessionProvider session={session}>
            <Header isAdmin={isAdmin} />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}
