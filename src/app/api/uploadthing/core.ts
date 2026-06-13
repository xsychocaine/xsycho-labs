import { ensureUploadthingToken } from "@/lib/ensure-uploadthing-token";
import { createUploadthing, type FileRouter } from "uploadthing/next";

ensureUploadthingToken();

const f = createUploadthing();

export const ourFileRouter = {
  musicUploader: f({
    audio: { maxFileSize: "64MB", maxFileCount: 5 },
    blob: { maxFileSize: "128MB", maxFileCount: 5 },
  }).onUploadComplete(async ({ file }) => {
    console.log("Upload complete:", file.ufsUrl ?? file.url);
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
