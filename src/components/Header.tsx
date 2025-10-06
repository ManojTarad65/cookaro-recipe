
"use client";

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { ChefHat, Sun, Moon, Bell } from "lucide-react";
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
    <header className="flex items-center justify-between bg-card px-6 py-4 shadow-md sticky top-0 z-50">
      <Link
        href="/"
        className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors"
      >
        <ChefHat className="h-8 w-8" />
        <span className="text-xl font-bold">COOKARO</span>
      </Link>

      <div className="flex items-center gap-4 relative">
        <Link
          href="/"
          className="text-sm font-medium transition-colors hover:text-orange-600"
        >
          Home
        </Link>
        <Link href="/nutrition" className="text-sm font-medium transition-colors hover:text-orange-600">Nutrition</Link>
        <Link href="/about" className="text-sm font-medium transition-colors hover:text-orange-600">About</Link>
        <Link href="/contact" className="text-sm font-medium transition-colors hover:text-orange-600">Contact</Link>
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
            className="p-2 rounded-full hover:bg-primary/10 relative cursor-pointer"
          >
            <Bell className="h-5 w-5 cursor-pointer" />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-destructive"></span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-lg border border-border bg-card shadow-lg overflow-hidden">
              <h3 className="px-4 py-2 text-sm font-semibold border-b border-border">
                Notifications
              </h3>
              <div className="flex flex-col divide-y divide-border max-h-64 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="px-4 py-2 text-sm hover:bg-primary/5 cursor-pointer"
                  >
                    <p>{notif.message}</p>
                    <span className="text-xs text-muted-foreground">
                      {notif.time}
                    </span>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <p className="px-4 py-2 text-sm text-muted-foreground">
                    No notifications
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
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
            <div className="absolute right-0 mt-2 w-40 rounded-lg border border-border bg-card shadow-lg ">
              <Link href="/history">
                <button className="w-full px-4 py-2 text-left text-sm font-semibold cursor-pointer">
                  History
                </button>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-destructive/10 cursor-pointer"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
