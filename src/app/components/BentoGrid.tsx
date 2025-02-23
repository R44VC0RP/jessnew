'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaCode, FaPalette, FaLightbulb } from 'react-icons/fa';
import { IconType } from 'react-icons';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Project = {
  id: string;
  name: string;
  featured: boolean;
  createdAt: string;
  images: {
    id: string;
    url: string;
  }[];
};

type GridItem = { 
  type: 'image';
  src: string; 
  width: number;
  height: number;
  projectId: string;
};

// Update dimensions to be slightly smaller for better mobile view
const dimensions = {
  square: { width: 280, height: 280 },
  portrait: { width: 280, height: 380 },
  landscape: { width: 380, height: 280 },
  wide: { width: 580, height: 280 }
};

const fadeInUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.5 }
};

export default function BentoGrid() {
  const [imageData, setImageData] = useState<GridItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) throw new Error('Failed to fetch projects');
        
        const projects: Project[] = await response.json();
        
        // Filter for featured projects and sort by newest first
        const featuredProjects = projects
          .filter(project => project.featured)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // Create image data from featured projects
        const newImageData: GridItem[] = featuredProjects.flatMap(project => 
          project.images.map(image => {
            // Determine image dimensions based on URL patterns
            let size = dimensions.landscape; // default size
            if (image.url.includes('pdf.1.png')) {
              size = dimensions.portrait;
            } else if (image.url.includes('15.55.png') || image.url.includes('16.51.png')) {
              size = dimensions.square;
            } else if (image.url.includes('17.15.png') || image.url.includes('17.33.png')) {
              size = dimensions.wide;
            }

            return {
              type: 'image',
              src: image.url,
              width: size.width,
              height: size.height,
              projectId: project.id
            };
          })
        );

        setImageData(newImageData);
      } catch (error) {
        console.error('Error fetching featured projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProjects();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4"
      >
        {/* Hero Section - First Row */}
        <motion.div
          className="break-inside-avoid mb-4 col-span-full md:col-span-3"
          variants={fadeInUp}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Main Hero Card */}
            <div className="md:col-span-3 rounded-2xl bg-white dark:bg-[#242424] p-8 shadow-sm hover:shadow-lg transition-all duration-300">
              <h1 className="text-4xl md:text-5xl font-bold text-left mb-6 text-[var(--accent-light)] dark:text-[var(--accent-dark)] leading-tight">
                Digital Media & Graphic Design
              </h1>
              <p className="text-lg text-left text-[#4C4C4C] dark:text-[#F5F5F5] leading-relaxed">
                Creating intuitive digital experiences with a focus on user-centered design
              </p>
            </div>
          </div>
        </motion.div>

        {/* Image Grid */}
        {imageData.map((item, index) => (
          <motion.div
            key={item.src}
            className="break-inside-avoid mb-4"
            variants={fadeInUp}
          >
            <div 
              className="rounded-2xl overflow-hidden bg-white dark:bg-[#242424] shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => router.push(`/projects/${item.projectId}`)}
            >
              <div className="relative w-full">
                <Image
                  src={item.src}
                  alt={`Portfolio piece ${index + 1}`}
                  width={item.width}
                  height={item.height}
                  className="w-full h-auto scale-102 hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}