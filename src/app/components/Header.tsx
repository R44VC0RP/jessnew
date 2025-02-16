'use client';

import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaBehance, FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <style jsx global>{`
        ::view-transition-old {
          clip-path: inset(0 0 0 0);
        }
        ::view-transition-new {
          clip-path: inset(99% 0 0 0);
          background-color: #557187;
          animation: theme-wipe 0.5s ease-in-out forwards;
        }
        @keyframes theme-wipe {
          0% {
            clip-path: inset(99% 0 0 0);
          }
          100% {
            clip-path: inset(0 0 0 0);
          }
        }
      `}</style>
      <header className="fixed top-0 w-full z-50 bg-[#F5F5F5]/80 dark:bg-[#1A1A1A]/80 backdrop-blur-sm transition-[background-color] duration-[0ms] delay-[calc(var(--theme-progress,0)*5ms)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative h-8 w-8">
              <Image
                src="/primary_logo.png"
                alt="Jessica Lee Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-2xl font-bold flex ">
              <span className="text-[#1A1A1A] dark:text-[#F5F5F5] transition-colors duration-[0ms] delay-[calc(var(--theme-progress,0)*5ms)]">jessica</span>
              <span className="text-[#557187]">lee</span>
            </h1>
          </motion.div>
          <nav className="flex items-center gap-6">
            <button
              onClick={() => {
                if (document.startViewTransition) {
                  document.startViewTransition(() => {
                    setTheme(theme === 'dark' ? 'light' : 'dark');
                  });
                } else {
                  setTheme(theme === 'dark' ? 'light' : 'dark');
                }
              }}
              className="p-2 rounded-full hover:bg-[#557187]/10 transition-all duration-300 text-[#557187]"
              aria-label="Toggle theme"
            >
              {mounted && (
                theme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />
              )}
            </button>
            <div className="flex gap-4">
              {[FaGithub, FaLinkedin, FaBehance].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="text-[#557187] hover:text-[#445a6d] transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={24} />
                </motion.a>
              ))}
            </div>
          </nav>
        </div>
      </header>
    </>
  );
} 