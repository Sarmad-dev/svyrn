/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import RecentAdCard from "@/components/ads/recent-ad-card";
import { Button } from "@/components/ui/button";
import { getAds } from "@/lib/actions/ad.action";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Ads = () => {
  const { data: session } = authClient.useSession();
  const { data: ads, isPending } = useQuery({
    queryKey: ["get-ads"],
    queryFn: async () =>
      await getAds({ token: session?.session.token as string }),
    enabled: !!session?.session.token,
  });

  return (
    <div className="space-y-3 max-md:px-3">
      <div className="w-full flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Ads</h2>
        <Link href={`/ads/ad-manager`}>
          <Button
            variant={"ghost"}
            className="text-blue-400 cursor-pointer hover:text-blue-400">
            <Image
              src={"/icons/ad-icon.svg"}
              alt="ad icon"
              width={20}
              height={20}
            />
            Ad Manager
          </Button>
        </Link>
      </div>
      {isPending ? (
        <div className="w-full flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : ads && ads.length > 0 ? (
        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-5">
          {ads.map((ad: any) => (
            <RecentAdCard
              author={{
                name: ad.advertiser.name,
                avatar: ad.advertiser.profilePicture,
              }}
              description={ad.description}
              hashtags={ad.tags}
              image={ad.image}
              comments={ad.comments.length}
              likes={ad.likes.length}
              key={ad._id}
            />
          ))}
        </div>
      ) : (
        <div className="w-full flex items-center justify-center">
          No Ads Found
        </div>
      )}
    </div>
  );
};

export default Ads;
