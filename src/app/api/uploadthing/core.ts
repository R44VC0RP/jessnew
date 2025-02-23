import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/core";
import { isAdminEmail } from "@/lib/auth";

const f = createUploadthing();

const auth = async () => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email || !isAdminEmail(session.user.email)) {
    throw new UploadThingError("Unauthorized");
  }
  return { email: session.user.email };
};

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
    .middleware(async () => {
      const { email } = await auth();
      return { email };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for user:", metadata.email);
      console.log("File URL:", file.ufsUrl);
      return { uploadedBy: metadata.email, url: file.ufsUrl };
    }),

  // Project image uploader with different rules
  projectImage: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const { email } = await auth();
      return { email };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Project image upload complete for user:", metadata.email);
      console.log("File URL:", file.ufsUrl);
      return { uploadedBy: metadata.email, url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
