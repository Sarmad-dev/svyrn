/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import FollowingCard from "../following-card";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { getSimilarUsers, getUserFollowing } from "@/lib/actions/user.action";
import EmptyState from "@/components/empty-state";
import FollowCard from "../follow-card";

const FollowingContent = () => {
  const { data } = authClient.useSession();
  const { data: following } = useQuery({
    queryKey: ["following"],
    queryFn: async () =>
      await getUserFollowing({
        token: data?.session.token as string,
        userId: data?.user?.id as string,
      }),
  });

  const { data: similarUsers } = useQuery({
    queryKey: ["similar-users"],
    queryFn: async () =>
      await getSimilarUsers({
        token: data?.session.token as string,
      }),
    enabled: !!data?.session.token,
  });

  const usersToFollow = similarUsers?.filter(
    (user: any) =>
      !following?.some((followingUser) => followingUser._id === user._id)
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {following && following.length > 0 ? (
          following.map((user) => <FollowingCard key={user._id} user={user} />)
        ) : (
          <div className="w-full">
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
                  <circle cx="12" cy="8" r="4" fill="#CFEAE9" stroke="#000" />
                  <path
                    d="M4 20v-1a4 4 0 014-4h8a4 4 0 014 4v1"
                    stroke="#000"
                  />
                  <circle
                    cx="18"
                    cy="6"
                    r="2"
                    fill="#3B8183"
                    stroke="#fff"
                    strokeWidth="1.2"
                  />
                  <line
                    x1="18"
                    y1="6"
                    x2="18"
                    y2="10"
                    stroke="#fff"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="16"
                    y1="8"
                    x2="20"
                    y2="8"
                    stroke="#fff"
                    strokeWidth="1.5"
                  />
                </svg>
              }
              title="Not Following Anyone"
              description="Find and follow other users to see their updates."
              actionText="Find Users"
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h2 className="font-semibold text-lg">People you may know</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-3">
          {usersToFollow &&
            usersToFollow.length > 0 &&
            usersToFollow.map(
              (user: any) =>
                user._id !== data?.user?.id && ( // Exclude the current user from the list
                  <FollowCard key={user._id} user={user} />
                )
            )}
        </div>
      </div>
    </div>
  );
};

export default FollowingContent;
