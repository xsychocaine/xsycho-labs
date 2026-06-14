export type OrderFileRecord = {
  name: string;
  url: string;
  key?: string;
};

export function parseOrderFileUrls(value: unknown): OrderFileRecord[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const file = item as Record<string, unknown>;
    const name = typeof file.name === "string" ? file.name : "";
    const url = typeof file.url === "string" ? file.url : "";
    const key = typeof file.key === "string" ? file.key : undefined;
    if (!url) return [];
    return [{ name: name || "File", url, key }];
  });
}
