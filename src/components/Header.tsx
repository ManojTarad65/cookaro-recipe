"use client";

import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { ChefHat, Sun, Moon, Bell, Menu, X } from "lucide-react";
import Link from "next/link";
import Head from "next/head";

export default function Header() {
  const { data: session } = useSession();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // ✅ Prevents hydration mismatch in Next.js 15

  if (!session) return null;

  const firstName = session.user?.name?.split(" ")[0] || "User";

  return (
    <>
      {/* ✅ SEO Enhancements */}
      <Head>
        <title>EatoAI – Smart Meal Planning & Nutrition Assistant</title>
        <meta
          name="description"
          content="EatoAI helps you create personalized, healthy recipes and track nutrition using advanced AI. Eat smarter, live better."
        />
        <meta
          name="keywords"
          content="EatoAI, recipe AI, meal planner, nutrition, cooking assistant, healthy food"
        />
        <meta name="author" content="EatoAI Team" />
        <meta
          property="og:title"
          content="EatoAI – Smart Meal Planning & Nutrition Assistant"
        />
        <meta
          property="og:description"
          content="Discover intelligent meal suggestions, nutrition insights, and AI-powered recipes with EatoAI."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://eatoai.vercel.app" />
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="EatoAI – Smart Meal Planning & Nutrition Assistant"
        />
        <meta
          name="twitter:description"
          content="Your AI-powered meal planner and nutrition assistant. Cook smart with EatoAI."
        />
        <meta name="twitter:image" content="/og-image.png" />
        <link rel="canonical" href="https://eatoai.vercel.app" />
      </Head>

      <header className="flex items-center justify-between bg-card px-4 md:px-6 py-3 shadow-md sticky top-0 z-50 transition-colors duration-300">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors"
          aria-label="Go to homepage"
        >
          <ChefHat className="h-7 w-7 md:h-8 md:w-8" />
          <span className="text-lg md:text-xl font-bold">EatoAI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 relative">
          <NavLink href="/" text="Home" />
          <NavLink href="/nutrition" text="Nutrition" />
          <NavLink href="/about" text="About" />
          <NavLink href="/today" text="Today" />
          <NavLink href="/chat" text="Chat with EatoAI" />
          <NavLink href="/contact" text="Contact" />

          {/* 👤 Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 rounded-full hover:bg-primary/10 p-1 transition-all"
              aria-label="User menu"
            >
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt={`${firstName}'s Profile`}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-orange-200 flex items-center justify-center text-sm font-semibold text-orange-700">
                  {firstName.charAt(0)}
                </div>
              )}
              <span className="font-medium">{firstName}</span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-lg border bg-white shadow-lg dark:bg-zinc-900 dark:border-zinc-700">
                <Link href="/profile" onClick={() => setProfileOpen(false)}>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-orange-50 dark:hover:bg-zinc-800">
                    Profile
                  </button>
                </Link>
                <Link href="/history" onClick={() => setProfileOpen(false)}>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-orange-50 dark:hover:bg-zinc-800">
                    History
                  </button>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* 📱 Mobile Menu */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-orange-100 dark:hover:bg-zinc-800"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X className="h-6 w-6 text-orange-600" />
          ) : (
            <Menu className="h-6 w-6 text-orange-600" />
          )}
        </button>

        {menuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white dark:bg-zinc-900 shadow-md border-t z-40 flex flex-col items-center space-y-3 py-6 transition-all duration-300">
            {["Home", "Nutrition", "About", "Today", "Chat", "Contact"].map(
              (item, index) => (
                <Link
                  key={index}
                  href={`/${item.toLowerCase().replace(/ /g, "")}`}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-orange-600 transition-colors"
                >
                  {item}
                </Link>
              )
            )}
            <div className="flex items-center gap-3 mt-2">
              <Bell
                className="h-5 w-5 text-gray-700 dark:text-gray-300 cursor-pointer"
                onClick={() => setNotifOpen(!notifOpen)}
              />
            </div>
          </div>
        )}
      </header>
    </>
  );
}

/** ✅ Reusable NavLink Component for cleaner code */
const NavLink = ({ href, text }: { href: string; text: string }) => (
  <Link
    href={href}
    className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-orange-600 transition-colors"
  >
    {text}
  </Link>
);
