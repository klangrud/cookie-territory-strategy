import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { logout } from "@/lib/actions/auth.actions";
import "./globals.css";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cookie Territory Strategy",
  description: "Girl Scout cookie sale territory coverage visualization",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="border-b bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-14 items-center justify-between">
              <div className="flex items-center gap-6">
                <Link href="/" className="text-lg font-bold text-green-900">
                  Cookie Territory
                </Link>
                {session && (
                  <Link
                    href="/admin"
                    className="text-sm text-gray-700 hover:text-gray-900"
                  >
                    Admin
                  </Link>
                )}
              </div>
              <div className="flex items-center gap-4">
                {session ? (
                  <form action={logout}>
                    <button
                      type="submit"
                      className="cursor-pointer text-sm text-gray-700 hover:text-gray-900"
                    >
                      Logout
                    </button>
                  </form>
                ) : (
                  <Link
                    href="/login"
                    className="text-sm text-gray-700 hover:text-gray-900"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
