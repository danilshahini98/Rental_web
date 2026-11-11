import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getCarForOwner } from "@/lib/data/cars";
import { updateCarAction } from "@/lib/actions/car";
import { CarForm } from "@/components/car-form";

export default async function EditCarPage({
  params,
}: {
  params: Promise<{ id: string; carId: string }>;
}) {
  const { id, carId } = await params;
  const businessId = Number(id);
  const session = await getSession();
  const car = await getCarForOwner(Number(carId), session!.ownerId);
  if (!car || car.businessId !== businessId) notFound();

  const boundUpdate = updateCarAction.bind(null, car.id, businessId);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-white">
        {car.make} {car.model}
      </h1>
      <div className="mt-5">
        <CarForm
          action={boundUpdate}
          submitLabel="Save changes"
          initial={{
            make: car.make,
            model: car.model,
            year: car.year,
            seats: car.seats,
            transmission: car.transmission,
            fuelType: car.fuelType,
            pricePerDay: car.pricePerDay,
            photoUrls: car.photos.map((p) => p.url).join("\n"),
          }}
        />
      </div>
    </div>
  );
}
