"use client";
import React from "react";
import TabContentHeader from "../tab-content-header";
import { authClient } from "@/lib/auth-client";
import { useQueries } from "@tanstack/react-query";
import { getUserGroupsPosts } from "@/lib/actions/group.action";
import { PostCardSkeleton } from "@/components/post/post-card-skeleton";
import { PostCard } from "@/components/post-card";
import { Post, User } from "@/types/global";
import { getMe } from "@/lib/actions/user.action";

const YourFeedContent = () => {
  const { data: session, isPending } = authClient.useSession();
  const results = useQueries({
    queries: [
      {
        queryKey: ["user-group-posts", session?.user.id],
        queryFn: async () =>
          await getUserGroupsPosts({ token: session?.session.token as string }),
        enabled: !!session?.user.id,
      },
      {
        queryKey: ["get-me"],
        queryFn: async () => await getMe(session?.session.token as string),
        enabled: !!session?.session.token,
      },
    ],
  });

  const posts: Post[] = results[0].data as Post[];
  const user = results[1].data;

  if (isPending || results.some((result) => result.isLoading)) {
    return Array(5)
      .fill(null)
      .map((_, i) => <PostCardSkeleton key={i} />);
  }

  return (
    <div className="space-y-2">
      <TabContentHeader>
        <h2 className="font-medium text-lg max-md:text-[15px]">
          Recent Activity
        </h2>
      </TabContentHeader>
      <div className="mt-2">
        {posts &&
          posts.length > 0 &&
          posts.map((post) => (
            <PostCard
              key={post._id}
              {...post}
              author={{
                ...post.author,
                isVerified: post.author?.isVerified || false,
                _id: post.author._id as string,
              }}
              currentUser={user as User}
            />
          ))}
      </div>
    </div>
  );
};

export default YourFeedContent;
