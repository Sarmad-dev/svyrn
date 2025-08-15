/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getPage, 
  getPagePosts,
  followPage,
  unfollowPage 
} from "@/lib/actions/page.action";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Users, 
  Calendar, 
  Globe, 
  Shield,
  BookOpen,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe as WebsiteIcon,
  Edit,
  Settings,
  MessageSquare,
  Heart,
  Eye,
  Clock,
  TrendingUp,
  Plus,
  X,
  Upload,
  Share2
} from "lucide-react";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { authClient } from "@/lib/auth-client";
import GroupHeader from "@/components/group/groupId/group-header";

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

export default function PageViewPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const pageId = params.id as string;

  // State for create post modal
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [postData, setPostData] = useState({
    text: "",
    privacy: "public",
    base64: ""
  });
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  // State for settings modal
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsData, setSettingsData] = useState({
    name: "",
    description: "",
    category: "",
    privacy: "public",
    allowComments: true,
    allowReactions: true,
    allowSharing: true,
    notifyOnFollow: true,
    notifyOnComment: true
  });
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);

  // Fetch page details
  const { data: pageData, isLoading: isLoadingPage } = useQuery({
    queryKey: ["page", pageId],
    queryFn: () => getPage({ token: session?.session.token as string, id: pageId }),
    enabled: !!session?.session.token && !!pageId,
  });

  const page = pageData?.page;
  const isFollowing = pageData?.isFollowing;
  const userRole = pageData?.userRole;

  // Follow/Unfollow mutation
  const followMutation = useMutation({
    mutationFn: followPage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page", pageId] });
      queryClient.invalidateQueries({ queryKey: ["followed-pages"] });
      toast.success("Page followed successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to follow page");
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: unfollowPage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page", pageId] });
      queryClient.invalidateQueries({ queryKey: ["followed-pages"] });
      toast.success("Page unfollowed successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to follow page");
    },
  });

  const handleFollow = () => {
    if (isFollowing) {
      unfollowMutation.mutate({ token: session?.session.token as string, pageId });
    } else {
      followMutation.mutate({ token: session?.session.token as string, pageId });
    }
  };

  const handleEdit = () => {
    toast.info("Edit functionality coming soon!");
  };

  const handleShare = () => {
    toast.info("Share functionality coming soon!");
  };

  const handleMessage = () => {
    toast.info("Message functionality coming soon!");
  };

  // Handle create post
  const handleCreatePost = async () => {
    if (!postData.text.trim()) {
      toast.error("Please enter some text for your post");
      return;
    }

    setIsSubmittingPost(true);
    try {
      const response = await fetch(`/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.session.token}`
        },
        body: JSON.stringify({
          text: postData.text,
          privacy: postData.privacy,
          pageId: pageId,
          base64: postData.base64 || undefined
        })
      });

      if (response.ok) {
        toast.success("Post created successfully!");
        setIsCreatePostOpen(false);
        setPostData({ text: "", privacy: "public", base64: "" });
        queryClient.invalidateQueries({ queryKey: ["page-posts", pageId] });
        queryClient.invalidateQueries({ queryKey: ["page", pageId] });
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to create post");
      }
    } catch (error) {
      toast.error("Failed to create post");
    } finally {
      setIsSubmittingPost(false);
    }
  };

  // Handle update settings
  const handleUpdateSettings = async () => {
    if (!settingsData.name.trim()) {
      toast.error("Page name is required");
      return;
    }

    setIsUpdatingSettings(true);
    try {
      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.session.token}`
        },
        body: JSON.stringify(settingsData)
      });

      if (response.ok) {
        toast.success("Page settings updated successfully!");
        setIsSettingsOpen(false);
        queryClient.invalidateQueries({ queryKey: ["page", pageId] });
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to update settings");
      }
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  // Handle image upload for post
  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setPostData(prev => ({ ...prev, base64 }));
    };
    reader.readAsDataURL(file);
  };

  // Initialize settings data when page loads
  React.useEffect(() => {
    if (page) {
      setSettingsData({
        name: page.name || "",
        description: page.description || "",
        category: page.category || "",
        privacy: page.privacy || "public",
        allowComments: page.settings?.allowComments ?? true,
        allowReactions: page.settings?.allowReactions ?? true,
        allowSharing: page.settings?.allowSharing ?? true,
        notifyOnFollow: page.settings?.notifyOnFollow ?? true,
        notifyOnComment: page.settings?.notifyOnComment ?? true
      });
    }
  }, [page]);

  // Check access permissions
  const canView = page && (
    page.privacy === "public" ||
    userRole === "owner" ||
    userRole === "admin" ||
    (page.privacy === "friends" && isFollowing)
  );

  const isOwner = userRole === "owner";
  const isAdmin = userRole === "owner" || userRole === "admin";

  if (isLoadingPage) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!page || !page.isActive) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-600 mb-4">The page you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Button onClick={() => router.push("/pages")}>Back to Pages</Button>
        </div>
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Accessible</h1>
          <p className="text-gray-600 mb-4">
            {page.privacy === "private" 
              ? "This page is private and only visible to owners and admins."
              : "You need to follow this page to view its content."
            }
          </p>
          {page.privacy === "friends" && (
            <Button onClick={handleFollow}>Follow Page</Button>
          )}
          <Button variant="outline" onClick={() => router.push("/pages")} className="ml-2">
            Back to Pages
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Cover and Profile using GroupHeader */}
      <GroupHeader
        group={{
          isAdmin: Boolean(isAdmin),
          isCreator: Boolean(isOwner),
          profilePicture: page.profilePicture,
          coverPhoto: page.coverPhoto,
          name: page.name,
        }}
        pageId={pageId}
        compact
        noHorizontalPadding
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-700 mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span>{page.followersCount || 0} followers</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gray-500" />
            <span>{page.postsCount || 0} posts</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>Created {new Date(page.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Tabs (solid theme) */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="flex w-full bg-white shadow-sm border border-gray-200 rounded-md overflow-hidden">
            <TabsTrigger value="posts" className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
              Posts
            </TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">
              About
            </TabsTrigger>
          </TabsList>

          {/* Actions below tabs */}
          <div className="flex items-center gap-2 justify-end mt-4">
            {isOwner && (
              <>
                <Button 
                  onClick={() => setIsCreatePostOpen(true)}
                  className=""
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Post
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsSettingsOpen(true)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </>
            )}
          </div>

          <TabsContent value="posts" className="mt-6">
            <PagePostsTab pageId={pageId} />
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <PageAboutTab page={page} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Post Modal */}
      <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="post-text">What&apos;s on your mind?</Label>
              <Textarea
                id="post-text"
                placeholder="Share something with your page followers..."
                value={postData.text}
                onChange={(e) => setPostData(prev => ({ ...prev, text: e.target.value }))}
                rows={4}
                maxLength={2000}
              />
              <p className="text-xs text-gray-500 mt-1">
                {postData.text.length}/2000 characters
              </p>
            </div>

            <div>
              <Label htmlFor="post-image">Add Image (Optional)</Label>
              <div className="mt-2">
                {postData.base64 ? (
                  <div className="relative">
                    <img 
                      src={postData.base64} 
                      alt="Post preview" 
                      className="w-full max-h-64 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 h-8 w-8 p-0"
                      onClick={() => setPostData(prev => ({ ...prev, base64: "" }))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Upload an image</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            toast.error("Image size must be less than 5MB");
                            return;
                          }
                          handleImageUpload(file);
                        }
                      }}
                      className="hidden"
                      id="post-image-upload"
                    />
                    <Label 
                      htmlFor="post-image-upload"
                      className="cursor-pointer bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm hover:bg-blue-100 transition-colors"
                    >
                      Choose File
                    </Label>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label>Privacy</Label>
              <RadioGroup
                value={postData.privacy}
                onValueChange={(value) => setPostData(prev => ({ ...prev, privacy: value }))}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="post-public" />
                  <Label htmlFor="post-public" className="flex items-center gap-2 cursor-pointer">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span>Public</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="friends" id="post-friends" />
                  <Label htmlFor="post-friends" className="flex items-center gap-2 cursor-pointer">
                    <Users className="w-4 h-4 text-orange-600" />
                    <span>Friends</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsCreatePostOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreatePost}
                disabled={isSubmittingPost || !postData.text.trim()}
              >
                {isSubmittingPost ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    Creating...
                  </div>
                ) : (
                  "Create Post"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Page Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <Label htmlFor="page-name">Page Name *</Label>
              <Input
                id="page-name"
                value={settingsData.name}
                onChange={(e) => setSettingsData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter page name"
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">
                {settingsData.name.length}/100 characters
              </p>
            </div>

            <div>
              <Label htmlFor="page-description">Description</Label>
              <Textarea
                id="page-description"
                value={settingsData.description}
                onChange={(e) => setSettingsData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Tell people about your page..."
                rows={3}
                maxLength={2000}
              />
              <p className="text-xs text-gray-500 mt-1">
                {settingsData.description.length}/2000 characters
              </p>
            </div>

            <div>
              <Label htmlFor="page-category">Category *</Label>
              <Select
                value={settingsData.category}
                onValueChange={(value) => setSettingsData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="news">News</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="food">Food & Dining</SelectItem>
                  <SelectItem value="travel">Travel & Tourism</SelectItem>
                  <SelectItem value="health">Health & Wellness</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Privacy Level</Label>
              <RadioGroup
                value={settingsData.privacy}
                onValueChange={(value) => setSettingsData(prev => ({ ...prev, privacy: value }))}
                className="space-y-3 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="settings-public" />
                  <Label htmlFor="settings-public" className="flex items-center gap-2 cursor-pointer">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <div>
                      <span className="font-medium">Public</span>
                      <p className="text-sm text-gray-500">Anyone can view and follow your page</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="friends" id="settings-friends" />
                  <Label htmlFor="settings-friends" className="flex items-center gap-2 cursor-pointer">
                    <Users className="w-4 h-4 text-orange-600" />
                    <div>
                      <span className="font-medium">Friends Only</span>
                      <p className="text-sm text-gray-500">Only your friends can view and follow</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="settings-private" />
                  <Label htmlFor="settings-private" className="flex items-center gap-2 cursor-pointer">
                    <Shield className="w-4 h-4 text-red-600" />
                    <div>
                      <span className="font-medium">Private</span>
                      <p className="text-sm text-gray-500">Only you and admins can view</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <Label>Page Features</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Allow Comments</span>
                    <span className="text-xs text-gray-500">Visitors can comment on posts</span>
                  </div>
                  <Switch
                    checked={settingsData.allowComments}
                    onCheckedChange={(checked) => setSettingsData(prev => ({ ...prev, allowComments: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Allow Reactions</span>
                    <span className="text-xs text-gray-500">Visitors can react to posts</span>
                  </div>
                  <Switch
                    checked={settingsData.allowReactions}
                    onCheckedChange={(checked) => setSettingsData(prev => ({ ...prev, allowReactions: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Allow Sharing</span>
                    <span className="text-xs text-gray-500">Visitors can share your posts</span>
                  </div>
                  <Switch
                    checked={settingsData.allowSharing}
                    onCheckedChange={(checked) => setSettingsData(prev => ({ ...prev, allowSharing: checked }))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Notifications</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">New Followers</span>
                    <span className="text-xs text-gray-500">Get notified when someone follows</span>
                  </div>
                  <Switch
                    checked={settingsData.notifyOnFollow}
                    onCheckedChange={(checked) => setSettingsData(prev => ({ ...prev, notifyOnFollow: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">New Comments</span>
                    <span className="text-xs text-gray-500">Get notified on new comments</span>
                  </div>
                  <Switch
                    checked={settingsData.notifyOnComment}
                    onCheckedChange={(checked) => setSettingsData(prev => ({ ...prev, notifyOnComment: checked }))}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsSettingsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateSettings}
                disabled={isUpdatingSettings || !settingsData.name.trim() || !settingsData.category}
              >
                {isUpdatingSettings ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    Updating...
                  </div>
                ) : (
                  "Update Settings"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Page Posts Tab Component
function PagePostsTab({ pageId }: { pageId: string }) {
  const { data: session } = authClient.useSession();

  const { data: postsData, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteScroll({
    queryKey: ["page-posts", pageId],
    queryFn: ({ pageParam }: any) => getPagePosts({
      token: session?.session.token as string,
      pageId,
      cursor: pageParam,
      limit: 10
    }),
    enabled: !!session?.session.token && !!pageId,
    getNextPageParam: (lastPage: any) => lastPage?.pagination?.nextCursor || undefined,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!postsData || postsData.pages.length === 0 || !postsData.pages[0]?.posts) {
    return (
      <Card className="text-center py-12 border-0 shadow-sm">
        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
        <p className="text-gray-500">This page hasn&apos;t shared any posts yet.</p>
      </Card>
    );
  }

  const allPosts = postsData.pages.flatMap((page: any) => page.posts || []);

  return (
    <div className="space-y-6">
      {allPosts.map((post: any) => (
        <div key={post._id}>
          {/* Render post content directly since PostCard component has different props */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={post.author?.profilePicture} alt={post.author?.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {post.author?.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{post.author?.name}</span>
                    {post.author?.isVerified && (
                      <Star className="w-4 h-4 text-blue-500 fill-current" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {post.content?.text && (
                  <p className="text-gray-900">{post.content.text}</p>
                )}
                {post.content?.media && post.content.media.length > 0 && (
                  <div className="space-y-2">
                    {post.content.media.map((media: any, index: number) => (
                      <div key={index} className="rounded-lg overflow-hidden">
                        {media.type === 'image' ? (
                          <img 
                            src={media.url} 
                            alt={media.caption || 'Post media'} 
                            className="w-full max-h-96 object-cover"
                          />
                        ) : media.type === 'video' ? (
                          <video 
                            controls 
                            className="w-full max-h-96 object-cover"
                          >
                            <source src={media.url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        ) : null}
                        {media.caption && (
                          <p className="text-sm text-gray-600 mt-1">{media.caption}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
      
      {hasNextPage && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="hover:bg-blue-50 hover:border-blue-200"
          >
            {isFetchingNextPage ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
            ) : null}
            Load More Posts
          </Button>
        </div>
      )}
    </div>
  );
}

// Page About Tab Component
function PageAboutTab({ page }: { page: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Contact Information */}
      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {page.contactInfo?.email && (
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">{page.contactInfo.email}</span>
            </div>
          )}
          {page.contactInfo?.phone && (
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">{page.contactInfo.phone}</span>
            </div>
          )}
          {page.contactInfo?.website && (
            <div className="flex items-center gap-3">
              <WebsiteIcon className="w-4 h-4 text-gray-500" />
              <a 
                href={page.contactInfo.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {page.contactInfo.website}
              </a>
            </div>
          )}
          {page.contactInfo?.address && (
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-gray-500 mt-1" />
              <div className="text-gray-700">
                {page.contactInfo.address.street && <div>{page.contactInfo.address.street}</div>}
                {page.contactInfo.address.city && page.contactInfo.address.state && (
                  <div>{page.contactInfo.address.city}, {page.contactInfo.address.state}</div>
                )}
                {page.contactInfo.address.country && <div>{page.contactInfo.address.country}</div>}
                {page.contactInfo.address.zipCode && <div>{page.contactInfo.address.zipCode}</div>}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Business Hours */}
      {page.businessHours && page.businessHours.length > 0 && (
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              Business Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {page.businessHours.map((hour: any, index: number) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span className="font-medium text-gray-700 capitalize">{hour.day}</span>
                  <span className="text-gray-600">
                    {hour.isClosed ? (
                      <span className="text-red-600">Closed</span>
                    ) : (
                      `${hour.openTime} - ${hour.closeTime}`
                    )}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Page Settings */}
      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-600" />
            Page Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                Comments: {page.settings?.allowComments ? "Enabled" : "Disabled"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                Reactions: {page.settings?.allowReactions ? "Enabled" : "Disabled"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                Sharing: {page.settings?.allowSharing ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Page Followers Tab Component
function PageFollowersTab({ page }: { page: any }) {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Followers ({page.followersCount || 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {page.followers && page.followers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {page.followers.map((follower: any) => (
              <div key={follower._id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={follower.profilePicture} alt={follower.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {follower.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{follower.name}</p>
                  <p className="text-sm text-gray-500 truncate">@{follower.username}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No followers yet</h3>
            <p className="text-gray-500">Be the first to follow this page!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Page Analytics Tab Component
function PageAnalyticsTab({ page }: { page: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-600" />
            Total Reach
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">
            {page.analytics?.totalReach?.toLocaleString() || "0"}
          </div>
          <p className="text-sm text-gray-500 mt-1">Total page views</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-600" />
            Total Engagement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">
            {page.analytics?.totalEngagement?.toLocaleString() || "0"}
          </div>
          <p className="text-sm text-gray-500 mt-1">Likes, comments, shares</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Weekly Growth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">
            {page.analytics?.weeklyStats?.[page.analytics.weeklyStats.length - 1]?.newFollowers || "0"}
          </div>
          <p className="text-sm text-gray-500 mt-1">New followers this week</p>
        </CardContent>
      </Card>
    </div>
  );
}
