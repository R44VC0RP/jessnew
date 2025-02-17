import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/core";
import { isAdminEmail } from "@/lib/auth";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 10,
    },
  })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const session = await getServerSession(authOptions);
      const userEmail = session?.user?.email;

      // If you throw, the user will not be able to upload
      if (!userEmail || !isAdminEmail(userEmail)) {
        throw new UploadThingError("Unauthorized - Admin only");
      }

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userEmail };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for user:", metadata.userEmail);
      console.log("file url", file.url);

      return { uploadedBy: metadata.userEmail, url: file.url };
    }),

  // Project image uploader with different rules
  projectImage: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const session = await getServerSession(authOptions);
      const userEmail = session?.user?.email;

      if (!userEmail || !isAdminEmail(userEmail)) {
        throw new UploadThingError("Unauthorized - Admin only");
      }

      return { userEmail };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Project image upload complete for user:", metadata.userEmail);
      console.log("file url", file.url);

      return { uploadedBy: metadata.userEmail, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
