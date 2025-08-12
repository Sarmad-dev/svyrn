"use client";

import React from "react";
import { MetricCard } from "./metric-card";
import { SpendingChartCard } from "./spending-chart-card";
import { SpendingDatum } from "@/components/ui/chart";
import { CampaignsTable } from "./campaigns-table";

type DashboardTabProps = {
  spending: SpendingDatum[];
  stats: {
    totalCampaigns: number;
    todayRevenue: number;
    todayOrders: number;
    todaySessions: number;
    subscribers: number;
    averageOrder: number;
    revenueChange?: number;
    sessionsChange?: number;
    subscribersChange?: number;
  };
  campaigns: Array<{
    _id: string;
    title: string;
    image?: string;
    impressions: number;
    clicks: number;
    cpc: number;
    spend: number;
    listedDate?: string | Date;
  }>;
  onRefresh?: () => void;
  onCreateAdSet?: (campaignId: string) => void;
  onCreateAd?: (adSetId: string) => void;
  onViewDetails?: (campaignId: string) => void;
};

export function DashboardTab({
  spending,
  stats,
  campaigns,
  onRefresh,
  onCreateAdSet,
  onCreateAd,
  onViewDetails,
}: DashboardTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4 max-md:grid-cols-2">
        <MetricCard
          label="Total Campaign"
          value={stats.totalCampaigns}
          sublabel={new Date().toLocaleDateString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        />
        <MetricCard
          label="Today Revenue"
          value={`$${stats.todayRevenue.toLocaleString()}`}
          sublabel={`${stats.todayOrders} Orders`}
          change={{
            value: stats.revenueChange ?? 0,
            direction: (stats.revenueChange ?? 0) >= 0 ? "up" : "down",
          }}
        />
        <MetricCard
          label="Today Sessions"
          value={`${formatCompact(stats.todaySessions)}`}
          sublabel="32k Visitors"
          change={{
            value: stats.sessionsChange ?? 0,
            direction: (stats.sessionsChange ?? 0) >= 0 ? "up" : "down",
          }}
        />
        <MetricCard
          label="Subscribers"
          value={stats.subscribers}
          sublabel={`$${stats.averageOrder} Average Order`}
          change={{
            value: stats.subscribersChange ?? 0,
            direction: (stats.subscribersChange ?? 0) >= 0 ? "up" : "down",
          }}
        />
      </div>

      <SpendingChartCard data={spending} />

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Conversions over time</h3>
        <CampaignsTable 
          campaigns={campaigns} 
          onRefresh={onRefresh || (() => {})}
          onCreateAdSet={onCreateAdSet || (() => {})}
          onCreateAd={onCreateAd || (() => {})}
          onViewDetails={onViewDetails || (() => {})}
        />
      </div>
    </div>
  );
}

function formatCompact(value: number) {
  return new Intl.NumberFormat(undefined, { notation: "compact" }).format(
    value
  );
}
