'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ProjectForm } from "@/app/components/ProjectForm";
import { toast } from "sonner";
import { prisma } from "@/lib/prisma";

export default function NewProjectPage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session?.user?.email) {
    return null;
  }

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          userEmail: session.user?.email
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      const result = await response.json();
      router.push(`/projects/${result.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#1A1A1A] ">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[var(--accent-light)] dark:text-[var(--accent-dark)] mb-8">
          Create New Project
        </h1>
        <ProjectForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
} 