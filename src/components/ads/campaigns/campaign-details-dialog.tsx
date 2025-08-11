/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCampaign, getCampaignAdSets, getAdSetAds } from "@/lib/actions/campaign.action";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Calendar, DollarSign, Target, BarChart3, Users, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface CampaignDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
}

export function CampaignDetailsDialog({
  isOpen,
  onClose,
  campaignId,
}: CampaignDetailsDialogProps) {
  const { data: session } = authClient.useSession();
  const [campaign, setCampaign] = useState<any>(null);
  const [adSets, setAdSets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (isOpen && campaignId && session?.session.token) {
      loadCampaignDetails();
    }
  }, [isOpen, campaignId, session?.session.token]);

  const loadCampaignDetails = async () => {
    setIsLoading(true);
    try {
      const [campaignData, adSetsData] = await Promise.all([
        getCampaign({ token: session!.session.token, id: campaignId }),
        getCampaignAdSets({ token: session!.session.token, campaignId })
      ]);

      setCampaign(campaignData);
      setAdSets(adSetsData);

      // Load ads for each ad set
      const adSetsWithAds = await Promise.all(
        adSetsData.map(async (adSet) => {
          try {
            const ads = await getAdSetAds({ token: session!.session.token, adSetId: adSet._id });
            return { ...adSet, ads };
          } catch (error) {
            console.error("Failed to load ads for ad set:", error);
            return { ...adSet, ads: [] };
          }
        })
      );

      setAdSets(adSetsWithAds);
    } catch (error) {
      console.error("Failed to load campaign details:", error);
      toast.error("Failed to load campaign details");
    } finally {
      setIsLoading(false);
    }
  };

  if (!campaign) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Campaign Details
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading campaign details...</div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Campaign Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    {campaign.image && (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={campaign.image}
                          alt={campaign.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-xl">{campaign.name}</CardTitle>
                      <CardDescription>
                        Created on {formatDate(campaign.createdAt)}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                    {campaign.status}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="targeting">Targeting</TabsTrigger>
                <TabsTrigger value="adsets">Ad Sets & Ads</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Budget
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatCurrency(campaign.budget?.amount || 0)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {campaign.budget?.type === 'daily' ? 'Daily' : 'Lifetime'} budget
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Schedule
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm">
                        <div>{formatDate(campaign.schedule?.startDate)}</div>
                        <div className="text-muted-foreground">to</div>
                        <div>{formatDate(campaign.schedule?.endDate)}</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Objective
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="outline" className="capitalize">
                        {campaign.objective}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Ad Sets
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{adSets.length}</div>
                      <p className="text-xs text-muted-foreground">Total ad sets</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {campaign.performance?.impressions?.toLocaleString() || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Impressions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {campaign.performance?.clicks?.toLocaleString() || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Clicks</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {formatCurrency(campaign.performance?.spend || 0)}
                        </div>
                        <div className="text-sm text-muted-foreground">Spend</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {formatCurrency(campaign.performance?.cpc || 0)}
                        </div>
                        <div className="text-sm text-muted-foreground">CPC</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="targeting" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Targeting Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {campaign.targeting?.demographics && (
                      <div>
                        <h4 className="font-medium mb-2">Demographics</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {campaign.targeting.demographics.ageMin && (
                            <div>Age: {campaign.targeting.demographics.ageMin} - {campaign.targeting.demographics.ageMax}</div>
                          )}
                          {campaign.targeting.demographics.genders && (
                            <div>Gender: {campaign.targeting.demographics.genders.join(', ')}</div>
                          )}
                        </div>
                      </div>
                    )}

                    {campaign.targeting?.location && (
                      <div>
                        <h4 className="font-medium mb-2">Location</h4>
                        <div className="text-sm">
                          {campaign.targeting.location.countries && (
                            <div>Countries: {campaign.targeting.location.countries.join(', ')}</div>
                          )}
                          {campaign.targeting.location.cities && (
                            <div>Cities: {campaign.targeting.location.cities.join(', ')}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="adsets" className="space-y-4">
                <div className="space-y-4">
                  {adSets.length === 0 ? (
                    <Card>
                      <CardContent className="py-8 text-center text-muted-foreground">
                        No ad sets created yet
                      </CardContent>
                    </Card>
                  ) : (
                    adSets.map((adSet) => (
                      <Card key={adSet._id}>
                        <CardHeader>
                          <CardTitle className="text-lg">{adSet.name}</CardTitle>
                          <CardDescription>
                            Budget: {formatCurrency(adSet.budget?.amount || 0)} ({adSet.budget?.type})
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">
                              Ads: {adSet.ads?.length || 0}
                            </div>
                            {adSet.ads && adSet.ads.length > 0 && (
                              <div className="space-y-1">
                                {adSet.ads.map((ad: any) => (
                                  <div key={ad._id} className="text-sm p-2 bg-gray-50 rounded">
                                    {ad.title} - {ad.status}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
