/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardTab } from "./dashboard/dashboard-tab";
import PerformanceTab from "./performance/performance-tab";
import AudienceTab from "./audience/audience-tab";
import CampaignsTab from "./campaigns/campaigns-tab";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { getCampaigns } from "@/lib/actions/campaign.action";


export default function AdsManagerTabs() {
  const { data: session } = authClient.useSession();
  const { data: campaigns = [], isPending } = useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => await getCampaigns({ token: session?.session.token as string }),
    enabled: !!session?.session.token,
  });

  const totalCampaigns = campaigns.length;
  const spendingData = campaigns.slice(0, 14).map((c: any, i: number) => ({
    day: `${i + 1}`,
    amount: Number(c?.performance?.spend || c?.payment?.totalCost || 0),
  }));

  const dashboardStats = {
    totalCampaigns,
    todayRevenue: 0,
    todayOrders: 0,
    todaySessions: 0,
    subscribers: 0,
    averageOrder: 0,
    revenueChange: 0,
    sessionsChange: 0,
    subscribersChange: 0,
  };

  const campaignsRows = campaigns.map((c: any) => ({
    _id: c._id,
    title: c.name,
    image: "/images/placeholder.png",
    impressions: c?.performance?.impressions || 0,
    clicks: c?.performance?.clicks || 0,
    cpc: c?.performance?.cpc || 0,
    spend: c?.performance?.spend || 0,
    listedDate: c?.createdAt,
  }));

  // Build real performance data
  const monthNames = [
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
  ];

  const now = new Date();
  const trend = Array.from({ length: 12 }, (_, idx) => {
    const mIndex = (now.getMonth() - (11 - idx) + 12) % 12;
    const label = monthNames[mIndex];
    // Sum impressions and clicks for campaigns created this month
    const monthTotals = campaigns.reduce(
      (acc: { impressions: number; clicks: number }, c: any) => {
        const created = c?.createdAt ? new Date(c.createdAt) : null;
        if (created && created.getMonth() === mIndex && created.getFullYear() === now.getFullYear()) {
          acc.impressions += Number(c?.performance?.impressions || 0);
          acc.clicks += Number(c?.performance?.clicks || 0);
        }
        return acc;
      },
      { impressions: 0, clicks: 0 }
    );
    return { month: label, seriesA: monthTotals.impressions, seriesB: monthTotals.clicks };
  });

  // Donut for performance tab: distribution by objective
  const objectiveToColor: Record<string, string> = {
    awareness: "#4dabf7",
    reach: "#6f3ef0",
    traffic: "#34d399",
    engagement: "#f59e0b",
    lead_generation: "#ef4444",
    conversions: "#2f2f2f",
  };
  const objectiveCounts = campaigns.reduce((acc: Record<string, number>, c: any) => {
    const key = c?.objective || "unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const publisherStats = Object.entries(objectiveCounts)
    .filter(([k]) => k !== "unknown")
    .map(([name, value]) => ({ name, value, color: objectiveToColor[name] || "#4dabf7" }));

  // Top performers by clicks
  const topPerformers = campaigns
    .slice()
    .sort((a: any, b: any) => (b?.performance?.clicks || 0) - (a?.performance?.clicks || 0))
    .slice(0, 3)
    .map((c: any) => ({ _id: c._id, title: c.name, image: "/images/placeholder.png" }));

  // Audience tab data
  const totals = campaigns.reduce(
    (acc: { impressions: number; clicks: number; conversions: number; spend: number }, c: any) => {
      acc.impressions += Number(c?.performance?.impressions || 0);
      acc.clicks += Number(c?.performance?.clicks || 0);
      acc.conversions += Number(c?.performance?.conversions || 0);
      acc.spend += Number(c?.performance?.spend || 0);
      return acc;
    },
    { impressions: 0, clicks: 0, conversions: 0, spend: 0 }
  );
  const totalSum = totals.impressions + totals.clicks + totals.conversions || 1;
  const traffic = [
    { label: "Impressions", value: totals.impressions, percent: Math.round((totals.impressions / totalSum) * 100) },
    { label: "Clicks", value: totals.clicks, percent: Math.round((totals.clicks / totalSum) * 100) },
    { label: "Conversions", value: totals.conversions, percent: Math.round((totals.conversions / totalSum) * 100) },
  ];

  // Composition by genders from targeting
  const genderCounts = campaigns.reduce((acc: Record<string, number>, c: any) => {
    const genders: string[] = c?.targeting?.demographics?.genders || [];
    if (!genders || genders.length === 0) {
      acc["unknown"] = (acc["unknown"] || 0) + 1;
    } else {
      genders.forEach((g) => {
        acc[g] = (acc[g] || 0) + 1;
      });
    }
    return acc;
  }, {} as Record<string, number>);
  const composition = Object.entries(genderCounts).map(([name, value]) => ({
    name: name === "unknown" ? "Unknown" : name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: name === "male" ? "#4dabf7" : name === "female" ? "#f2c744" : name === "other" ? "#6f3ef0" : "#2f2f2f",
  }));

  // Demographics table rows synthesized from campaign targeting and performance
  const demographics = campaigns.slice(0, 8).map((c: any) => {
    const ageMin = c?.targeting?.demographics?.ageMin ?? 18;
    const ageMax = c?.targeting?.demographics?.ageMax ?? 65;
    const genderList: string[] = c?.targeting?.demographics?.genders || [];
    const gender = genderList && genderList.length > 0 ? genderList.join(", ") : "All";
    const country = (c?.targeting?.location?.countries && c.targeting.location.countries[0]) || "N/A";
    const cpc = Number(c?.performance?.cpc || 0);
    const revenue = Number(c?.performance?.spend || 0);
    const purchases = Number(c?.performance?.conversions || 0);
    return { country, age: `${ageMin} - ${ageMax}`, gender, cpc, revenue, purchases };
  });

  const [tab, setTab] = useState<string>("dashboard");

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full mt-4 overflow-x-hidden">
      <TabsList className="bg-[#f1f4f3] rounded-full w-full flex h-[48px] justify-start gap-2 p-1 overflow-x-auto whitespace-nowrap no-scrollbar">
        <TabsTrigger
          value="dashboard"
          className="px-3 md:px-4 py-2 rounded-full data-[state=active]:bg-[#4dabf7] data-[state=active]:text-white inline-flex items-center gap-2"
        >
          <Image src="/icons/home.svg" alt="Dashboard" width={18} height={18} className={tab === "dashboard" ? "invert" : ""} />
          <span className="hidden md:inline">Dashboard</span>
        </TabsTrigger>
        <TabsTrigger
          value="campaigns"
          className="px-3 md:px-4 py-2 rounded-full data-[state=active]:bg-[#4dabf7] data-[state=active]:text-white inline-flex items-center gap-2"
        >
          <Image src={tab === "campaigns" ? "/icons/ad-icon-white.svg" : "/icons/ad-icon.svg"} alt="Campaigns" width={18} height={18} />
          <span className="hidden md:inline">My Campaigns</span>
        </TabsTrigger>
        <TabsTrigger
          value="performance"
          className="px-3 md:px-4 py-2 rounded-full data-[state=active]:bg-[#4dabf7] data-[state=active]:text-white inline-flex items-center gap-2"
        >
          <Image src="/icons/work-case.svg" alt="Performance" width={18} height={18} className={tab === "performance" ? "invert" : ""} />
          <span className="hidden md:inline">Performance</span>
        </TabsTrigger>
        <TabsTrigger
          value="audience"
          className="px-3 md:px-4 py-2 rounded-full data-[state=active]:bg-[#4dabf7] data-[state=active]:text-white inline-flex items-center gap-2"
        >
          <Image src="/icons/heart.svg" alt="Audience" width={18} height={18} className={tab === "audience" ? "invert" : ""} />
          <span className="hidden md:inline">Audience</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard" className="mt-4">
        {!isPending ? (
          <DashboardTab spending={spendingData} stats={dashboardStats} campaigns={campaignsRows} />
        ) : (
          <div className="p-6 text-sm text-muted-foreground">Loading dashboard...</div>
        )}
      </TabsContent>

      <TabsContent value="campaigns" className="mt-4">
        {!isPending ? (
          <CampaignsTab campaigns={campaignsRows} />
        ) : (
          <div className="p-6 text-sm text-muted-foreground">Loading campaigns...</div>
        )}
      </TabsContent>

      <TabsContent value="performance" className="mt-4">
        {!isPending ? (
          <PerformanceTab trend={trend} publisherStats={publisherStats} topPerformers={topPerformers} />
        ) : (
          <div className="p-6 text-sm text-muted-foreground">Loading performance...</div>
        )}
      </TabsContent>

      <TabsContent value="audience" className="mt-4">
        {!isPending ? (
          <AudienceTab traffic={traffic} composition={composition} demographics={demographics} />
        ) : (
          <div className="p-6 text-sm text-muted-foreground">Loading audience...</div>
        )}
      </TabsContent>
    </Tabs>
  );
}
