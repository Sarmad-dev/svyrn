/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React from 'react'
import { ReelsGrid } from './reels-grid'
import { Reel } from '@/types/global'

interface ReelsSectionProps {
  reels: Reel[]
  onReelClick: (reel: Reel) => void
  className?: string
  token: string
  currentUser: any
}

export function ReelsSection({ reels, onReelClick, className = '', token, currentUser }: ReelsSectionProps) {
  if (!reels || reels.length === 0) {
    return null
  }

  return (
    <div className={`mb-8 ${className}`}>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Trending Reels
            </h2>
            <p className="text-sm text-gray-600">Discover amazing content from creators</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live updates</span>
          </div>
          <span>•</span>
          <span>{reels.length} reels available</span>
        </div>
      </div>
      
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
  )
}
