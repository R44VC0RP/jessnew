'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { rules, typography } from "@/lib/styles";
import { isAdminEmail } from "@/lib/auth";

export default function AuthSection() {
  const { data: session } = useSession();
  const router = useRouter();
  const isAdmin = isAdminEmail(session?.user?.email);

  return (
    <div suppressHydrationWarning>
      <h3 className={`${typography.heading} text-lg text-[#557187] mb-4`}>Account</h3>
      <div className="space-y-2">
        {session ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Signed in as {session.user?.email}
            </p>
            <div className="flex flex-col gap-2">
              {isAdmin && (
                <button
                  onClick={() => router.push('/admin')}
                  className={`${rules.buttons.secondary} !py-1.5 !px-4 text-sm flex items-center gap-2 w-fit`}
                >
                  <FaUser size={16} />
                  <span>Admin</span>
                </button>
              )}
              <button
                onClick={() => signOut()}
                className={`${rules.buttons.secondary} !py-1.5 !px-4 text-sm flex items-center gap-2 w-fit`}
              >
                <FaSignOutAlt size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => signIn('google')}
            className={`${rules.buttons.secondary} !py-1.5 !px-4 text-sm w-fit`}
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
}