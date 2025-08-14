/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { ReelsGrid } from "./reels-grid";
import { Reel } from "@/types/global";

interface ReelsSectionProps {
  reels: Reel[];
  onReelClick: (reel: Reel) => void;
  className?: string;
  token: string;
  currentUser: any;
}

export function ReelsSection({
  reels,
  onReelClick,
  className = "",
  token,
  currentUser,
}: ReelsSectionProps) {
  if (!reels || reels.length === 0) {
    return null;
  }

  return (
    <div className={`mb-8 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl -z-10"></div>
        <ReelsGrid
          reels={reels}
          onReelClick={onReelClick}
          className="p-6"
          token={token}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
}
