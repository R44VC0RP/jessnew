'use client';

import { Suspense } from 'react';
import { 
  FaGithub, 
  FaLinkedin, 
  FaBehance
} from "react-icons/fa";
import Link from "next/link";
import { typography } from "@/lib/styles";
import AuthSection from './AuthSection';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FaLinkedin, href: "https://www.linkedin.com/in/jessicaleehornung/", label: "LinkedIn" },
  ];

  const navLinks = [
    { href: "/", label: "Work" },
    { href: "/contact", label: "Contact" }
  ];

  return (
    <footer className="w-full bg-[#F5F5F5] dark:bg-[#1A1A1A] border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className={`${typography.heading} text-lg text-[#557187]`}>Jessica Lee</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Creative Designer & Visual Artist
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#557187] hover:text-[#445a6d] transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className={`${typography.heading} text-lg text-[#557187] mb-4`}>Navigation</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#557187] dark:hover:text-[#557187] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className={`${typography.heading} text-lg text-[#557187] mb-4`}>Contact</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Email: me@itsmejessicalee.com</li>
              <li>Location: Jacksonville, FL</li>
            </ul>
          </div>

          {/* Authentication Section */}
          <Suspense fallback={
            <div className="animate-pulse">
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          }>
            <AuthSection />
          </Suspense>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <p>© {currentYear} Jessica Lee. All rights reserved.</p>
            <p>Designed and developed with ❤️</p>
          </div>
        </div>
      </div>
    </footer>
  );
} 