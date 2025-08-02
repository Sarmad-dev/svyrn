/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUserAds } from "@/lib/actions/ad.action";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React from "react";
import AdCard from "./ad-card";

const MyAdsComponent = () => {
  const { data: ads, isPending } = useQuery({
    queryKey: ["get-my-ads"],
    queryFn: async () => await getUserAds(),
  });

  console.log("Ads: ", ads);
  return (
    <div className="space-y-3">
      {isPending ? (
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : ads && ads.length > 0 ? (
        <div className="grid grid-cols-3 max-md:grid-cols-2 gap-5 max-md:gap-2">
          {ads.map((ad: any) => (
            <AdCard
              key={ad._id}
              image={ad.image}
              price={ad.budget.amount}
              title={ad.title}
              listedDate={ad.createdAt}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center">No Ads Found</div>
      )}
    </div>
  );
};

export default MyAdsComponent;
