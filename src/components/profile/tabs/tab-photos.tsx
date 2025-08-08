"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { getUserPosts } from "@/lib/actions/user.action";
import PhotosPreview from "../sections/photos-preview";

export default function PhotosTab() {
  const { data: session } = authClient.useSession();
  const { data: posts } = useQuery({
    queryKey: ["get-user-posts", session?.user.id],
    queryFn: async () =>
      await getUserPosts({
        token: session?.session.token as string,
        userId: session?.user.id as string,
      }),
    enabled: !!session?.session.token,
  });

  const photos: string[] = (posts ?? [])
    .flatMap((p: any) => p.content.media || [])
    .filter((m: any) => m.type === "image")
    .map((m: any) => m.url);

  return <PhotosPreview photos={photos} />;
}
