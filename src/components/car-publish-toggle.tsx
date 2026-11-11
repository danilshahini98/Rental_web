"use client";

import { PublishToggle } from "@/components/publish-toggle";
import { toggleCarPublishedAction } from "@/lib/actions/car";

export function CarPublishToggle({
  carId,
  businessId,
  isPublished,
}: {
  carId: number;
  businessId: number;
  isPublished: boolean;
}) {
  return (
    <PublishToggle
      isPublished={isPublished}
      onToggle={(next) => toggleCarPublishedAction(carId, businessId, next)}
    />
  );
}
