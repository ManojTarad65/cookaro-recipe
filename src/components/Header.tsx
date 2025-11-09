"use client";

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { ChefHat, Sun, Moon, Bell, Menu, X } from "lucide-react";
import Link from "next/link";

interface Notification {
  id: number;
  message: string;
  time: string;
}

export default function Header() {
  const { data: session } = useSession();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Example notifications
  const notifications: Notification[] = [
    { id: 1, message: "New Italian recipe added 🍝", time: "2h ago" },
    { id: 2, message: "Don't forget your lunch plan 🥗", time: "5h ago" },
    { id: 3, message: "Protein intake low today ⚡", time: "1d ago" },
  ];

  if (!session) return null;
  const firstName = session.user?.name?.split(" ")[0];

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="flex items-center justify-between bg-card px-4 md:px-6 py-3 shadow-md sticky top-0 z-50">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors"
      >
        <ChefHat className="h-7 w-7 md:h-8 md:w-8" />
        <span className="text-lg md:text-xl font-bold">EatoAI</span>
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-6 relative">
        <Link href="/" className="text-sm font-medium hover:text-orange-600">
          Home
        </Link>
        <Link
          href="/nutrition"
          className="text-sm font-medium hover:text-orange-600"
        >
          Nutrition
        </Link>
        <Link
          href="/about"
          className="text-sm font-medium hover:text-orange-600"
        >
          About
        </Link>
        <Link
          href="/today"
          className="text-sm font-medium hover:text-orange-600"
        >
          Today
        </Link>
        <Link
          href="/chat"
          className="text-sm font-medium hover:text-orange-600"
        >
          Chat with EatoAI
        </Link>
        <Link
          href="/contact"
          className="text-sm font-medium hover:text-orange-600"
        >
          Contact
        </Link>

        {/* Dark/Light Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-primary/10"
        >
          {darkMode ? (
            <Sun className="h-5 w-5 cursor-pointer" />
          ) : (
            <Moon className="h-5 w-5 cursor-pointer" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 rounded-full hover:bg-primary/10 relative"
          >
            <Bell className="h-5 w-5 cursor-pointer" />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-lg border bg-white shadow-lg overflow-hidden">
              <h3 className="px-4 py-2 text-sm font-semibold border-b">
                Notifications
              </h3>
              <div className="max-h-64 overflow-y-auto divide-y">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="px-4 py-2 text-sm hover:bg-orange-50"
                  >
                    <p>{notif.message}</p>
                    <span className="text-xs text-gray-500">{notif.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 rounded-full hover:bg-primary/10 p-1"
          >
            {session.user?.image && (
              <img
                src={session.user.image}
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover"
              />
            )}
            <span className="font-medium">{firstName}</span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-40 rounded-lg border bg-white shadow-lg">
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
        {menuOpen ? (
          <X className="h-6 w-6 text-orange-600" />
        ) : (
          <Menu className="h-6 w-6 text-orange-600" />
        )}
      </button>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md border-t z-40 flex flex-col items-center space-y-3 py-6">
          {[
            "Home",
            "Nutrition",
            "About",
            "Today",
            "Chat with EatoAI",
            "Contact",
          ].map((item, index) => (
            <Link
              key={index}
              href={`/${item.toLowerCase().replace(/ /g, "")}`}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-gray-800 hover:text-orange-600 transition-colors"
            >
              {item}
            </Link>
          ))}
          <div className="flex items-center gap-3 mt-2">
            <button onClick={toggleDarkMode}>
              {darkMode ? (
                <Sun className="h-5 w-5 text-orange-600" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </button>
            <Bell
              className="h-5 w-5 text-gray-700 cursor-pointer"
              onClick={() => alert("Notifications coming soon!")}
            />
          </div>
        </div>
      )}
    </header>
  );
}
