import Link from "next/link";
import React from "react";
import { User } from "@/types/global";
import { formatNumber } from "@/lib/utils";
import Image from "next/image";

const UserLeftSide = ({ user }: { user: User }) => {
  return (
    <div className="space-y-3 w-[350px]">
      <div className="flex gap-2">
        <div className="flex-1 text-center rounded-md bg-gray-100 text-foreground py-2">
          {formatNumber(user?.followersCount)} Followers
        </div>
        <div className="flex-1 text-center rounded-md bg-gray-100 text-foreground py-2">
          {formatNumber(user?.followingCount)} Followings
        </div>
      </div>

      <div className="bg-gray-100 rounded-md p-2 flex flex-col gap-1">
        <h3 className="font-semibold text-xl">{user?.name}</h3>
        {user?.currentJob && user.location && (
          <p className="font-medium">
            {user?.currentJob} based in {user?.location}
          </p>
        )}
        {user?.website && (
          <Link href={user?.website} className="text-blue-400">
            {user?.website}
          </Link>
        )}
      </div>

      <div className="bg-gray-100 rounded-md p-2 flex flex-col gap-2">
        {user.worksAt && (
          <div className="flex gap-2 items-center">
            <Image
              src="/icons/work-case.svg"
              alt="work case"
              width={25}
              height={25}
            />
            <p>Works at {user.worksAt}</p>
          </div>
        )}
        {user.livesIn && (
          <div className="flex gap-2 items-center">
            <Image
              src="/icons/home.svg"
              alt="work case"
              width={25}
              height={25}
            />
            <p>lives in {user.livesIn}</p>
          </div>
        )}
        {user.From && (
          <div className="flex gap-2 items-center">
            <Image
              src="/icons/location.svg"
              alt="work case"
              width={25}
              height={25}
            />
            <p>From {user.From}</p>
          </div>
        )}
        {user.martialStatus && (
          <div className="flex gap-2 items-center">
            <Image
              src="/icons/heart.svg"
              alt="work case"
              width={25}
              height={25}
            />
            <p>
              {user.martialStatus.charAt(0).toUpperCase()}
              {user.martialStatus.slice(1)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserLeftSide;
