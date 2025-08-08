"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { getUserFollowers } from "@/lib/actions/user.action";

export default function FriendsPreview() {
  const { data: session } = authClient.useSession();
  const { data: followers } = useQuery({
    queryKey: ["followers", session?.user.id],
    queryFn: async () =>
      await getUserFollowers({
        token: session?.session.token as string,
        userId: session?.user.id as string,
      }),
    enabled: !!session?.session.token,
  });

  const items = (followers ?? []).slice(0, 9);
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        <h3 className="text-lg font-semibold">Friends</h3>
        <Link href="/profile" className="text-blue-500 text-sm">
          See all friends
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-3 p-3">
        {items.map((f) => (
          <div key={f._id} className="text-center">
            <div className="relative w-full pt-[100%] rounded overflow-hidden mb-2">
              <Image
                src={f.profilePicture || "/images/user.png"}
                alt={f.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="text-sm line-clamp-1">{f.name}</div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-sm text-muted-foreground px-4 pb-4">
            No friends yet
          </div>
        )}
      </div>
    </div>
  );
}
