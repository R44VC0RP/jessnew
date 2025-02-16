import { getServerSession } from "next-auth";
import { FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { redirect } from "next/navigation";
import Link from "next/link";
import { typography, spacing, cardStyles, rules } from "@/lib/styles";

export default async function AdminDashboard() {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className={`min-h-screen bg-[#F5F5F5] dark:bg-[#1A1A1A] ${typography.body}`}>
      <div className={spacing.container}>
        <div className="py-8">
          <h1 className={`${typography.heading} text-3xl mb-6 text-[#557187]`}>
            Admin Dashboard
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className={`${cardStyles.base} ${cardStyles.hover} p-6 dark:bg-[#242424] bg-white`}>
              <div className="flex items-center space-x-4">
                <FaUser className="text-2xl text-[#557187]" />
                <div>
                  <h2 className="font-semibold">Profile</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {session.user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Settings Card */}
            <div className={`${cardStyles.base} ${cardStyles.hover} p-6 dark:bg-[#242424] bg-white`}>
              <div className="flex items-center space-x-4">
                <FaCog className="text-2xl text-[#557187]" />
                <div>
                  <h2 className="font-semibold">Settings</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Manage your preferences
                  </p>
                </div>
              </div>
            </div>

            {/* Logout Card */}
            <Link 
              href="/api/auth/signout"
              className={`${cardStyles.base} ${cardStyles.hover} p-6 dark:bg-[#242424] bg-white`}
            >
              <div className="flex items-center space-x-4">
                <FaSignOutAlt className="text-2xl text-[#557187]" />
                <div>
                  <h2 className="font-semibold">Sign Out</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    End your session
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Content Section */}
          <div className={`${cardStyles.base} mt-8 p-6 dark:bg-[#242424] bg-white`}>
            <h2 className={`${typography.heading} text-xl mb-4`}>Quick Actions</h2>
            <div className="space-y-4">
              <button className={rules.buttons.primary}>
                Update Content
              </button>
              <button className={rules.buttons.secondary}>
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 