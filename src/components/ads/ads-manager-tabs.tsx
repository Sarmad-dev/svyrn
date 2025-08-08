"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardTab } from "./dashboard/dashboard-tab";
import MyAdsComponent from "./my-ads";
import PerformanceTab from "./performance/performance-tab";
import AudienceTab from "./audience/audience-tab";
import CampaignsTab from "./campaigns/campaigns-tab";

// Placeholder data generators; replace with API wiring when ready
const days = Array.from({ length: 14 }, (_, i) => i);
const spendingData = days.map((i) => ({
  day: `${18 + i}`,
  amount: Math.round((30 + Math.random() * 70) * 100) / 100,
}));

const campaignsMock = Array.from({ length: 5 }, (_, i) => ({
  _id: `cmp-${i}`,
  title:
    [
      "Creative Clothing",
      "Exclusive Furniture",
      "Burger Pack",
      "Home For Sale",
      "Travel Deals",
    ][i] || `Campaign ${i + 1}`,
  image: "/images/placeholder.png",
  impressions: 120000 + i * 30000,
  clicks: 150 + i * 100,
  cpc: 5 + i * 1.25,
  spend: 1200 + i * 800,
  listedDate: new Date().toISOString(),
}));

export default function AdsManagerTabs() {
  return (
    <Tabs defaultValue="dashboard" className="w-full mt-4">
      <TabsList className="bg-[#f1f4f3] rounded-full w-full flex h-[48px] justify-between p-1">
        <TabsTrigger
          value="dashboard"
          className="px-4 py-2 rounded-full data-[state=active]:bg-[#4dabf7] data-[state=active]:text-white"
        >
          Dashboard
        </TabsTrigger>
        <TabsTrigger
          value="campaigns"
          className="px-4 py-2 rounded-full data-[state=active]:bg-[#4dabf7] data-[state=active]:text-white"
        >
          My Campaigns
        </TabsTrigger>
        <TabsTrigger
          value="performance"
          className="px-4 py-2 rounded-full data-[state=active]:bg-[#4dabf7] data-[state=active]:text-white"
        >
          Performance
        </TabsTrigger>
        <TabsTrigger
          value="audience"
          className="px-4 py-2 rounded-full data-[state=active]:bg-[#4dabf7] data-[state=active]:text-white"
        >
          Audience
        </TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard" className="mt-4">
        <DashboardTab
          spending={spendingData}
          stats={{
            totalCampaigns: 4,
            todayRevenue: 5268.16,
            todayOrders: 143,
            todaySessions: 26000,
            subscribers: 192,
            averageOrder: 16.25,
            revenueChange: -2.0,
            sessionsChange: 3.2,
            subscribersChange: 8.3,
          }}
          campaigns={campaignsMock}
        />
      </TabsContent>

      <TabsContent value="campaigns" className="mt-4">
        {/* If you still want the old MyAds grid, keep it here; otherwise show table */}
        <CampaignsTab
          campaigns={[
            {
              _id: "c1",
              title: "Creative Clothing...",
              image: "/images/placeholder.png",
              impressions: 189000,
              clicks: 560,
              cpc: 8.12,
              spend: 223.52,
              listedDate: "2024-04-18",
            },
            {
              _id: "c2",
              title: "Exclusive Furniture...",
              image: "/images/placeholder.png",
              impressions: 287000,
              clicks: 230,
              cpc: 5.12,
              spend: 723.1,
              listedDate: "2024-04-15",
            },
            {
              _id: "c3",
              title: "Burger Pack",
              image: "/images/placeholder.png",
              impressions: 156000,
              clicks: 156,
              cpc: 5.12,
              spend: 9523.34,
              listedDate: "2024-04-02",
            },
            {
              _id: "c4",
              title: "Home For Sale",
              image: "/images/placeholder.png",
              impressions: 156000,
              clicks: 2000,
              cpc: 12.12,
              spend: 1421.76,
              listedDate: "2024-04-01",
            },
          ]}
        />
      </TabsContent>

      <TabsContent value="performance" className="mt-4">
        <PerformanceTab
          trend={Array.from({ length: 12 }, (_, i) => ({
            month: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ][i],
            seriesA: 20 + Math.random() * 80,
            seriesB: 15 + Math.random() * 70,
          }))}
          publisherStats={[
            { name: "Blue", value: 60, color: "#4dabf7" },
            { name: "Cream", value: 20, color: "#efece3" },
            { name: "Dark", value: 20, color: "#2f2f2f" },
          ]}
          topPerformers={[
            {
              _id: "1",
              title: "Home For Sale",
              image: "/images/placeholder.png",
            },
            {
              _id: "2",
              title: "Creative Clothes",
              image: "/images/placeholder.png",
            },
            { _id: "3", title: "Burger", image: "/images/placeholder.png" },
          ]}
        />
      </TabsContent>

      <TabsContent value="audience" className="mt-4">
        <AudienceTab
          traffic={[
            { label: "Direct", value: 2100, percent: 35 },
            { label: "Referral", value: 1300, percent: 15 },
            { label: "Paid", value: 4600, percent: 50 },
          ]}
          composition={[
            { name: "Blue", value: 55, color: "#4dabf7" },
            { name: "Yellow", value: 15, color: "#f2c744" },
            { name: "Purple", value: 20, color: "#6f3ef0" },
            { name: "Dark", value: 10, color: "#2f2f2f" },
          ]}
          demographics={[
            {
              country: "USA",
              age: "20 - 31",
              gender: "Male",
              cpc: 223.52,
              revenue: 373.14,
              purchases: 223,
            },
            {
              country: "Germany",
              age: "17 - 25",
              gender: "Female",
              cpc: 723.1,
              revenue: 723.1,
              purchases: 723,
            },
            {
              country: "China",
              age: "15 - 18",
              gender: "Male",
              cpc: 53.34,
              revenue: 723.34,
              purchases: 9523,
            },
            {
              country: "Italy",
              age: "25 - 35",
              gender: "Male",
              cpc: 121.76,
              revenue: 1421.76,
              purchases: 1421,
            },
          ]}
        />
      </TabsContent>
    </Tabs>
  );
}
