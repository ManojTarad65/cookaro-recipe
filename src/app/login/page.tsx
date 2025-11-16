"use client";

import dynamic from "next/dynamic";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const Particles = dynamic(() => import("react-tsparticles"), { ssr: false });

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Auto redirect after login
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/today");
    }
  }, [status, router]);

  // FIXED PARTICLES INIT
  const particlesInit = async (engine: any) => {
    const { loadSlim } = await import("tsparticles-slim");
    await loadSlim(engine);
  };

  const particlesOptions = {
    fullScreen: { enable: true, zIndex: -1 },
    particles: {
      number: { value: 60 },
      color: { value: ["#ff8c00", "#ffa200", "#fff5d1"] },
      move: { enable: true, speed: 0.6 },
    },
  };

  if (status === "loading") return null;

  // SHOW LOGIN PAGE if NOT LOGGED IN
  if (!session)
    return (
      <div className="flex flex-col items-center justify-center h-screen relative bg-gradient-to-br from-black via-zinc-900 to-black text-white">
        <Particles init={particlesInit} options={particlesOptions} />

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent mb-4"
        >
          EatoAI 🍳
        </motion.h1>

        <motion.button
          onClick={() => signIn("google")}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl text-white mt-4"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-6 h-6"
          />
          Sign in with Google
        </motion.button>

        <p className="absolute bottom-6 text-sm text-gray-400">
          Crafted with ❤️ by Manoj Tarad
        </p>
      </div>
    );

  // TEMP WELCOME (won't be visible long)
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-orange-600 to-yellow-500 text-white">
      <h1 className="text-3xl font-semibold">Welcome back!</h1>
    </div>
  );
}
