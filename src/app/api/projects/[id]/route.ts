import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/core';
import { prisma } from '@/lib/prisma';
import { isAdminEmail } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        images: true,
        featuredImage: true
      }
    });

    if (!project) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }

    return Response.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail || !isAdminEmail(userEmail)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the project belongs to the user
    const existingProject = await prisma.project.findUnique({
      where: { id },
      select: { userEmail: true }
    });

    if (!existingProject) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }

    if (existingProject.userEmail !== userEmail) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();

    // Update the project
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        name: json.name,
        body: json.body,
        tags: json.tags,
        featured: json.featured,
        madeFor: json.madeFor,
        featuredImageId: json.featuredImageId || null,
        updatedAt: new Date(),
        images: {
          deleteMany: {}, // Remove all existing images
          create: json.images.map((image: any) => ({
            url: image.url,
            isFavored: image.isFavored,
          }))
        }
      },
      include: {
        images: true,
        featuredImage: true,
      },
    });

    return Response.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail || !isAdminEmail(userEmail)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the project belongs to the user
    const project = await prisma.project.findUnique({
      where: { id },
      select: { userEmail: true }
    });

    if (!project) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }

    if (project.userEmail !== userEmail) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete the project (this will cascade delete images due to the schema setup)
    await prisma.project.delete({
      where: { id }
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting project:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 