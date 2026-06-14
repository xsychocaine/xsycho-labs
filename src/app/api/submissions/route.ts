import { saveSubmission, type SubmissionFile } from "@/lib/orders";
import { NextResponse } from "next/server";

function parseFiles(value: unknown): SubmissionFile[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const file = item as Record<string, unknown>;
    const name = typeof file.name === "string" ? file.name : "";
    const url =
      typeof file.url === "string"
        ? file.url
        : typeof file.ufsUrl === "string"
          ? file.ufsUrl
          : "";
    const key = typeof file.key === "string" ? file.key : undefined;

    if (!name || !url) return [];
    return [{ name, url, key }];
  });
}

function parseOptionalString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      email?: unknown;
      name?: unknown;
      notes?: unknown;
      sessionId?: unknown;
      serviceType?: unknown;
      bpm?: unknown;
      trackKey?: unknown;
      referenceNotes?: unknown;
      generalNotes?: unknown;
      files?: unknown;
    };

    const email = parseOptionalString(body.email);
    const name = parseOptionalString(body.name);
    const sessionId = parseOptionalString(body.sessionId) || undefined;
    const serviceType = parseOptionalString(body.serviceType) || null;
    const bpm = parseOptionalString(body.bpm) || null;
    const trackKey = parseOptionalString(body.trackKey) || null;
    const referenceNotes = parseOptionalString(body.referenceNotes) || null;
    const generalNotes =
      parseOptionalString(body.generalNotes) ||
      parseOptionalString(body.notes) ||
      null;
    const files = parseFiles(body.files);

    if (!email || !name) {
      return NextResponse.json(
        { error: "email and name are required" },
        { status: 400 },
      );
    }

    if (files.length === 0) {
      return NextResponse.json(
        { error: "At least one uploaded file is required" },
        { status: 400 },
      );
    }

    const result = await saveSubmission({
      email,
      name,
      files,
      sessionId,
      serviceType,
      bpm,
      trackKey,
      referenceNotes,
      generalNotes,
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to save submission";
    console.error("[submissions]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
