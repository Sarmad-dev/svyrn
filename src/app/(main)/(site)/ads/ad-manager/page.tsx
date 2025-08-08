"use client";
import { CreateAd } from "@/components/ads/create-ad-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import AdsManagerTabs from "@/components/ads/ads-manager-tabs";

const AdManager = () => {
  const [showCreateAdDailog, setShowCreateAdDialog] = useState(false);
  return (
    <div>
      <div className="w-full flex items-center justify-between">
        <h2 className="text-lg font-semibold">Ads Manager</h2>
        <div className="flex gap-2 items-center">
          <Link href={`/ads/my-ads`}>
            <Button
              variant={"ghost"}
              className="bg-blue-400 cursor-pointer hover:bg-blue-300 text-white hover:text-white"
            >
              <Image
                src={"/icons/ad-icon-white.svg"}
                alt="ad icon"
                width={20}
                height={20}
                className="inverted-colors:text-white"
              />
              My Ads
            </Button>
          </Link>
          <Button
            className="bg-blue-400 hover:bg-blue-300 text-white hover:text-white cursor-pointer"
            onClick={() => setShowCreateAdDialog(true)}
          >
            <Plus />
            Create Ads
          </Button>
        </div>
      </div>

      <AdsManagerTabs />
      <CreateAd
        isOpen={showCreateAdDailog}
        onClose={() => setShowCreateAdDialog(false)}
      />
    </div>
  );
};

export default AdManager;
