"use client";
import { CreateAd } from "@/components/ads/create-ad-dialog";
import MyAdsComponent from "@/components/ads/my-ads";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { useState } from "react";

const MyAds = () => {
  const [showCreateAdDailog, setShowCreateAdDialog] = useState(false);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">My Ads</h2>
        <Button
          className="bg-blue-400 hover:bg-blue-300 text-white hover:text-white cursor-pointer"
          onClick={() => setShowCreateAdDialog(true)}>
          <Plus />
          Create Ads
        </Button>
      </div>
      <MyAdsComponent />
      <CreateAd
        isOpen={showCreateAdDailog}
        onClose={() => setShowCreateAdDialog(false)}
      />
    </div>
  );
};

export default MyAds;
