"use client";

import { useState, useTransition } from "react";

export function PublishToggle({
  isPublished,
  onToggle,
}: {
  isPublished: boolean;
  onToggle: (next: boolean) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            try {
              await onToggle(!isPublished);
            } catch (e) {
              setError(e instanceof Error ? e.message : "Couldn't update.");
            }
          });
        }}
        className="rounded-full px-3 py-1 text-xs font-bold"
        style={{
          background: isPublished ? "var(--success-bg)" : "var(--surface-muted)",
          color: isPublished ? "var(--success)" : "#55585f",
        }}
      >
        {pending ? "…" : isPublished ? "Published" : "Unpublished"}
      </button>
      {error && <p className="max-w-[160px] text-right text-[11px] text-[var(--danger)]">{error}</p>}
    </div>
  );
}
