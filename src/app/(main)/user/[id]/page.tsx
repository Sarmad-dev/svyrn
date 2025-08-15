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
import { Loader2, UserCheck, UserPlus } from "lucide-react";

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
  return (
    <main className="bg-gray-50 min-h-screen">
      <Header />
      {isPending || results.some((result) => result.isLoading) ? (
        <div className="w-full h-[calc(100vh-80px)] flex items-center justify-center">
          <Loader2 className="animate-spin text-blue-600 size-12" />
        </div>
      ) : (
        <div className="w-full container mx-auto">
          <GroupHeader
            group={{
              isAdmin: false,
              isCreator: false,
              profilePicture: user?.user?.profilePicture,
              coverPhoto: user?.user?.coverPhoto,
              name: user?.user?.name,
            }}
            compact
            noHorizontalPadding
          />
          <div className="container mx-auto px-4 py-4">
            <div className="relative md:left-4 md:top-[0px] z-10 mb-4 md:mb-0">
              {following?.some((f) => f._id === id) ? (
                <Button
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 font-medium flex items-center gap-2 rounded-full px-4 py-2 shadow-md"
                  onClick={handleUnfollowUser}>
                  <UserCheck className="w-5 h-5" />
                  Following
                </Button>
              ) : (
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-2 rounded-full px-4 py-2 shadow-md"
                  onClick={handleFollowUser}>
                  <UserPlus className="w-5 h-5" />
                  Follow
                </Button>
              )}
            </div>
            <div className="flex flex-col md:flex-row gap-6 mt-8">
              <div className="md:w-1/3 lg:w-1/4 hidden md:block">
                <UserLeftSide user={user?.user as User} />
              </div>
              <div className="flex-1">
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
                        width="80"
                        height="80"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#3B82F6"
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
                          stroke="#3B82F6"
                          fill="#EFF6FF"
                        />
                        <path d="M3 17l5-5 4 4 5-5 4 4" stroke="#3B82F6" />
                        <path d="M3 21h18" stroke="#3B82F6" />
                      </svg>
                    }
                    title="No Posts Yet"
                    description="This user hasn’t shared any posts yet. Check back later!"
                    actionText="Back to Home"
                    onActionClick={() => (window.location.href = "/")}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default UserPage;
