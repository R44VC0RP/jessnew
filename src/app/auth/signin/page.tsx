import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { FaGoogle } from "react-icons/fa";
import { typography, spacing, cardStyles, rules } from "@/lib/styles";

export default async function SignIn() {
  const session = await getServerSession();

  if (session) {
    redirect("/admin");
  }

  return (
    <div className={`min-h-screen bg-[#F5F5F5] dark:bg-[#1A1A1A] ${typography.body} flex items-center justify-center`}>
      <div className={`${cardStyles.base} ${cardStyles.hover} p-8 w-full max-w-md dark:bg-[#242424] bg-white`}>
        <h1 className={`${typography.heading} text-2xl mb-6 text-center text-[#557187]`}>
          Admin Sign In
        </h1>
        
        <div className="space-y-4">
          <a
            href="/api/auth/signin/google"
            className={`${rules.buttons.primary} w-full flex items-center justify-center space-x-2`}
          >
            <FaGoogle className="text-xl" />
            <span>Sign in with Google</span>
          </a>
          
          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            Only authorized administrators can access this area
          </p>
        </div>
      </div>
    </div>
  );
} 