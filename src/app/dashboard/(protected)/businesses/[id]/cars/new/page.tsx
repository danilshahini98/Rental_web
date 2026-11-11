import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getBusinessByIdForOwner } from "@/lib/data/businesses";
import { createCarAction } from "@/lib/actions/car";
import { CarForm } from "@/components/car-form";

export default async function NewCarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const businessId = Number(id);
  const session = await getSession();
  const business = await getBusinessByIdForOwner(businessId, session!.ownerId);
  if (!business) notFound();

  const boundCreate = createCarAction.bind(null, businessId);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-white">Add a car to {business.name}</h1>
      <div className="mt-5">
        <CarForm action={boundCreate} submitLabel="Add car" />
      </div>
    </div>
  );
}
