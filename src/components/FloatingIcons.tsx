"use client";

import { motion } from "framer-motion";

const icons = ["🍔", "🍕", "🍣", "🥗", "🍩", "🥑"];

export default function FloatingIcons() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {icons.map((icon, idx) => (
        <motion.div
          key={idx}
          initial={{ y: 800, x: Math.random() * 1000, opacity: 0 }}
          animate={{ y: [-50, 800], opacity: [1, 0] }}
          transition={{
            repeat: Infinity,
            duration: 15 + Math.random() * 10,
            delay: Math.random() * 5,
          }}
          className="absolute text-3xl"
        >
          {icon}
        </motion.div>
      ))}
    </div>
  );
}
