'use client';

import BentoGrid from "./components/BentoGrid";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-[#F5F5F5] transition-[background-color,color] duration-[0ms] delay-[calc(var(--theme-progress,0)*5ms)]">
      <main className="pt-32">
        <BentoGrid />
      </main>
    </div>
  );
}
