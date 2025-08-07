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
  const { data: session, isPending, error } = authClient.useSession();
  const token = session?.session.token;

  const results = useQueries({
    queries: [
      {
        queryKey: ["get-posts"],
        queryFn: async () => await getPosts(token as string),
        enabled: !!token,
      },
      {
        queryKey: ["get-me"],
        queryFn: async () => await getMe(token as string),
        enabled: !!token,
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

  console.log("Token: ", token);
  console.log("User: ", JSON.stringify(user, null, 2));
  console.log("Posts: ", JSON.stringify(posts, null, 2));

  console.log("POSTS: ", JSON.stringify(posts, null, 2));

  if (error) {
    return <div>Error: {JSON.stringify(error, null, 2)}</div>;
  }

  if (!token) {
    return <div>No Session</div>;
  }

  return (
    <>
      <HomeProfileHeader user={user as User} />
      <StoryPreview user={user as User} />
      {posts && posts.length > 0 ? (
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
        ))
      ) : (
        <div className="flex items-center justify-center">
          <p className="text-lg font-semibold">No Posts yet</p>
        </div>
      )}
    </>
  );
};

export default Home;
