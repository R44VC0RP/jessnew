'use client';

import { useSession } from "next-auth/react";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import Image from "next/image";
import { typography } from "@/lib/styles";
import { Button } from "@/app/components/ui/Button";
import { useState } from "react";

type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  status: 'draft' | 'published';
  date: string;
};

// Mock data - replace with actual data fetching
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Brand Identity Design',
    description: 'Complete brand identity design including logo, color palette, and typography.',
    image: '/project-1.jpg',
    status: 'published',
    date: '2024-02-15',
  },
  {
    id: '2',
    title: 'Website Redesign',
    description: 'Modern website redesign with improved user experience and responsive design.',
    image: '/project-2.jpg',
    status: 'draft',
    date: '2024-02-10',
  },
  // Add more mock projects as needed
];

export default function ProjectsPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  if (!session?.user) {
    return null;
  }

  const handleNewProject = () => {
    setIsLoading(true);
    // Add your new project logic here
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleDelete = (projectId: string) => {
    setDeleteLoading(projectId);
    // Add your delete logic here
    setTimeout(() => setDeleteLoading(null), 1000);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#1A1A1A] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className={`${typography.heading} text-3xl text-[var(--accent-light)] dark:text-[var(--accent-dark)]`}>Projects</h1>
          <Button
            variant="primary"
            icon={<FaPlus />}
            onClick={handleNewProject}
            isLoading={isLoading}
          >
            New Project
          </Button>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-[#242424] rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md"
            >
              {/* Project Image */}
              <div className="relative h-48 w-full">
                <div className="absolute top-2 right-2 z-10 bg-white dark:bg-[#242424] px-2 py-1 rounded-full text-xs font-medium">
                  {project.status === 'published' ? (
                    <span className="text-green-600">Published</span>
                  ) : (
                    <span className="text-yellow-600">Draft</span>
                  )}
                </div>
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Project Info */}
              <div className="p-6">
                <h3 className={`${typography.heading} text-lg mb-2 text-gray-800 dark:text-gray-200`}>
                  {project.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {project.description}
                </p>
                
                {/* Project Actions */}
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    {new Date(project.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<FaEye />}
                      iconOnly
                      title="View"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<FaEdit />}
                      iconOnly
                      title="Edit"
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
      </div>
    </div>
  );
} 