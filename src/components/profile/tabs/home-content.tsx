import { PostCard } from "@/components/post-card";
import { getUserPosts } from "@/lib/actions/user.action";
import { authClient } from "@/lib/auth-client";
import { User } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const HomeContent = ({ user }: { user: User }) => {
  const { data: session } = authClient.useSession();

  const { data: posts } = useQuery({
    queryKey: ["get-user-posts"],
    queryFn: async () =>
      await getUserPosts({
        token: session?.session.token as string,
        userId: session?.user?.id as string,
      }),
    enabled: !!session?.user?.id && !!session?.session.token,
  });

  return (
    <div>
      {posts &&
        posts.length > 0 &&
        posts.map((post) => (
          <PostCard
            key={post._id}
            {...post}
            _id={post._id}
            author={{
              ...post.author,
              isVerified: post.author.isVerified as boolean,
              _id: post.author._id as string,
            }}
            currentUser={user}
          />
        ))}
    </div>
  );
};

export default HomeContent;
