"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { CampaignsTable } from "../dashboard/campaigns-table";

type Campaign = {
  _id: string;
  title: string;
  image?: string;
  impressions: number;
  clicks: number;
  cpc: number;
  spend: number;
  listedDate?: string | Date;
};

type CampaignsTabProps = {
  campaigns: Campaign[];
};

export default function CampaignsTab({ campaigns }: CampaignsTabProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">
          {campaigns.length} Active Campaigns
        </h3>
        <button className="text-blue-500 text-sm">See less</button>
      </div>
      <Card className="p-0">
        <CampaignsTable campaigns={campaigns} />
      </Card>
    </div>
  );
}
