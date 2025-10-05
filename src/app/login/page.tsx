"use client";

import { useSession, signIn } from "next-auth/react";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";


const particlesInit = async (engine: any) => {
  await loadFull(engine);
};

export default function EnhancedLoginPage() {
  const { data: session } = useSession();

  return session ? (
    <div className="flex flex-col items-center justify-center h-screen relative overflow-hidden bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50">
      {/* Particles Background */}
      <Particles
        init={particlesInit}
        options={{
          fullScreen: { enable: true, zIndex: -1 },
          background: { color: { value: "transparent" } },
          particles: {
            number: { value: 60, density: { enable: true, area: 800 } },
            color: { value: ["#FF7C00", "#FFA500", "#FFD580"] },
            shape: { type: "circle" },
            size: { value: { min: 2, max: 6 } },
            move: {
              enable: true,
              speed: 0.3,
              direction: "none",
              outModes: "out",
            },
            opacity: { value: { min: 0.2, max: 0.8 } },
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              onClick: { enable: true, mode: "push" },
            },
          },
        }}
      />

      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 flex flex-col items-center text-center border border-orange-200"
      >
        <h1 className="text-3xl font-bold mb-4 text-orange-700 drop-shadow-lg">
          Welcome, {session.user?.name?.split(" ")[0]}!
        </h1>
        <img
          src={session.user?.image || ""}
          alt="Profile"
          className="w-28 h-28 rounded-full mb-4 border-4 border-orange-400 shadow-lg"
        />
        <button
          onClick={() => signIn()}
          className="px-8 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition shadow-md hover:shadow-lg"
        >
          Switch Account
        </button>
      </motion.div>

      {/* Floating Food Icons */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute top-10 left-20 text-3xl drop-shadow-lg"
      >
        🍳
      </motion.div>
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="absolute top-1/2 right-32 text-4xl drop-shadow-lg"
      >
        🥗
      </motion.div>
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="absolute bottom-20 left-1/3 text-4xl drop-shadow-lg"
      >
        🥖
      </motion.div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-screen relative overflow-hidden bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50">
      {/* Particles Background */}
      <Particles
        init={particlesInit}
        options={{
          fullScreen: { enable: true, zIndex: -1 },
          background: { color: { value: "transparent" } },
          particles: {
            number: { value: 60, density: { enable: true, area: 800 } },
            color: { value: ["#FF7C00", "#FFA500", "#FFD580"] },
            shape: { type: "circle" },
            size: { value: { min: 2, max: 6 } },
            move: {
              enable: true,
              speed: 0.3,
              direction: "none",
              outModes: "out",
            },
            opacity: { value: { min: 0.2, max: 0.8 } },
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              onClick: { enable: true, mode: "push" },
            },
          },
        }}
      />

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-5xl font-bold mb-8 text-orange-700 drop-shadow-lg"
      >
        Cookaro
      </motion.h1>

      {/* Google Sign In */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        onClick={() => signIn("google")}
        className="flex items-center gap-2 px-8 py-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition shadow-lg hover:shadow-2xl text-lg font-semibold"
      >
        <span>Sign in with Google</span>
        <span className="text-xl">🟢</span>
      </motion.button>

      {/* Floating Food Icons */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute top-10 left-20 text-3xl drop-shadow-lg"
      >
        🍳
      </motion.div>
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="absolute top-1/2 right-32 text-4xl drop-shadow-lg"
      >
        🥗
      </motion.div>
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="absolute bottom-20 left-1/3 text-4xl drop-shadow-lg"
      >
        🥖
      </motion.div>
    </div>
  );
}