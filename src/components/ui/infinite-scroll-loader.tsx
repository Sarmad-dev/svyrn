"use client";
import React from "react";
import { Loader2 } from "lucide-react";

interface InfiniteScrollLoaderProps {
  isLoading: boolean;
  hasNextPage: boolean;
  totalPosts: number;
  className?: string;
}

export const InfiniteScrollLoader: React.FC<InfiniteScrollLoaderProps> = ({
  isLoading,
  hasNextPage,
  totalPosts,
  className = "",
}) => {
  if (isLoading) {
    return (
      <div className={`flex justify-center py-8 ${className}`}>
        <div className="flex items-center space-x-2 text-gray-500">
          <Loader2 className="animate-spin h-5 w-5" />
          <span className="text-sm">Loading more posts...</span>
        </div>
      </div>
    );
  }

  if (!hasNextPage && totalPosts > 0) {
    return (
      <div className={`flex justify-center py-8 ${className}`}>
        <div className="text-center text-gray-500">
          <p className="text-sm">🎉 You&apos;ve reached the end!</p>
          <p className="text-xs mt-1">You&apos;ve seen all {totalPosts} posts</p>
        </div>
      </div>
    );
  }

  return null;
};
