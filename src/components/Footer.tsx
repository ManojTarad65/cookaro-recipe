"use client";

import React from "react";
import { ChefHat, User } from "lucide-react";
import { RiGithubLine } from "react-icons/ri";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center space-y-6">
        {/* Logo & Name */}
        <div className="flex items-center space-x-2">
          <ChefHat className="h-7 w-7 text-orange-400" />
          <span className="text-2xl font-semibold tracking-wide">EatoAI</span>
        </div>

        {/* Tagline */}
        <p className="text-gray-400 text-sm sm:text-base max-w-xl">
          © {new Date().getFullYear()}{" "}
          <span className="text-orange-400 font-semibold">EatoAI</span>. All
          rights reserved. <br className="sm:hidden" /> Crafted with ❤️ by{" "}
          <span className="font-semibold text-orange-300">Manoj Tarad</span>
        </p>

        {/* Social Links */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-10 mt-2">
          <a
            href="https://github.com/ManojTarad65"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 transition-transform duration-200"
          >
            <RiGithubLine className="h-6 w-6 sm:h-7 sm:w-7 text-orange-100 hover:text-orange-400" />
          </a>
          <a
            href="https://linkedin.com/in/manoj-tarad-0b779625a"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 transition-transform duration-200"
          >
            <FaLinkedin className="h-6 w-6 sm:h-7 sm:w-7 text-orange-100 hover:text-orange-400" />
          </a>
          <a
            href="https://manojdev.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 transition-transform duration-200"
          >
            <User className="h-6 w-6 sm:h-7 sm:w-7 text-orange-100 hover:text-orange-400" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
