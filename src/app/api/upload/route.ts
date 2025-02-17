import { createRouteHandler } from "uploadthing/next";
import { UTApi } from "uploadthing/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/core";
import { isAdminEmail } from "@/lib/auth";

const utapi = new UTApi();

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail || !isAdminEmail(userEmail)) {
      return new Response("Unauthorized", { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (files.length === 0) {
      return new Response("No files provided", { status: 400 });
    }

    const uploadedFiles = await utapi.uploadFiles(files);
    
    // Filter out failed uploads and map to a simpler response format
    const successfulUploads = uploadedFiles
      .filter(file => file.data !== null && file.error === null)
      .map(file => ({
        url: file.data?.ufsUrl || "",
      }));

    if (successfulUploads.length === 0) {
      return new Response("No files were successfully uploaded", { status: 400 });
    }

    return new Response(JSON.stringify(successfulUploads), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to upload files" }), 
      { 
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
} 