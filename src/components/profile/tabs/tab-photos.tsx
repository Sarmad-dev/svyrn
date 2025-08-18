/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { getUserPhotos } from "@/lib/actions/user.action";
import PhotosPreview from "../sections/photos-preview";

export default function PhotosTab() {
  const { data: session } = authClient.useSession();
  const { data: photos } = useQuery({
    queryKey: ["get-user-photos", session?.user.id],
    queryFn: async () =>
      await getUserPhotos({
        token: session?.session.token as string,
        userId: session?.user.id as string,
      }),
    enabled: !!session?.session.token && !!session?.user.id,
  });

  return <PhotosPreview photos={photos ?? []} />;
}
