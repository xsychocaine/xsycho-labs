import { ensureUploadthingToken } from "@/lib/ensure-uploadthing-token";
import { attachFileToOrder } from "@/lib/orders";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";

ensureUploadthingToken();

const f = createUploadthing();

const uploadInput = z.object({
  sessionId: z.string().optional(),
  email: z.string().optional(),
});

export const ourFileRouter = {
  musicUploader: f({
    audio: { maxFileSize: "64MB", maxFileCount: 5 },
    blob: { maxFileSize: "128MB", maxFileCount: 5 },
  })
    .input(uploadInput)
    .middleware(async ({ input }) => ({
      sessionId: input.sessionId?.trim() || undefined,
      email: input.email?.trim().toLowerCase() || undefined,
    }))
    .onUploadComplete(async ({ metadata, file }) => {
      await attachFileToOrder({
        sessionId: metadata.sessionId,
        email: metadata.email,
        file: {
          name: file.name,
          url: file.ufsUrl ?? file.url,
          key: file.key,
        },
      });
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
