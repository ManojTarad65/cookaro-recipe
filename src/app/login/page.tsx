"use client";

import { useSession, signIn } from "next-auth/react";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const particlesInit = async (main: any) => {
  await loadFull(main);
};

export default function EnhancedLoginPage() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50 relative overflow-hidden">
        <h1 className="text-3xl font-bold mb-4 text-orange-700">
          Welcome, {session.user?.name?.split(" ")[0]}!
        </h1>
        <img
          src={session.user?.image || ""}
          alt="Profile"
          className="w-24 h-24 rounded-full mb-4 border-4 border-orange-400"
        />
        <button
          onClick={() => signIn()}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          Switch Account
        </button>
        {/* Particles background */}
        <Particles
          init={particlesInit}
          options={{
            fullScreen: { enable: true, zIndex: -1 },
            particles: {
              number: { value: 50 },
              color: { value: "#ff7c00" },
              shape: { type: "circle" },
              size: { value: { min: 3, max: 7 } },
              move: {
                enable: true,
                speed: 0.5,
                direction: "none",
                outModes: "out",
              },
              opacity: { value: { min: 0.3, max: 0.8 } },
            },
          }}
        />

        {/* Floating food icons */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute top-10 left-20 text-2xl"
        >
          🍳
        </motion.div>
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="absolute top-1/2 right-32 text-3xl"
        >
          🥗
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute bottom-20 left-1/3 text-3xl"
        >
          🥖
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50 relative overflow-hidden">
      <h1 className="text-4xl font-bold mb-8 text-orange-700">Cookaro</h1>

      <button
        onClick={() => signIn("google")}
        className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-lg font-semibold"
      >
        <span>Sign in with Google</span>
        <span className="text-xl">🟢</span>
      </button>

      {/* Particles background */}
      <Particles
        init={particlesInit}
        options={{
          fullScreen: { enable: true, zIndex: -1 },
          particles: {
            number: { value: 50 },
            color: { value: "#ff7c00" },
            shape: { type: "circle" },
            size: { value: { min: 3, max: 7 } },
            move: {
              enable: true,
              speed: 0.5,
              direction: "none",
              outModes: "out",
            },
            opacity: { value: { min: 0.3, max: 0.8 } },
          },
        }}
      />

      {/* Floating food icons */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute top-10 left-20 text-2xl"
      >
        🍳
      </motion.div>
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="absolute top-1/2 right-32 text-3xl"
      >
        🥗
      </motion.div>
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="absolute bottom-20 left-1/3 text-3xl"
      >
        🥖
      </motion.div>
    </div>
  );
}
