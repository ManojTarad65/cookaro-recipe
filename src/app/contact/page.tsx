"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useCallback } from "react";
import { RiGithubLine } from "react-icons/ri";
import { FaLinkedin } from "react-icons/fa";

export default function Contact() {
  const particlesInit = useCallback(async (engine: any) => {
    await loadFull(engine);
  }, []);

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
                <p className="text-gray-600">support@recipeai.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-4 rounded-xl">
                <Phone className="text-orange-600 h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
                <p className="text-gray-600">+91 98765 43210</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-4 rounded-xl">
                <MapPin className="text-orange-600 h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Office</h3>
                <p className="text-gray-600">Jaipur, Rajasthan, India</p>
              </div>
            </div>

            <motion.div
              className="mt-10 p-6 bg-white rounded-2xl shadow-md border border-orange-100"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Working Hours
              </h3>
              <p className="text-gray-600">Monday – Friday: 9 AM – 6 PM</p>
              <p className="text-gray-600">Saturday: 10 AM – 3 PM</p>
              <p className="text-gray-600">Sunday: Closed</p>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            className="bg-white p-8 rounded-2xl shadow-lg border border-orange-100 space-y-6 backdrop-blur-sm"
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Full Name
              </label>
              <Input
                placeholder="Enter your name"
                className="focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Email Address
              </label>
              <Input
                placeholder="you@example.com"
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
                className="focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <Button
              size="lg"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg flex items-center justify-center gap-2"
              type="submit"
            >
              <Send className="h-5 w-5" /> Send Message
            </Button>
          </motion.form>
        </div>
      </motion.section>

      {/* Footer CTA */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ChefHat className="h-6 w-6 text-orange-400" />
            <span className="text-xl font-bold">COOKARO</span>
          </div>
          <p className="text-gray-400">
            © 2025 COOKARO. All rights reserved. Made ❤️ by Manoj Tarad
          </p>
          <div className="flex items-center justify-center space-x-2 mt-4 gap-10">
            <a
              href="https://github.com/ManojTarad65"
              target="_blank"
              rel="noopener noreferrer"
            >
              <RiGithubLine className="h-6 w-6 text-orange-100" />
            </a>
            <a
              href="https://linkedin.com/in/manoj-tarad-0b779625a"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin className="h-6 w-6 text-orange-100" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
