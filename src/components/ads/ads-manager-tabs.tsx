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
import { getCampaigns, getCampaignsOverview } from "@/lib/actions/campaign.action";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateAd } from "./create-ad-dialog";
import { CampaignDetailsDialog } from "./campaigns/campaign-details-dialog";
import { toast } from "sonner";

export default function AdsManagerTabs() {
  const { data: session } = authClient.useSession();
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [showCreateAdSet, setShowCreateAdSet] = useState(false);
  const [showCreateAd, setShowCreateAd] = useState(false);
  const [showCampaignDetails, setShowCampaignDetails] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [selectedAdSetId, setSelectedAdSetId] = useState<string>("");
  
  // Get campaigns with optimized data structure
  const { data: campaigns = [], isPending: campaignsPending, refetch: refetchCampaigns } = useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => await getCampaigns({ token: session?.session.token as string }),
    enabled: !!session?.session.token,
  });

  // Get aggregated analytics overview
  const { data: overview, isPending: overviewPending } = useQuery({
    queryKey: ["campaigns-overview"],
    queryFn: async () => await getCampaignsOverview({ token: session?.session.token as string }),
    enabled: !!session?.session.token,
  });

  const isPending = campaignsPending || overviewPending;

  // Use overview data if available, otherwise fall back to calculated values
  const totalCampaigns = overview?.overview?.totalCampaigns || campaigns.length;
  const spendingData = campaigns.slice(0, 14).map((c: any, i: number) => ({
    day: `${i + 1}`,
    amount: Number(c?.performance?.spend || 0),
  }));

  const dashboardStats = {
    totalCampaigns,
    todayRevenue: overview?.overview?.totalSpend || 0,
    todayOrders: overview?.overview?.totalConversions || 0,
    todaySessions: overview?.overview?.totalImpressions || 0,
    subscribers: overview?.overview?.totalClicks || 0,
    averageOrder: overview?.overview?.averageCpc || 0,
    revenueChange: 0, // Could be calculated from trends
    sessionsChange: 0,
    subscribersChange: 0,
  };

  const campaignsRows = campaigns.map((c: any) => ({
    _id: c._id,
    title: c.name,
    image: c.image,
    impressions: c?.performance?.impressions || 0,
    clicks: c?.performance?.clicks || 0,
    cpc: c?.performance?.cpc || 0,
    spend: c?.performance?.spend || 0,
    listedDate: c?.createdAt,
  }));

  // Use overview trends if available, otherwise calculate from campaigns
  const trends = overview?.trends || (() => {
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const now = new Date();
    return Array.from({ length: 12 }, (_, idx) => {
      const mIndex = (now.getMonth() - (11 - idx) + 12) % 12;
      const label = monthNames[mIndex];
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
  })();

  // Use overview objective distribution if available
  const publisherStats = overview?.objectiveDistribution || (() => {
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
    return Object.entries(objectiveCounts)
      .filter(([k]) => k !== "unknown")
      .map(([name, value]) => ({ name, value, color: objectiveToColor[name] || "#4dabf7" }));
  })();

  // Use overview top performers if available
  const topPerformers = overview?.topPerformers || (() => {
    return campaigns
      .slice()
      .sort((a: any, b: any) => (b?.performance?.clicks || 0) - (a?.performance?.clicks || 0))
      .slice(0, 3)
      .map((c: any) => ({ _id: c._id, title: c.name, image: c.image || "/images/placeholder.png" }));
  })();

  // Audience tab data - use overview if available
  const traffic = overview?.overview ? [
    { label: "Impressions", value: overview.overview.totalImpressions, percent: Math.round((overview.overview.totalImpressions / (overview.overview.totalImpressions + overview.overview.totalClicks + overview.overview.totalConversions)) * 100) },
    { label: "Clicks", value: overview.overview.totalClicks, percent: Math.round((overview.overview.totalClicks / (overview.overview.totalImpressions + overview.overview.totalClicks + overview.overview.totalConversions)) * 100) },
    { label: "Conversions", value: overview.overview.totalConversions, percent: Math.round((overview.overview.totalConversions / (overview.overview.totalImpressions + overview.overview.totalClicks + overview.overview.totalConversions)) * 100) },
  ] : (() => {
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
    return [
      { label: "Impressions", value: totals.impressions, percent: Math.round((totals.impressions / totalSum) * 100) },
      { label: "Clicks", value: totals.clicks, percent: Math.round((totals.clicks / totalSum) * 100) },
      { label: "Conversions", value: totals.conversions, percent: Math.round((totals.conversions / totalSum) * 100) },
    ];
  })();

  // Composition by genders from targeting
  const composition = (() => {
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
    return Object.entries(genderCounts).map(([name, value]) => ({
      name: name === "unknown" ? "Unknown" : name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: name === "male" ? "#4dabf7" : name === "female" ? "#f2c744" : name === "other" ? "#6f3ef0" : "#2f2f2f",
    }));
  })();

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

  const handleCampaignCreated = () => {
    setShowCreateCampaign(false);
    refetchCampaigns(); // Refresh campaigns data
  };

  const handleCreateAdSet = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setShowCreateAdSet(true);
  };

  const handleCreateAd = (adSetId: string) => {
    setSelectedAdSetId(adSetId);
    setShowCreateAd(true);
  };

  const handleViewDetails = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setShowCampaignDetails(true);
  };

  const handleAdSetCreated = () => {
    setShowCreateAdSet(false);
    setSelectedCampaignId("");
    refetchCampaigns();
  };

  const handleAdCreated = () => {
    setShowCreateAd(false);
    setSelectedAdSetId("");
    refetchCampaigns();
  };

  return (
    <>
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
            <DashboardTab 
              spending={spendingData} 
              stats={dashboardStats} 
              campaigns={campaignsRows}
              onRefresh={refetchCampaigns}
              onCreateAdSet={handleCreateAdSet}
              onCreateAd={handleCreateAd}
              onViewDetails={handleViewDetails}
            />
          ) : (
            <div className="p-6 text-sm text-muted-foreground">Loading dashboard...</div>
          )}
        </TabsContent>

        <TabsContent value="campaigns" className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Campaigns</h3>
            <Button
              onClick={() => setShowCreateCampaign(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </div>
          {!isPending ? (
            <CampaignsTab 
              campaigns={campaignsRows} 
              onRefresh={refetchCampaigns}
              onCreateAdSet={handleCreateAdSet}
              onCreateAd={handleCreateAd}
              onViewDetails={handleViewDetails}
            />
          ) : (
            <div className="p-6 text-sm text-muted-foreground">Loading campaigns...</div>
          )}
        </TabsContent>

        <TabsContent value="performance" className="mt-4">
          {!isPending ? (
            <PerformanceTab trend={trends} publisherStats={publisherStats} topPerformers={topPerformers} />
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

      <CreateAd
        isOpen={showCreateCampaign}
        onClose={handleCampaignCreated}
      />

      {/* Add dialogs for creating ad sets and ads */}
      {showCreateAdSet && (
        <CreateAd
          isOpen={showCreateAdSet}
          onClose={handleAdSetCreated}
          initialStep="adSet"
          campaignId={selectedCampaignId}
        />
      )}

      {showCreateAd && (
        <CreateAd
          isOpen={showCreateAd}
          onClose={handleAdCreated}
          initialStep="ad"
          adSetId={selectedAdSetId}
          campaignId={selectedCampaignId}
        />
      )}

      {/* Campaign details dialog */}
      {showCampaignDetails && (
        <CampaignDetailsDialog
          isOpen={showCampaignDetails}
          onClose={() => setShowCampaignDetails(false)}
          campaignId={selectedCampaignId}
        />
      )}
    </>
  );
}
