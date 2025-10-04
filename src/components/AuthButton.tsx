"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl shadow-lg">
        <p className="text-lg font-semibold text-orange-500">
          Hi, {session.user?.name}
        </p>
        <Button onClick={() => signOut()}>Logout</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl shadow-lg">
      <p className="text-lg font-semibold text-orange-500">
        Welcome to 🍲 Cookaro!
      </p>
      <Button onClick={() => signIn("google")}>Login with Google</Button>
    </div>
  );
}
