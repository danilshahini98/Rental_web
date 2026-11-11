import { BusinessForm } from "@/components/business-form";
import { createBusinessAction } from "@/lib/actions/business";

export default function NewBusinessPage() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-white">Add a business</h1>
      <p className="mt-1.5 text-sm text-[var(--page-ink-muted)]">
        It stays hidden from the public site until you publish it.
      </p>
      <div className="mt-5">
        <BusinessForm action={createBusinessAction} submitLabel="Create business" />
      </div>
    </div>
  );
}
