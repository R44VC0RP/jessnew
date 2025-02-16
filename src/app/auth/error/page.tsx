import Link from "next/link";
import { FaExclamationTriangle } from "react-icons/fa";
import { typography, cardStyles, rules } from "@/lib/styles";

export default function AuthError() {
  return (
    <div className={`min-h-screen bg-[#F5F5F5] dark:bg-[#1A1A1A] ${typography.body} flex items-center justify-center`}>
      <div className={`${cardStyles.base} ${cardStyles.hover} p-8 w-full max-w-md dark:bg-[#242424] bg-white`}>
        <div className="text-center">
          <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
          <h1 className={`${typography.heading} text-2xl mb-4 text-red-500`}>
            Authentication Error
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You are not authorized to access this area. Please contact the administrator if you believe this is a mistake.
          </p>

          <Link href="/" className={rules.buttons.secondary}>
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 