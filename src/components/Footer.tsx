"use client";

import React from 'react'
import { ChefHat } from 'lucide-react'
import { RiGithubLine } from 'react-icons/ri'
import { FaLinkedin } from 'react-icons/fa'

const Footer = () => {
  return (
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
  );
}

export default Footer