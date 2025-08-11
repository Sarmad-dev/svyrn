/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import HomeProfileHeader from "@/components/home-profile-header";
import { PostCard } from "@/components/post-card";
import { PostCardSkeleton } from "@/components/post/post-card-skeleton";
import { StoryPreview } from "@/components/story/story-preview";
import { getPosts } from "@/lib/actions/post.action";
import { getMe } from "@/lib/actions/user.action";
import { authClient } from "@/lib/auth-client";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Post, User } from "@/types/global";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { InfiniteScrollLoader } from "@/components/ui/infinite-scroll-loader";
import React, { useMemo } from "react";

const Home = () => {
  const { data: session, isPending } = authClient.useSession();
  const token = session?.session.token;

  // Get user data with a separate query for better performance
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["get-me"],
    queryFn: async () => await getMe(token as string),
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
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
      console.log('[DEBUG] queryFn called with pageParam:', pageParam);
      const result = await getPosts({
        token: token as string,
        cursor: pageParam,
        limit: 10,
        includeAds: true,
      });
      console.log('[DEBUG] queryFn result:', result);
      return result;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      console.log('[DEBUG] getNextPageParam - Full lastPage:', lastPage);
      console.log('[DEBUG] getNextPageParam - Pagination:', lastPage?.pagination);
      console.log('[DEBUG] getNextPageParam - Posts:', lastPage?.posts);
      
      const hasNext = lastPage?.pagination?.hasNextPage;
      const cursor = lastPage?.pagination?.nextCursor;
      
      console.log('[DEBUG] getNextPageParam:', {
        hasNextPage: hasNext,
        nextCursor: cursor,
        postsCount: lastPage?.posts?.length,
        willReturnCursor: hasNext ? cursor : undefined
      });
      
      return hasNext ? cursor : undefined;
    },
    enabled: !!token,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes,
    // Add retry configuration for debugging
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Set up infinite scroll
  const { loadingRef } = useInfiniteScroll({
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    threshold: 500, // Start loading 500px before the bottom
  });

  // Flatten posts from all pages
  const allPosts = useMemo(() => {
    console.log('[DEBUG] Raw postsData:', postsData);
    console.log('[DEBUG] postsData.pages:', postsData?.pages);
    
    if (postsData?.pages) {
      postsData.pages.forEach((page, index) => {
        console.log(`[DEBUG] Page ${index}:`, {
          fullPage: page,
          posts: page?.posts,
          postsLength: page?.posts?.length,
          pagination: page?.pagination
        });
      });
    }
    
    const flattened = postsData?.pages?.flatMap((page) => page?.posts || []) || [];
    
    // Filter out ads to only show posts for debugging
    const postsOnly = flattened.filter((item: any) => !item.itemType || item.itemType === 'post');
    
    return postsOnly; // Return only posts for now
  }, [postsData]);

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
          {allPosts.map((post: Post, index: number) => {
            
            // Temporary simple render for debugging
            if (!post || !post._id) {
              console.log('[DEBUG] Invalid post data:', post);
              return <div key={index} className="p-4 border border-red-500">Invalid post data</div>;
            }

            if (!post.author || !post.author.name) {
              console.log('[DEBUG] Missing author data:', post.author);
              return <div key={`${post._id}-${index}`} className="p-4 border border-orange-500">Missing author data for post {post._id}</div>;
            }

            return (
              <div key={`${post._id}-${index}`}>            
                {/* Actual PostCard */}
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
    </>
  );
};

export default Home;
