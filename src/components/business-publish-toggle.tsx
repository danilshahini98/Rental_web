"use client";

import { PublishToggle } from "@/components/publish-toggle";
import { toggleBusinessPublishedAction } from "@/lib/actions/business";

export function BusinessPublishToggle({
  businessId,
  isPublished,
}: {
  businessId: number;
  isPublished: boolean;
}) {
  return (
    <PublishToggle
      isPublished={isPublished}
      onToggle={(next) => toggleBusinessPublishedAction(businessId, next)}
    />
  );
}
