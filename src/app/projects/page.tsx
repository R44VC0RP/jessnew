'use client';

import { useSession } from "next-auth/react";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import Image from "next/image";
import { typography } from "@/lib/styles";
import { Button } from "@/app/components/ui/Button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

export default function ProjectsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      toast.error('Failed to load projects');
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    setDeleteLoading(projectId);
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
      
      toast.success('Project deleted successfully');
      fetchProjects(); // Refresh the list
    } catch (error) {
      toast.error('Failed to delete project');
      console.error('Error deleting project:', error);
    } finally {
      setDeleteLoading(null);
    }
  };

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#1A1A1A] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className={`${typography.heading} text-3xl text-[var(--accent-light)] dark:text-[var(--accent-dark)]`}>Projects</h1>
          <Button
            variant="primary"
            icon={<FaPlus />}
            onClick={() => router.push('/projects/new')}
          >
            New Project
          </Button>
        </div>

        {isLoading ? (
          // Loading skeleton
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white dark:bg-[#242424] rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          // Empty state
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">No projects yet</p>
            <Button
              variant="secondary"
              icon={<FaPlus />}
              onClick={() => router.push('/projects/new')}
            >
              Create your first project
            </Button>
          </div>
        ) : (
          // Project Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white dark:bg-[#242424] rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md"
              >
                {/* Project Image */}
                <div className="relative h-48 w-full">
                  <div className="absolute top-2 right-2 z-10 bg-white dark:bg-[#242424] px-2 py-1 rounded-full text-xs font-medium">
                    {project.featured ? (
                      <span className="text-yellow-600">Featured</span>
                    ) : (
                      <span className="text-gray-600">Draft</span>
                    )}
                  </div>
                  {(project.featuredImage || project.images[0]) && (
                    <Image
                      src={project.featuredImage?.url || project.images[0].url}
                      alt={project.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <h3 className={`${typography.heading} text-lg mb-2 text-gray-800 dark:text-gray-200`}>
                    {project.name}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-[var(--accent-light)]/10 dark:bg-[var(--accent-dark)]/10 text-[var(--accent-light)] dark:text-[var(--accent-dark)] rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Project Actions */}
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<FaEye />}
                        iconOnly
                        title="View"
                        onClick={() => router.push(`/projects/${project.id}`)}
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<FaEdit />}
                        iconOnly
                        title="Edit"
                        onClick={() => router.push(`/projects/${project.id}/edit`)}
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        icon={<FaTrash />}
                        iconOnly
                        isLoading={deleteLoading === project.id}
                        onClick={() => handleDelete(project.id)}
                        title="Delete"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 