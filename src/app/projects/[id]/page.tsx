'use client';

import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { FaCalendar, FaTag, FaBuilding, FaStar, FaEdit, FaTrash, FaSpinner, FaTimes } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/Button";
import { typography, cardStyles, spacing } from "@/lib/styles";
import { toast } from "sonner";
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
  createdAt: string;
  images: Image[];
  featuredImage: Image | null;
}

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  useEffect(() => {
    fetchProject();
  }, [resolvedParams.id]);

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

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/projects/${resolvedParams.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
      
      toast.success('Project deleted successfully');
      router.push('/projects');
    } catch (error) {
      toast.error('Failed to delete project');
      console.error('Error deleting project:', error);
      setIsDeleting(false);
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
              onClick={() => router.push('/')}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#1A1A1A] py-12">
      <div className={spacing.container}>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className={`${typography.heading} text-3xl text-gray-800 dark:text-gray-200 mb-2`}>
              {project.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <FaCalendar className="text-[var(--accent-light)] dark:text-[var(--accent-dark)]" />
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
              {project.madeFor && (
                <div className="flex items-center gap-2">
                  <FaBuilding className="text-[var(--accent-light)] dark:text-[var(--accent-dark)]" />
                  <span>{project.madeFor}</span>
                </div>
              )}
              {project.featured && (
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-500" />
                  <span>Featured Project</span>
                </div>
              )}
            </div>
          </div>
          
          {session?.user && (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                icon={<FaEdit />}
                onClick={() => router.push(`/projects/${project.id}/edit`)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                icon={<FaTrash />}
                isLoading={isDeleting}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images Stack */}
            <div className="space-y-6">
              {project.images.map((image) => (
                <div
                  key={image.id}
                  className={`${cardStyles.base} overflow-hidden relative group cursor-pointer w-full`}
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="relative aspect-video">
                    <Image
                      src={image.url}
                      alt={project.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Tags */}
            <div className={`${cardStyles.base} ${cardStyles.light} dark:${cardStyles.dark} p-6`}>
              <h2 className={`${typography.heading} text-xl mb-4 text-gray-800 dark:text-gray-200`}>
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[var(--accent-light)]/10 dark:bg-[var(--accent-dark)]/10 text-[var(--accent-light)] dark:text-[var(--accent-dark)] rounded-full text-sm flex items-center gap-2"
                  >
                    <FaTag size={12} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Content */}
            <div className={`${cardStyles.base} ${cardStyles.light} dark:${cardStyles.dark} p-6`}>
              <h2 className={`${typography.heading} text-xl mb-4 text-gray-800 dark:text-gray-200`}>
                Description
              </h2>
              <div className="prose prose-sm dark:prose-invert max-w-none"
                   dangerouslySetInnerHTML={{ __html: project.body }} />
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-5xl w-full aspect-video rounded-lg overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={selectedImage.url}
              alt="Project preview"
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
              title="Close preview"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 