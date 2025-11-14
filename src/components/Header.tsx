"use client";

import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ChefHat, Menu, X } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // Hide header on public pages
  const hiddenRoutes = ["/", "/login", "/register"];
  if (hiddenRoutes.includes(pathname)) return null;

  // Hide header while loading or not logged in
  if (status === "loading") return null;
  if (status === "unauthenticated") return null;

  const firstName = session?.user?.name?.split(" ")[0] || "User";

  return (
    <header className="flex items-center justify-between bg-white dark:bg-black px-4 md:px-6 py-3 shadow-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
      {/* Logo */}
      <Link
        href="/today"
        className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition"
      >
        <ChefHat className="h-7 w-7" />
        <span className="text-lg font-bold">EatoAI</span>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6">
        <NavLink href="/" text="Home" />
        <NavLink href="/today" text="Today" />
        <NavLink href="/nutrition" text="Nutrition" />
        <NavLink href="/recipe" text="Recipe" />
        <NavLink href="/chat" text="Chat" />
        <NavLink href="/about" text="About" />
        <NavLink href="/contact" text="Contact" />

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 rounded-full hover:bg-orange-100 dark:hover:bg-zinc-800 p-1 transition"
          >
            <div className="h-8 w-8 rounded-full bg-orange-300 flex items-center justify-center text-sm font-semibold text-orange-800">
              {firstName.charAt(0)}
            </div>
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {firstName}
            </span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-44 rounded-lg border bg-white dark:bg-zinc-900 dark:border-zinc-700 shadow-lg">
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm hover:bg-orange-50 dark:hover:bg-zinc-800"
                onClick={() => setProfileOpen(false)}
              >
                Profile
              </Link>

              <Link
                href="/history"
                className="block px-4 py-2 text-sm hover:bg-orange-50 dark:hover:bg-zinc-800"
                onClick={() => setProfileOpen(false)}
              >
                History
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 rounded-md hover:bg-orange-100 dark:hover:bg-zinc-800"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        {menuOpen ? (
          <X className="h-6 w-6 text-orange-600" />
        ) : (
          <Menu className="h-6 w-6 text-orange-600" />
        )}
      </button>

      {/* Mobile Menu Panel */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white dark:bg-zinc-900 shadow-md border-t flex flex-col items-center space-y-4 py-6 z-40">
          {[
            "Today",
            "Nutrition",
            "Recipe",
            "Chat",
            "History",
            "About",
            "Contact",
          ].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-orange-600"
            >
              {item}
            </Link>
          ))}

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-red-500 font-medium mt-4"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

/* Reusable NavLink Component */
function NavLink({ href, text }: { href: string; text: string }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-orange-600 transition"
    >
      {text}
    </Link>
  );
}
