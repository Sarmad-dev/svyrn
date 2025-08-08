"use client";

import React from "react";
import Image from "next/image";

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

type CampaignsTableProps = {
  campaigns: Campaign[];
};

export function CampaignsTable({ campaigns }: CampaignsTableProps) {
  return (
    <div className="mt-4">
      <div className="grid grid-cols-12 px-4 py-2 text-sm text-muted-foreground">
        <div className="col-span-5">Campaign</div>
        <div className="col-span-2">Impressions</div>
        <div className="col-span-2">Clicks</div>
        <div className="col-span-1">CPC</div>
        <div className="col-span-2 text-right">Spend</div>
      </div>
      <div className="divide-y">
        {campaigns.map((c) => (
          <div key={c._id} className="grid grid-cols-12 items-center px-4 py-3">
            <div className="col-span-5 flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-md overflow-hidden bg-gray-100">
                {c.image && (
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div>
                <p className="font-medium line-clamp-1">{c.title}</p>
                {c.listedDate && (
                  <p className="text-xs text-muted-foreground">
                    Listed on {new Date(c.listedDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            <div className="col-span-2 text-sm">
              {formatCompact(c.impressions)}
            </div>
            <div className="col-span-2 text-sm">{formatCompact(c.clicks)}</div>
            <div className="col-span-1 text-sm">${c.cpc.toFixed(2)}</div>
            <div className="col-span-2 text-right font-medium">
              $
              {c.spend.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatCompact(value: number) {
  return new Intl.NumberFormat(undefined, { notation: "compact" }).format(
    value
  );
}
