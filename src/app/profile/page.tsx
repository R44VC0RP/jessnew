'use client';

import { useSession } from "next-auth/react";
import { FaUser, FaEnvelope } from "react-icons/fa";
import Image from "next/image";
import { typography } from "@/lib/styles";

export default function ProfilePage() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#1A1A1A] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className={`${typography.heading} text-3xl text-[var(--accent-light)] dark:text-[var(--accent-dark)] mb-8`}>Profile</h1>

        {/* Profile Card */}
        <div className="bg-white dark:bg-[#242424] rounded-2xl p-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Profile Image */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-[var(--accent-light)]/10 dark:border-[var(--accent-dark)]/10">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "Profile"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[var(--accent-light)] dark:bg-[var(--accent-dark)] flex items-center justify-center text-white text-3xl">
                    {session.user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Profile Information */}
            <div className="flex-1 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Name
                </label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#1A1A1A] rounded-lg">
                  <FaUser className="text-[var(--accent-light)] dark:text-[var(--accent-dark)]" />
                  <span className="text-gray-800 dark:text-gray-200">
                    {session.user.name}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Email
                </label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#1A1A1A] rounded-lg">
                  <FaEnvelope className="text-[var(--accent-light)] dark:text-[var(--accent-dark)]" />
                  <span className="text-gray-800 dark:text-gray-200">
                    {session.user.email}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 