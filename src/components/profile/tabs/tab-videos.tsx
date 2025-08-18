/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { getUserVideos } from "@/lib/actions/user.action";

export default function VideosTab() {
  const { data: session } = authClient.useSession();
  const { data: videos } = useQuery({
    queryKey: ["get-user-videos", session?.user.id],
    queryFn: async () =>
      await getUserVideos({
        token: session?.session.token as string,
        userId: session?.user.id as string,
      }),
    enabled: !!session?.session.token && !!session.user.id,
  });

  return (
    <div className="grid grid-cols-3 max-md:grid-cols-2 gap-3">
      {videos?.map((src: { url: string }, i: number) => (
        <video key={i} controls className="w-full rounded-lg overflow-hidden">
          <source src={src.url} />
        </video>
      ))}
      {videos?.length === 0 && (
        <div className="text-sm text-muted-foreground">No videos yet</div>
      )}
    </div>
  );
}
