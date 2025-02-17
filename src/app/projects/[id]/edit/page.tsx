'use client';

import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ProjectForm } from "@/app/components/ProjectForm";
import { FaSpinner, FaArrowLeft } from "react-icons/fa";
import { toast } from "sonner";
import { typography, spacing, cardStyles } from "@/lib/styles";
import { Button } from "@/app/components/ui/Button";
import { use } from 'react';

interface Image {
  id: string;
  url: string;
  isFavored: boolean;
}

interface Project {
  id: string;
  name: string;
  body: string;
  tags: string[];
  featured: boolean;
  madeFor: string | null;
  images: Image[];
  featuredImage: Image | null;
  featuredImageId: string | null;
}

interface FormData {
  id?: string;
  name: string;
  body: string;
  tags: string[];
  featured: boolean;
  madeFor: string | null;
  images: Image[];
  featuredImageId: string;
}

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user) {
      router.push('/auth/signin');
      return;
    }
    fetchProject();
  }, [resolvedParams.id, status, session]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${resolvedParams.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch project');
      }
      const data = await response.json();
      setProject(data);
    } catch (error) {
      toast.error('Failed to load project');
      console.error('Error loading project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: FormData) => {
    try {
      const response = await fetch(`/api/projects/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          userEmail: session?.user?.email
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update project');
      }

      toast.success('Project updated successfully');
      router.push(`/projects/${resolvedParams.id}`);
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#1A1A1A] py-12">
        <div className={spacing.container}>
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="w-8 h-8 text-[var(--accent-light)] dark:text-[var(--accent-dark)] animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#1A1A1A] py-12">
        <div className={spacing.container}>
          <div className="text-center">
            <h1 className={`${typography.heading} text-2xl text-gray-800 dark:text-gray-200 mb-4`}>
              Project not found
            </h1>
            <Button
              variant="secondary"
              onClick={() => router.push('/projects')}
            >
              Back to Projects
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formData: FormData = {
    id: project.id,
    name: project.name,
    body: project.body,
    tags: project.tags,
    featured: project.featured,
    madeFor: project.madeFor,
    images: project.images,
    featuredImageId: project.featuredImageId || ''
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#1A1A1A] py-12">
      <div className={spacing.container}>
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="secondary"
            icon={<FaArrowLeft />}
            onClick={() => router.push(`/projects/${project.id}`)}
            className="mb-4"
          >
            Back to Project
          </Button>
          <div className="flex items-center justify-between">
            <h1 className={`${typography.heading} text-3xl text-gray-800 dark:text-gray-200`}>
              Edit Project
            </h1>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Make changes to your project and save them when you're ready.
          </p>
        </div>

        {/* Form Section */}
        <div className={`${cardStyles.base} ${cardStyles.light} dark:${cardStyles.dark} p-6`}>
          <ProjectForm
            initialData={formData}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
} 