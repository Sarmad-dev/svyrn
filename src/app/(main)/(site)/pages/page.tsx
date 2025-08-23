/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  getMyPages, 
  getFollowedPages, 
  getPages,
  followPage,
  unfollowPage 
} from "@/lib/actions/page.action";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Plus, 
  Search, 
  Users, 
  Calendar, 
  Globe, 
  Shield,
  BookOpen,
  Star,
  Globe as WebsiteIcon
} from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const categoryColors: Record<string, string> = {
  business: "bg-blue-100 text-blue-800",
  entertainment: "bg-purple-100 text-purple-800",
  news: "bg-red-100 text-red-800",
  sports: "bg-green-100 text-green-800",
  technology: "bg-indigo-100 text-indigo-800",
  fashion: "bg-pink-100 text-pink-800",
  food: "bg-orange-100 text-orange-800",
  travel: "bg-teal-100 text-teal-800",
  health: "bg-emerald-100 text-emerald-800",
  education: "bg-cyan-100 text-cyan-800",
  other: "bg-gray-100 text-gray-800",
};

const privacyIcons: Record<string, React.ReactNode> = {
  public: <Globe className="w-4 h-4" />,
  friends: <Users className="w-4 h-4" />,
  private: <Shield className="w-4 h-4" />,
};

export default function PagesPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Fetch user's pages
  const { data: myPages, isLoading: isLoadingMyPages } = useQuery({
    queryKey: ["my-pages"],
    queryFn: () => getMyPages({ token: session?.session.token as string }),
    enabled: !!session?.session.token,
  });

  // Fetch followed pages
  const { data: followedPages, isLoading: isLoadingFollowedPages } = useQuery({
    queryKey: ["followed-pages"],
    queryFn: () => getFollowedPages({ token: session?.session.token as string }),
    enabled: !!session?.session.token,
  });

  // Fetch discover pages
  const { data: discoverPages, isLoading: isLoadingDiscoverPages } = useQuery({
    queryKey: ["discover-pages", searchQuery, selectedCategory],
    queryFn: () => getPages({ 
      token: session?.session.token as string,
      search: searchQuery || undefined,
      category: selectedCategory || undefined,
      limit: 20
    }),
    enabled: !!session?.session.token,
  });

  const handleFollow = async (pageId: string) => {
    try {
      await followPage({ token: session?.session.token as string, pageId });
      // Refetch followed pages
      window.location.reload();
    } catch (error) {
      console.error("Error following page:", error);
    }
  };

  const handleUnfollow = async (pageId: string) => {
    try {
      await unfollowPage({ token: session?.session.token as string, pageId });
      // Refetch followed pages
      window.location.reload();
    } catch (error) {
      console.error("Error unfollowing page:", error);
    }
  };

  const PageCard = ({ page, showFollowButton = false, isFollowed = false }: any) => (
    <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={page.profilePicture} alt={page.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {page.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 truncate">{page.name}</h3>
                {page.isVerified && (
                  <Star className="w-4 h-4 text-blue-500 fill-current flex-shrink-0" />
                )}
              </div>
              {page.username && (
                <p className="text-sm text-gray-500 truncate">@{page.username}</p>
              )}
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge 
                  variant="secondary" 
                  className={`text-xs flex-shrink-0 ${categoryColors[page.category] || categoryColors.other}`}
                >
                  {page.category}
                </Badge>
                <div className="flex items-center gap-1 text-gray-500 min-w-0">
                  {privacyIcons[page.privacy]}
                  <span className="text-xs capitalize truncate">{page.privacy}</span>
                </div>
              </div>
            </div>
          </div>
          {showFollowButton && (
            <Button
              variant={isFollowed ? "outline" : "default"}
              size="sm"
              onClick={() => isFollowed ? handleUnfollow(page._id) : handleFollow(page._id)}
              className={isFollowed ? "border-gray-300 text-gray-700" : ""}
            >
              {isFollowed ? "Unfollow" : "Follow"}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {page.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 break-words">{page.description}</p>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500 gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1 min-w-0">
              <Users className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{page.followersCount || 0} followers</span>
            </div>
            <div className="flex items-center gap-1 min-w-0">
              <BookOpen className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{page.postsCount || 0} posts</span>
            </div>
          </div>
          <div className="flex items-center gap-1 min-w-0">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{new Date(page.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => router.push(`/pages/${page._id}`)}
          >
            View Page
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const EmptyState = ({ title, description, icon: Icon }: any) => (
    <div className="text-center py-12">
      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{description}</p>
      <Button onClick={() => router.push("/pages/create")}>
        <Plus className="w-4 h-4 mr-2" />
        Create Page
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pages</h1>
              <p className="text-gray-600 mt-2">
                Discover, create, and manage your business and community pages
              </p>
            </div>
            <Button onClick={() => router.push("/pages/create")} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Page
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option value="business">Business</option>
              <option value="entertainment">Entertainment</option>
              <option value="news">News</option>
              <option value="sports">Sports</option>
              <option value="technology">Technology</option>
              <option value="fashion">Fashion</option>
              <option value="food">Food</option>
              <option value="travel">Travel</option>
              <option value="health">Health</option>
              <option value="education">Education</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="my-pages" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm border border-gray-200">
            <TabsTrigger value="my-pages" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              My Pages
            </TabsTrigger>
            <TabsTrigger value="followed" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Following
            </TabsTrigger>
            <TabsTrigger value="discover" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Discover
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-pages" className="mt-6">
            {isLoadingMyPages ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : myPages && myPages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myPages.map((page: any) => (
                  <PageCard key={page._id} page={page} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No pages yet"
                description="Create your first page to start building your online presence"
                icon={Plus}
              />
            )}
          </TabsContent>

          <TabsContent value="followed" className="mt-6">
            {isLoadingFollowedPages ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : followedPages && followedPages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {followedPages.map((page: any) => (
                  <PageCard key={page._id} page={page} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Not following any pages"
                description="Follow pages to see their updates in your feed"
                icon={Users}
              />
            )}
          </TabsContent>

          <TabsContent value="discover" className="mt-6">
            {isLoadingDiscoverPages ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : discoverPages && discoverPages.pages && discoverPages.pages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {discoverPages.pages.map((page: any) => (
                  <PageCard 
                    key={page._id} 
                    page={page} 
                    showFollowButton={true}
                    isFollowed={followedPages?.some((fp: any) => fp._id === page._id)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No pages found"
                description="Try adjusting your search or category filters"
                icon={Search}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
