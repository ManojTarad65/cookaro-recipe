"use client";

import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ChefHat, Bell, Menu, X } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // ❌ Hide header on:
  const hiddenRoutes = ["/", "/login", "/register"];
  if (hiddenRoutes.includes(pathname)) return null;

  // ❌ Hide header if user not logged in
  if (!session) return null;

  const firstName = session.user?.name?.split(" ")[0] || "User";

  return (
    <header className="flex items-center justify-between bg-card px-4 md:px-6 py-3 shadow-md sticky top-0 z-50">
      {/* Logo */}
      <Link
        href="/today"
        className="flex items-center gap-2 text-orange-600 hover:text-orange-700"
      >
        <ChefHat className="h-7 w-7" />
        <span className="text-lg font-bold">EatoAI</span>
      </Link>

      {/* Desktop Menu */}
      <nav className="hidden md:flex items-center gap-6">
        <NavLink href="/today" text="Today" />
        <NavLink href="/nutrition" text="Nutrition" />
        <NavLink href="/chat" text="Chat" />
        <NavLink href="/history" text="History" />
        <NavLink href="/about" text="About" />
        <NavLink href="/contact" text="Contact" />

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 rounded-full hover:bg-primary/10 p-1"
          >
            <div className="h-8 w-8 rounded-full bg-orange-300 flex items-center justify-center text-sm font-semibold text-orange-800">
              {firstName.charAt(0)}
            </div>
            <span className="font-medium">{firstName}</span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-44 rounded-lg border bg-white shadow-lg">
              <Link href="/profile">
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-orange-50">
                  Profile
                </button>
              </Link>

              <Link href="/history">
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-orange-50">
                  History
                </button>
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 rounded-md hover:bg-orange-100"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md border-t flex flex-col items-center space-y-3 py-6">
          {["Today", "Nutrition", "Chat", "History", "About", "Contact"].map(
            (item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-gray-800 hover:text-orange-600"
              >
                {item}
              </Link>
            )
          )}

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-red-500 mt-2"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

function NavLink({ href, text }: { href: string; text: string }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-gray-800 hover:text-orange-600"
    >
      {text}
    </Link>
  );
}
