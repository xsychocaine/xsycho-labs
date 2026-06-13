/** UploadThing v7 expects UPLOADTHING_TOKEN; build it from legacy env vars if needed. */
export function ensureUploadthingToken() {
  if (process.env.UPLOADTHING_TOKEN?.trim()) return;

  const apiKey = process.env.UPLOADTHING_SECRET?.trim();
  const appId = process.env.UPLOADTHING_APP_ID?.trim();
  if (!apiKey || !appId) return;

  // Default app region is sea1 (US West - Seattle). Must match your UploadThing dashboard.
  const region = process.env.UPLOADTHING_REGION?.trim() ?? "sea1";

  process.env.UPLOADTHING_TOKEN = Buffer.from(
    JSON.stringify({ apiKey, appId, regions: [region] }),
  ).toString("base64");
}
