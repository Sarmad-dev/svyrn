/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import HomeProfileHeader from "@/components/home-profile-header";
import { PostCard } from "@/components/post-card";
import { PostCardSkeleton } from "@/components/post/post-card-skeleton";
import { StoryPreview } from "@/components/story/story-preview";
import {
  ReelsSection,
  FullscreenReelsViewer,
  CreateReelDialog,
} from "@/components/reels";
import { getPosts } from "@/lib/actions/post.action";
import { getTrendingReels } from "@/lib/actions/reel.action";
import { getMe } from "@/lib/actions/user.action";
import { authClient } from "@/lib/auth-client";
import { Post, User, Reel } from "@/types/global";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { InfiniteScrollLoader } from "@/components/ui/infinite-scroll-loader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { useMemo, useState } from "react";

const Home = () => {
  const { data: session, isPending } = authClient.useSession();
  const token = session?.session.token;

  // State for reels
  const [selectedReelIndex, setSelectedReelIndex] = useState<number | null>(
    null
  );
  const [isCreateReelOpen, setIsCreateReelOpen] = useState(false);

  // Get user data with a separate query for better performance
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["get-me"],
    queryFn: async () => await getMe(token as string),
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Get trending reels
  const { data: reelsData, refetch: refetchReels } = useQuery({
    queryKey: ["trending-reels"],
    queryFn: async () => await getTrendingReels(token as string, { limit: 10 }),
    enabled: !!token,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
  });

  // Use infinite query for posts with pagination
  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isPostsLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["infinite-posts"],
    queryFn: async ({ pageParam }) => {
      const result = await getPosts({
        token: token as string,
        cursor: pageParam,
        limit: 10,
        includeAds: true,
      });
      return result;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      const hasNext = lastPage?.pagination?.hasNextPage;
      const cursor = lastPage?.pagination?.nextCursor;

      return hasNext ? cursor : undefined;
    },
    enabled: !!token,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    // Add retry configuration for debugging
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Set up infinite scroll
  const loadingRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten posts from all pages
  const allPosts = useMemo(() => {
    const flattened =
      postsData?.pages?.flatMap((page) => page?.posts || []) || [];

    // Filter out ads to only show posts for debugging
    const postsOnly = flattened.filter(
      (item: any) => !item.itemType || item.itemType === "post"
    );

    return postsOnly; // Return only posts for now
  }, [postsData]);

  // Handle reel click to open full-screen viewer
  const handleReelClick = (reel: Reel) => {
    const reelIndex =
      reelsData?.reels.findIndex((r) => r._id === reel._id) ?? 0;
    setSelectedReelIndex(reelIndex);
  };

  // Handle closing full-screen viewer
  const handleCloseReelsViewer = () => {
    setSelectedReelIndex(null);
  };

  // Handle reel change in full-screen viewer
  const handleReelChange = (reelIndex: number) => {
    setSelectedReelIndex(reelIndex);
  };

  // Handle reel creation
  const handleReelCreated = () => {
    // Refetch reels data
    refetchReels();
  };

  // Loading states
  const isInitialLoading = isPending || isUserLoading || isPostsLoading;

  if (isInitialLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600 mb-2">
            Error loading posts
          </p>
          <p className="text-sm text-gray-600">
            {error instanceof Error ? error.message : "Something went wrong"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <HomeProfileHeader user={user as User} />
      <StoryPreview user={user as User} />

      {allPosts && allPosts.length > 0 ? (
        <>
          {/* Display first two posts */}
          {allPosts.slice(0, 2).map((post: Post, index: number) => {
            if (!post || !post._id) {
              return (
                <div key={index} className="p-4 border border-red-500">
                  Invalid post data
                </div>
              );
            }

            if (!post.author || !post.author.name) {
              return (
                <div
                  key={`${post._id}-${index}`}
                  className="p-4 border border-orange-500"
                >
                  Missing author data for post {post._id}
                </div>
              );
            }

            return (
              <div key={`${post._id}-${index}`}>
                <PostCard
                  {...post}
                  author={{
                    name: post.author.name as string,
                    profilePicture: post.author.profilePicture as string,
                    isVerified: post.author.isVerified as boolean,
                    _id: post.author._id as string,
                  }}
                  createdAt={post.createdAt as Date}
                  reactions={post.reactions}
                  currentUser={user as User}
                />
              </div>
            );
          })}

          {/* Reels Section - Display after first 2 posts */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Trending Reels
              </h2>
              <p className="text-sm text-gray-600">
                Discover amazing content from creators
              </p>
            </div>
            <Button
              onClick={() => setIsCreateReelOpen(true)}
              variant={"default"}
              className="flex bg-transparent hover:bg-transparent border-none outline-none items-center gap-2 bg-gradient-to-r cursor-pointer text-[#4EAAE9]"
            >
              <Plus size={16} />
              Create Reel
            </Button>
          </div>
          {reelsData?.reels && reelsData.reels.length > 0 && (
            <div className="mb-6">
              <ReelsSection
                reels={reelsData.reels}
                onReelClick={handleReelClick}
                token={token as string}
                currentUser={user}
              />
            </div>
          )}

          {/* Display remaining posts */}
          {allPosts.slice(2).map((post: Post, index: number) => {
            if (!post || !post._id) {
              console.log("[DEBUG] Invalid post data:", post);
              return (
                <div key={index + 2} className="p-4 border border-red-500">
                  Invalid post data
                </div>
              );
            }

            if (!post.author || !post.author.name) {
              console.log("[DEBUG] Missing author data:", post.author);
              return (
                <div
                  key={`${post._id}-${index + 2}`}
                  className="p-4 border border-orange-500"
                >
                  Missing author data for post {post._id}
                </div>
              );
            }

            return (
              <div key={`${post._id}-${index + 2}`}>
                <PostCard
                  {...post}
                  author={{
                    name: post.author.name as string,
                    profilePicture: post.author.profilePicture as string,
                    isVerified: post.author.isVerified as boolean,
                    _id: post.author._id as string,
                  }}
                  createdAt={post.createdAt as Date}
                  reactions={post.reactions}
                  currentUser={user as User}
                />
              </div>
            );
          })}

          {/* Infinite scroll loading trigger */}
          <div ref={loadingRef}>
            <InfiniteScrollLoader
              isLoading={isFetchingNextPage}
              hasNextPage={!!hasNextPage}
              totalPosts={allPosts.length}
            />
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-lg font-semibold">No Posts yet</p>
            <p className="text-sm text-gray-600 mt-2">
              Follow some friends or create your first post!
            </p>
          </div>
        </div>
      )}

      {/* Full-screen Reels Viewer */}
      {selectedReelIndex !== null && reelsData?.reels && (
        <FullscreenReelsViewer
          reels={reelsData.reels}
          initialReelIndex={selectedReelIndex}
          onClose={handleCloseReelsViewer}
          onReelChange={handleReelChange}
          token={token as string}
          currentUser={user}
        />
      )}

      {/* Create Reel Dialog */}
      {isCreateReelOpen && user && (
        <CreateReelDialog
          isOpen={isCreateReelOpen}
          onClose={() => setIsCreateReelOpen(false)}
          user={user}
          onReelCreated={handleReelCreated}
          token={token as string}
        />
      )}
    </>
  );
};

export default Home;
