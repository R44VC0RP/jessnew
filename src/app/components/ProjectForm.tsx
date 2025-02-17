'use client';

import { useState, useRef } from 'react';
import { FaPlus, FaImage, FaTimes, FaStar, FaUpload, FaSpinner, FaExpand } from 'react-icons/fa';
import { Button } from './ui/Button';
import Image from 'next/image';
import { toast } from 'sonner';
import { typography, cardStyles } from '@/lib/styles';
import type { OurFileRouter } from "@/app/api/uploadthing/core";

interface ProjectImage {
  id: string;
  url: string;
  isFavored: boolean;
}

interface ProjectFormData {
  name: string;
  body: string;
  tags: string[];
  featured: boolean;
  madeFor: string | null;
  images: ProjectImage[];
  featuredImageId: string;
}

interface ProjectFormProps {
  initialData?: ProjectFormData & { id?: string };
  onSubmit: (data: ProjectFormData) => Promise<void>;
}

export function ProjectForm({ initialData, onSubmit }: ProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: initialData?.name || '',
    body: initialData?.body || '',
    tags: initialData?.tags || [],
    featured: initialData?.featured || false,
    madeFor: initialData?.madeFor || null,
    images: initialData?.images || [],
    featuredImageId: initialData?.featuredImageId || ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<ProjectImage | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      toast.error('Please add at least one image');
      return;
    }
    if (!formData.featuredImageId) {
      toast.error('Please select a featured image');
      return;
    }
    if (!formData.name.trim()) {
      toast.error('Please enter a project name');
      return;
    }
    if (!formData.body.trim()) {
      toast.error('Please add project content');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      toast.success('Project saved successfully');
    } catch (error) {
      toast.error('Failed to save project');
      console.error('Error saving project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (res: { url: string }[]) => {
    const newImages = res.map((file) => ({
      id: crypto.randomUUID(),
      url: file.url,
      isFavored: false
    }));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const removeImage = (id: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== id),
      featuredImageId: prev.featuredImageId === id ? '' : prev.featuredImageId
    }));
  };

  const setFeaturedImage = (id: string) => {
    setFormData(prev => ({
      ...prev,
      featuredImageId: id
    }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;
    
    await handleFileUpload(files);
  };

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No files were uploaded successfully');
      }

      handleImageUpload(data);
      toast.success(`Successfully uploaded ${data.length} image${data.length === 1 ? '' : 's'}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload images');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Project Images */}
      <div className="space-y-4">
        <h2 className={`${typography.heading} text-xl text-[#557187]`}>Project Images</h2>
        
        {/* Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          {formData.images.map((image) => (
            <div 
              key={image.id} 
              className="relative aspect-square rounded-lg overflow-hidden group hover:shadow-lg transition-all duration-300"
              onClick={() => setFeaturedImage(image.id)}
            >
              <Image
                src={image.url}
                alt="Project"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-2 right-2 flex gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewImage(image);
                    }}
                    className="p-2 bg-[#557187] text-white rounded-full hover:opacity-80 transition-opacity"
                    title="Preview image"
                  >
                    <FaExpand />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(image.id);
                    }}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="Remove image"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
              {formData.featuredImageId === image.id && (
                <div className="absolute top-2 right-2">
                  <FaStar className="text-yellow-500" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Upload Area */}
        <div 
          className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileUpload(Array.from(e.target.files || []))}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center gap-4 cursor-pointer"
          >
            {isUploading ? (
              <>
                <FaSpinner className="w-8 h-8 text-[#557187] animate-spin" />
                <p className="text-gray-600 dark:text-gray-400">Uploading images...</p>
              </>
            ) : (
              <>
                <FaUpload className="w-8 h-8 text-[#557187]" />
                <div>
                  <p className="text-lg font-medium text-[#557187]">
                    Drop images here or click to upload
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Supports: JPG, PNG, WebP • Max size: 4MB
                  </p>
                </div>
              </>
            )}
          </label>
        </div>
      </div>

      {/* Project Details */}
      <div className="space-y-4">
        <h2 className={`${typography.heading} text-xl text-[#557187]`}>Project Details</h2>
        
        {/* Project Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Project Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-3 bg-white dark:bg-[#242424] rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#557187] focus:border-transparent"
            placeholder="Enter project name"
            required
          />
        </div>

        {/* Project Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Project Description
          </label>
          <textarea
            value={formData.body}
            onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
            className="w-full p-3 bg-white dark:bg-[#242424] rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#557187] focus:border-transparent min-h-[200px]"
            placeholder="Describe your project..."
            required
          />
        </div>

        {/* Made For */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Made For (Optional)
          </label>
          <input
            type="text"
            value={formData.madeFor || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, madeFor: e.target.value as string | null }))}
            className="w-full p-3 bg-white dark:bg-[#242424] rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#557187] focus:border-transparent"
            placeholder="Client or company name"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    tags: prev.tags.filter((_, i) => i !== index)
                  }))}
                  className="text-red-500 hover:text-red-600"
                >
                  <FaTimes size={14} />
                </button>
              </div>
            ))}
            <input
              type="text"
              placeholder="Add tag..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const value = (e.target as HTMLInputElement).value.trim();
                  if (value) {
                    setFormData(prev => ({
                      ...prev,
                      tags: [...prev.tags, value]
                    }));
                    (e.target as HTMLInputElement).value = '';
                  }
                }
              }}
              className="px-3 py-1 bg-white dark:bg-[#242424] rounded-full border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#557187] focus:border-transparent"
            />
          </div>
        </div>

        {/* Featured Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
            className="w-4 h-4 text-[#557187] border-gray-300 rounded focus:ring-[#557187]"
          />
          <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Feature this project
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          type="submit"
          isLoading={isSubmitting}
        >
          {initialData ? 'Update Project' : 'Create Project'}
        </Button>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="relative max-w-5xl w-full aspect-[16/9] rounded-lg overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={previewImage.url}
              alt="Project preview"
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
              title="Close preview"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </form>
  );
} 