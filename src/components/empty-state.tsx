export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="surface-card flex flex-col items-center gap-3 px-6 py-14 text-center">
      <div className="text-lg font-bold">{title}</div>
      {description && <p className="max-w-md text-sm text-[var(--muted)]">{description}</p>}
      {action}
    </div>
  );
}
