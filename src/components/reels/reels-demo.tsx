"use client"

import React, { useState } from 'react'
import { ReelsContainer, ReelsGrid, ReelItem, type Reel } from './index'
import { Button } from '@/components/ui/button'
import { Monitor, Smartphone, Grid, Maximize2 } from 'lucide-react'

// Sample data based on the Figma designs
export const sampleReels: Reel[] = [
  {
    _id: '1',
    author: {
      id: 'user1',
      name: 'John Doe',
      username: 'johndoe',
      profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      isVerified: true
    },
    media: {
      type: 'video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop',
      duration: 30,
      size: 1024000,
      dimensions: { width: 1080, height: 1920 }
    },
    caption: 'Does a delight have a flavor? We think so... more',
    privacy: 'public',
    location: 'New York, NY',
    tags: ['food', 'delight'],
    hashtags: ['food', 'delight'],
    mentions: [],
    reactions: [],
    comments: [],
    shares: 24,
    saves: 12,
    views: 1500,
    trending: { score: 85, rank: 1, category: 'food' },
    isActive: true,
    isArchived: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    _id: '2',
    author: {
      id: 'user2',
      name: 'Jane Smith',
      username: 'janesmith',
      profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      isVerified: false
    },
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      dimensions: { width: 1080, height: 1920 }
    },
    caption: 'Mountain adventures await! 🏔️ #adventure #nature',
    privacy: 'public',
    location: 'Rocky Mountains',
    tags: ['adventure', 'nature', 'mountains'],
    hashtags: ['adventure', 'nature', 'mountains'],
    mentions: [],
    reactions: [],
    comments: [],
    shares: 15,
    saves: 8,
    views: 890,
    trending: { score: 72, rank: 3, category: 'travel' },
    isActive: true,
    isArchived: false,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14')
  },
  {
    _id: '3',
    author: {
      id: 'user3',
      name: 'Mike Johnson',
      username: 'mikejohnson',
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      isVerified: true
    },
    media: {
      type: 'video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop',
      duration: 45,
      size: 2048000,
      dimensions: { width: 1080, height: 1920 }
    },
    caption: 'Gaming setup tour! Check out my new rig 🎮',
    privacy: 'friends',
    location: 'Gaming Room',
    tags: ['gaming', 'setup', 'tech'],
    hashtags: ['gaming', 'setup', 'tech'],
    mentions: [],
    reactions: [],
    comments: [],
    shares: 32,
    saves: 18,
    views: 2100,
    trending: { score: 91, rank: 2, category: 'gaming' },
    isActive: true,
    isArchived: false,
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13')
  },
  {
    _id: '4',
    author: {
      id: 'user4',
      name: 'Sarah Wilson',
      username: 'sarahwilson',
      profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      isVerified: false
    },
    media: {
      type: 'video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      duration: 25,
      size: 1536000,
      dimensions: { width: 1080, height: 1920 }
    },
    caption: 'Morning workout routine 💪 #fitness #motivation',
    privacy: 'public',
    location: 'Home Gym',
    tags: ['fitness', 'workout', 'motivation'],
    hashtags: ['fitness', 'workout', 'motivation'],
    mentions: [],
    reactions: [],
    comments: [],
    shares: 28,
    saves: 15,
    views: 1800,
    trending: { score: 78, rank: 4, category: 'fitness' },
    isActive: true,
    isArchived: false,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  }
]

export function ReelsDemo() {
  const [viewMode, setViewMode] = useState<'container' | 'grid'>('container')
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleReelClick = (id: string) => {
    console.log('Reel clicked:', id)
    // You can implement navigation to full-screen view here
  }

  const handleReelLike = (id: string) => {
    console.log('Liked reel:', id)
    // Implement like functionality
  }

  const handleReelComment = (id: string) => {
    console.log('Comment on reel:', id)
    // Implement comment functionality
  }

  const handleReelShare = (id: string) => {
    console.log('Share reel:', id)
    // Implement share functionality
  }

  const handleReelFollow = (username: string) => {
    console.log('Follow user:', username)
    // Implement follow functionality
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Reels Demo</h1>
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'container' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('container')}
                className="flex items-center gap-2"
              >
                <Maximize2 size={16} />
                Full Screen
              </Button>
              
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="flex items-center gap-2"
              >
                <Grid size={16} />
                Grid View
              </Button>
            </div>
          </div>

          {/* Device Preview Info */}
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Monitor size={16} />
              <span>Desktop: Use arrow keys or click navigation</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone size={16} />
              <span>Mobile: Swipe up/down to navigate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {viewMode === 'container' ? (
          <div className="h-[calc(100vh-120px)]">
            <ReelsContainer
              reels={sampleReels}
              onLike={handleReelLike}
              onComment={handleReelComment}
              onShare={handleReelShare}
              onFollow={handleReelFollow}
            />
          </div>
        ) : (
          <ReelsGrid
            reels={sampleReels}
            onReelClick={handleReelClick}
            onLike={handleReelLike}
            onComment={handleReelComment}
            onShare={handleReelShare}
            onFollow={handleReelFollow}
          />
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-white border-t border-gray-200 p-4 mt-8">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-600">
          <p>
            This is a demo of the Reels component. The component supports both image and video content,
            with responsive design for desktop and mobile devices.
          </p>
          <p className="mt-2">
            <strong>Features:</strong> Like, Comment, Share, Follow, Video Controls, Keyboard Navigation, Touch/Swipe Support
          </p>
        </div>
      </div>
    </div>
  )
}
