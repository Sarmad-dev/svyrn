"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import AdsManagerTabs from "@/components/ads/ads-manager-tabs";

const AdManager = () => {
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
        </div>
      </div>

      <AdsManagerTabs />
    </div>
  );
};

export default AdManager;
