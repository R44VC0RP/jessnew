import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/core';
import { prisma } from '@/lib/prisma';
import { isAdminEmail } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail || !isAdminEmail(userEmail)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: {
        userEmail: userEmail
      },
      include: {
        images: true,
        featuredImage: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    console.log('Starting project creation...');
    
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    console.log('User email:', userEmail);

    if (!userEmail || !isAdminEmail(userEmail)) {
      console.log('Unauthorized access attempt');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const json = await request.json();
    console.log('Received project data:', {
      name: json.name,
      tags: json.tags,
      featured: json.featured,
      madeFor: json.madeFor,
      imageCount: json.images?.length,
      featuredImageId: json.featuredImageId
    });

    // Validate required fields
    if (!json.name || !json.body) {
      console.log('Missing required fields');
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Log image data structure
    console.log('Image data:', json.images.map((image: any) => ({
      url: image.url,
      isFavored: image.isFavored,
      id: image.id
    })));

    // First, create the project with images but without featuredImageId
    const project = await prisma.project.create({
      data: {
        name: json.name,
        body: json.body,
        tags: json.tags,
        featured: json.featured,
        madeFor: json.madeFor,
        userEmail: userEmail,
        images: {
          create: json.images.map((image: any) => ({
            url: image.url,
            isFavored: image.isFavored,
          }))
        },
      },
      include: {
        images: true,
      },
    });

    console.log('Project created with images:', {
      projectId: project.id,
      images: project.images.map(img => ({ id: img.id, url: img.url }))
    });

    // Then update the project with the featuredImageId
    if (json.featuredImageId) {
      // Find the corresponding new image that matches the URL of the featured image
      const featuredImageTemp = json.images.find((img: any) => img.id === json.featuredImageId);
      const newFeaturedImage = project.images.find(img => img.url === featuredImageTemp?.url);

      if (!newFeaturedImage) {
        console.log('Featured image not found in created images');
        return NextResponse.json(project);
      }

      console.log('Updating project with new featured image ID:', newFeaturedImage.id);

      const updatedProject = await prisma.project.update({
        where: { id: project.id },
        data: { featuredImageId: newFeaturedImage.id },
        include: {
          images: true,
          featuredImage: true,
        },
      });

      console.log('Project updated successfully:', {
        id: updatedProject.id,
        name: updatedProject.name,
        imageCount: updatedProject.images.length,
        featuredImageId: updatedProject.featuredImageId
      });

      return NextResponse.json(updatedProject);
    }

    console.log('Project created successfully:', {
      id: project.id,
      name: project.name,
      imageCount: project.images.length
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Detailed error creating project:', {
      error: error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // Return a more detailed error response
    return new NextResponse(
      JSON.stringify({
        error: 'Failed to create project',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
} 