'use client';

import { useSession } from "next-auth/react";
import { FaUser, FaEnvelope, FaImage } from "react-icons/fa";
import Image from "next/image";
import { typography } from "@/lib/styles";
import { Button } from "@/app/components/ui/Button";
import { useState } from "react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!session?.user) {
    return null;
  }

  const handlePhotoChange = () => {
    setIsPhotoLoading(true);
    // Add your photo change logic here
    setTimeout(() => setIsPhotoLoading(false), 1000);
  };

  const handleSave = () => {
    setIsSaving(true);
    // Add your save logic here
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#1A1A1A] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-8">
          <h1 className={`${typography.heading} text-3xl text-[var(--accent-light)] dark:text-[var(--accent-dark)]`}>Profile</h1>
          {isEditing && (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                isLoading={isSaving}
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-[#242424] rounded-2xl p-8 shadow-sm mb-8">
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
              <Button
                variant="secondary"
                size="sm"
                icon={<FaImage />}
                onClick={handlePhotoChange}
                isLoading={isPhotoLoading}
              >
                Change Photo
              </Button>
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

              {!isEditing && (
                <div className="pt-4">
                  <Button
                    variant="primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white dark:bg-[#242424] rounded-2xl p-8 shadow-sm">
          <h2 className={`${typography.heading} text-xl text-[var(--accent-light)] dark:text-[var(--accent-dark)] mb-6`}>Account Settings</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">Email Notifications</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive email updates about your account</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--accent-light)] dark:peer-checked:bg-[var(--accent-dark)]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security to your account</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--accent-light)] dark:peer-checked:bg-[var(--accent-dark)]"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 