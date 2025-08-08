"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { getUserPosts } from "@/lib/actions/user.action";

export default function VideosTab() {
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

  const videos: string[] = (posts ?? [])
    .flatMap((p: any) => p.content.media || [])
    .filter((m: any) => m.type === "video")
    .map((m: any) => m.url);

  return (
    <div className="grid grid-cols-3 max-md:grid-cols-2 gap-3">
      {videos.map((src, i) => (
        <video key={i} controls className="w-full rounded-lg overflow-hidden">
          <source src={src} />
        </video>
      ))}
      {videos.length === 0 && (
        <div className="text-sm text-muted-foreground">No videos yet</div>
      )}
    </div>
  );
}
