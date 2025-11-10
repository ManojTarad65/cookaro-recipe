"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import Footer from "@/components/Footer";

export default function Contact() {
  // ✅ Safe particle initialization (fixes engine.checkVersion error)
  const particlesInit = useCallback(async (engine: any) => {
    try {
      if (typeof loadFull === "function") {
        await loadFull(engine);
      } else if (engine && typeof engine.refresh === "function") {
        await engine.refresh();
      }
    } catch (err) {
      console.warn("Particles engine load skipped:", err);
    }
  }, []);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Message sent successfully!");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        toast.error(data.error || "Failed to send message");
      }
    } catch (err) {
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-white">
      {/* Background Particles */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: "transparent" },
          fpsLimit: 60,
          particles: {
            number: { value: 25 },
            color: { value: "#f97316" },
            opacity: { value: 0.25 },
            size: { value: 3 },
            move: { enable: true, speed: 0.8, random: true },
          },
        }}
        className="absolute inset-0 z-0"
      />

      {/* Contact Section */}
      <motion.section
        className="relative z-10 max-w-6xl mx-auto px-6 py-24"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have any questions, suggestions, or partnership ideas? We’d love to
            hear from you!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info Section */}
          <motion.div
            className="space-y-8"
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-4 rounded-xl">
                <Mail className="text-orange-600 h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                <p className="text-gray-600">manojtarad65@gmail.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-4 rounded-xl">
                <Phone className="text-orange-600 h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
                <p className="text-gray-600">+91 7877018453</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-4 rounded-xl">
                <MapPin className="text-orange-600 h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Office</h3>
                <p className="text-gray-600">Bikaner, Rajasthan, India</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            className="bg-white p-8 rounded-2xl shadow-lg border border-orange-100 space-y-6 backdrop-blur-sm"
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
          >
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Full Name
              </label>
              <Input
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Email Address
              </label>
              <Input
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Message
              </label>
              <Textarea
                placeholder="Write your message here..."
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <Button
              size="lg"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg flex items-center justify-center gap-2"
              type="submit"
              disabled={loading}
            >
              <Send className="h-5 w-5" />{" "}
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </motion.form>
        </div>
      </motion.section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
