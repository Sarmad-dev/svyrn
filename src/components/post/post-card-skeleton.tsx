import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const PostCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-400 overflow-hidden mb-6 w-full animate-pulse">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
        </div>
        <Skeleton className="w-5 h-5 rounded-full" />
      </div>

      {/* Media */}
      <div className="relative w-full h-96 bg-gray-200">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Actions */}
      <div className="p-4">
        <Skeleton className="h-4 w-2/3 mb-3 rounded" />
        <div className="flex items-center gap-4 mb-3">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full ml-auto" />
        </div>

        <Skeleton className="h-4 w-24 mb-4 rounded" />

        {/* Comments */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-4 w-1/2 rounded" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-4 w-1/3 rounded" />
          </div>
        </div>

        {/* Add Comment */}
        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="h-9 w-full rounded" />
        </div>
      </div>
    </div>
  );
};
