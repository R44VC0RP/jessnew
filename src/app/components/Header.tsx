'use client';

import { motion } from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaBehance,
  FaSun,
  FaMoon,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaTasks,
  FaUser
} from "react-icons/fa";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

interface HeaderProps {
  isAdmin: boolean;
}

export default function Header({ isAdmin }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { href: "/", label: "Work" },
    { href: "/contact", label: "Contact" }
  ];

  // Function to get user initials
  const getUserInitials = () => {
    if (!session?.user?.name) return "?";
    return session.user.name
      .split(" ")
      .map(name => name[0])
      .join("")
      .toUpperCase();
  };

  const socialLinks = [
    { icon: FaLinkedin, href: "https://www.linkedin.com/in/jessica-hornung-a522b428a/", label: "LinkedIn" }
  ];

  return (
    <>
      <style jsx global>{`
        ::view-transition-old {
          clip-path: inset(0 0 0 0);
        }
        ::view-transition-new {
          clip-path: inset(99% 0 0 0);
          background-color: var(--accent-light);
          animation: theme-wipe 0.5s ease-in-out forwards;
        }
        .dark ::view-transition-new {
          background-color: var(--accent-dark);
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
      <header className="w-full z-50 bg-[#F5F5F5]/80 dark:bg-[#1A1A1A]/80 backdrop-blur-sm transition-[background-color] duration-[0ms] delay-[calc(var(--theme-progress,0)*5ms)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <div className="relative h-8 w-8">
                <Image
                  src="/primary_logo.png"
                  alt="Jessica Lee Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <h1 className="text-2xl font-bold flex">
                <span className="text-[#4C4C4C] dark:text-[#F5F5F5] transition-colors duration-[0ms] delay-[calc(var(--theme-progress,0)*5ms)]">jessica</span>
                <span className="text-[var(--accent-light)] dark:text-[var(--accent-dark)]">lee</span>
              </h1>
            </Link>
          </motion.div>

          <nav className="flex items-center gap-8">
            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-[var(--accent-light)] dark:hover:text-[var(--accent-dark)] ${pathname === link.href
                      ? "text-[var(--accent-light)] dark:text-[var(--accent-dark)]"
                      : "text-[#4C4C4C] dark:text-[#F5F5F5]"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Theme Toggle, User Profile & Social Links */}
            <div className="flex items-center gap-4">
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
                className="rounded-full hover:bg-[var(--accent-light)]/10 dark:hover:bg-[var(--accent-dark)]/10 transition-all duration-300 text-[var(--accent-light)] dark:text-[var(--accent-dark)]"
                aria-label="Toggle theme"
              >
                {mounted && (
                  theme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />
                )}
              </button>

              {/* Social Links */}
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--accent-light)] hover:text-[var(--accent-dark)] dark:text-[var(--accent-dark)] dark:hover:text-[var(--accent-light)] transition-colors duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon size={24} />
                  </motion.a>
                ))}
              </div>

              {/* User Profile Dropdown */}
              {session?.user && (
                <div suppressHydrationWarning>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none">
                      <div className="relative group">
                        {session.user.image ? (
                          <div className="h-8 w-8 rounded-full overflow-hidden hover:ring-2 hover:ring-[var(--accent-light)] dark:hover:ring-[var(--accent-dark)] transition-all">
                            <Image
                              src={session.user.image}
                              alt={session.user.name || "User"}
                              width={32}
                              height={32}
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-[var(--accent-light)] dark:bg-[var(--accent-dark)] text-white flex items-center justify-center text-sm font-medium hover:ring-2 hover:ring-[var(--accent-light)] dark:hover:ring-[var(--accent-dark)] transition-all">
                            {getUserInitials()}
                          </div>
                        )}
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{session.user.name}</p>
                          <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer">
                        <FaUser className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push('/projects')} className="cursor-pointer">
                        <FaTasks className="mr-2 h-4 w-4" />
                        <span>Manage Projects</span>
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem onClick={() => router.push('/settings')} className="cursor-pointer">
                        <FaCog className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem> */}
                      {/* <DropdownMenuSeparator /> */}
                      <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-red-600 dark:text-red-400">
                        <FaSignOutAlt className="mr-2 h-4 w-4" />
                        <span>Sign Out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>
    </>
  );
} 