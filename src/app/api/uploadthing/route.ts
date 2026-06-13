import { ensureUploadthingToken } from "@/lib/ensure-uploadthing-token";
import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

ensureUploadthingToken();

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});