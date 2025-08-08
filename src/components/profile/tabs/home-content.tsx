import { PostCard } from "@/components/post-card";
import { getUserPosts } from "@/lib/actions/user.action";
import { authClient } from "@/lib/auth-client";
import { User } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { formatNumber } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const MobileUserDetails = ({ user }: { user: User }) => {
  return (
    <div className="md:hidden bg-white rounded-lg p-4 mb-4 border border-gray-200">
      {/* User Stats */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 text-center rounded-md bg-gray-100 text-foreground py-2">
          {formatNumber(user?.followersCount)} Followers
        </div>
        <div className="flex-1 text-center rounded-md bg-gray-100 text-foreground py-2">
          {formatNumber(user?.followingCount)} Followings
        </div>
      </div>

      {/* User Info */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-xl">{user?.name}</h3>
          {user?.currentJob && user.location && (
            <p className="font-medium text-gray-600">
              {user?.currentJob} based in {user?.location}
            </p>
          )}
          {user?.website && (
            <Link href={user?.website} className="text-blue-400 text-sm">
              {user?.website}
            </Link>
          )}
        </div>

        {/* User Details */}
        <div className="space-y-2">
          {user.worksAt && (
            <div className="flex gap-2 items-center">
              <Image
                src="/icons/work-case.svg"
                alt="work case"
                width={20}
                height={20}
              />
              <p className="text-sm">Works at {user.worksAt}</p>
            </div>
          )}
          {user.livesIn && (
            <div className="flex gap-2 items-center">
              <Image src="/icons/home.svg" alt="home" width={20} height={20} />
              <p className="text-sm">Lives in {user.livesIn}</p>
            </div>
          )}
          {user.From && (
            <div className="flex gap-2 items-center">
              <Image
                src="/icons/location.svg"
                alt="location"
                width={20}
                height={20}
              />
              <p className="text-sm">From {user.From}</p>
            </div>
          )}
          {user.martialStatus && (
            <div className="flex gap-2 items-center">
              <Image
                src="/icons/heart.svg"
                alt="heart"
                width={20}
                height={20}
              />
              <p className="text-sm">
                {user.martialStatus.charAt(0).toUpperCase()}
                {user.martialStatus.slice(1)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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
      <MobileUserDetails user={user} />
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
