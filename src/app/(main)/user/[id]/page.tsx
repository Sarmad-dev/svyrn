"use client";
import React from "react";
import { User } from "@/types/global";
import Header from "@/components/layout/header/header";
import GroupHeader from "@/components/group/groupId/group-header";
import UserLeftSide from "@/components/user/user-left-side";
import { authClient } from "@/lib/auth-client";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import {
  followUser,
  getMe,
  getUserFollowing,
  getUserPosts,
  getUserProfile,
  unfollowUser,
} from "@/lib/actions/user.action";
import { useParams } from "next/navigation";
import EmptyState from "@/components/empty-state";
import { PostCard } from "@/components/post-card";
import { Button } from "@/components/ui/button";
import { UserCheck, UserPlus } from "lucide-react";

const UserPage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data, isPending } = authClient.useSession();
  const results = useQueries({
    queries: [
      {
        queryKey: ["user"],
        queryFn: async () =>
          await getUserProfile(id as string, data?.session.token as string),
        enabled: !!data?.session.token,
      },
      {
        queryKey: ["get-user-posts"],
        queryFn: async () =>
          await getUserPosts({
            token: data?.session.token as string,
            userId: id as string,
          }),
        enabled: !!data?.session.token,
      },
      {
        queryKey: ["following"],
        queryFn: async () =>
          await getUserFollowing({
            token: data?.session.token as string,
            userId: data?.user.id as string,
          }),
        enabled: !!data?.session.token,
      },
      {
        queryKey: ["get-me"],
        queryFn: async () => await getMe(data?.session.token as string),
        enabled: !!data?.session.token,
      },
    ],
  });

  const { mutateAsync: follow } = useMutation({
    mutationKey: ["follow-user"],
    mutationFn: async () =>
      await followUser({
        userId: id as string,
        token: data?.session.token as string,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["following"] });
    },
  });

  const { mutateAsync: unfollow } = useMutation({
    mutationKey: ["unfollow-user"],
    mutationFn: async () =>
      await unfollowUser({
        userId: id as string,
        token: data?.session.token as string,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["following"] });
    },
  });

  const handleFollowUser = async () => {
    await follow();
  };

  const handleUnfollowUser = async () => {
    await unfollow();
  };

  const user = results[0].data;
  const posts = results[1].data;
  const following = results[2].data;
  const me = results[3].data;

  if (isPending || results.some((result) => result.isLoading)) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <Header />
      <div className="w-full">
        <div className="container mx-auto">
          <GroupHeader
            group={{
              isAdmin: false,
              isCreator: false,
              profilePicture: user?.user?.profilePicture,
              coverPhoto: user?.user?.coverPhoto,
            }}
          />

          <div className="relative left-[150px] top-[10px]">
            {following?.some((f) => f._id === id) ? (
              <Button
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50 font-medium flex items-center gap-2"
                onClick={handleUnfollowUser}>
                <UserCheck className="w-4 h-4" />
                Unfollow
              </Button>
            ) : (
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-2"
                onClick={handleFollowUser}>
                <UserPlus className="w-4 h-4" />
                Follow
              </Button>
            )}
          </div>

          <div className="flex gap-16 max-2xl:gap-5 mt-16 max-2xl:mt-12">
            <div className="max-md:hidden block">
              <UserLeftSide user={user?.user as User} />
            </div>
            <div className="flex flex-1 flex-col gap-3">
              {posts && posts.length > 0 ? (
                posts.map(
                  (post) =>
                    !post.isGroup && (
                      <PostCard
                        key={post._id}
                        {...post}
                        author={{
                          ...post.author,
                          isVerified: post.author.isVerified as boolean,
                          _id: post.author._id as string,
                        }}
                        currentUser={me as User}
                      />
                    )
                )
              ) : (
                <EmptyState
                  icon={
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#3B8183"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="14"
                        rx="2"
                        ry="2"
                        stroke="#000"
                        fill="#CFEAE9"
                      />
                      <path d="M3 17l5-5 4 4 5-5 4 4" stroke="#000" />
                      <path d="M3 21h18" stroke="#000" />
                    </svg>
                  }
                  title="No Posts Yet"
                  description="You haven’t written any posts yet."
                  actionText="Create Post"
                  onActionClick={() => alert("Create Post")}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserPage;
