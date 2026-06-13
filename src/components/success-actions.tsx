"use client";

import { PluginControl } from "@/components/console-ui";
import { useSearchParams } from "next/navigation";

export function SuccessActions() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const submitHref = sessionId
    ? `/submit-files?session_id=${encodeURIComponent(sessionId)}`
    : "/submit-files";

  return (
    <div className="flex flex-col gap-3 border-t border-white/[0.06] pt-6 sm:flex-row sm:flex-wrap">
      <PluginControl href={submitHref} moduleId="IN · FILES">
        Upload Your Files
      </PluginControl>
      <PluginControl href="/" variant="secondary" moduleId="HOME">
        Back to Home
      </PluginControl>
    </div>
  );
}
