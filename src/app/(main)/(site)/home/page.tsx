"use client";
import HomeProfileHeader from "@/components/home-profile-header";
import { PostCard } from "@/components/post-card";
import { PostCardSkeleton } from "@/components/post/post-card-skeleton";
import { StoryPreview } from "@/components/story/story-preview";
import { getPosts } from "@/lib/actions/post.action";
import { getMe } from "@/lib/actions/user.action";
import { authClient } from "@/lib/auth-client";
import { Post, User } from "@/types/global";
import { useQueries } from "@tanstack/react-query";
import React from "react";

const Home = () => {
  const { data: session, isPending } = authClient.useSession();

  const results = useQueries({
    queries: [
      {
        queryKey: ["get-posts"],
        queryFn: async () => await getPosts(session?.session.token as string),
        enabled: !!session?.session.token,
      },
      {
        queryKey: ["get-me"],
        queryFn: async () => await getMe(session?.session.token as string),
        enabled: !!session?.session.token,
      },
    ],
  });

  const posts: Post[] = results[0].data;
  const user = results[1].data;

  if (isPending || results.some((result) => result.isLoading)) {
    return Array.from({ length: 3 }).map((_, i) => (
      <PostCardSkeleton key={i} />
    ));
  }

  return (
    <div>
      <HomeProfileHeader user={user as User} />
      <StoryPreview user={user as User} />
      {posts &&
        posts.length > 0 &&
        posts.map((post) => (
          <PostCard
            {...post}
            author={{
              name: post.author.name as string,
              profilePicture: post.author.profilePicture as string,
              isVerified: post.author.isVerified as boolean,
              _id: post.author._id as string,
            }}
            createdAt={post.createdAt as Date}
            key={post._id}
            reactions={post.reactions}
            currentUser={user as User}
          />
        ))}
    </div>
  );
};

export default Home;
