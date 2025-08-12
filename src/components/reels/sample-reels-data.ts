import { Reel } from '@/types/global'

export const sampleReels: Reel[] = [
  {
    _id: '1',
    author: {
      _id: 'user1',
      name: 'Al Craft',
      profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      username: 'alcraft',
      isVerified: true
    },
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&h=300&fit=crop',
      dimensions: { width: 400, height: 600 }
    },
    caption: 'Does a delight have a flavor? We think so... more',
    privacy: 'public',
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
      _id: 'user2',
      name: 'Sarah Johnson',
      profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      username: 'sarahj',
      isVerified: false
    },
    media: {
      type: 'video',
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=300&fit=crop',
      duration: 15,
      dimensions: { width: 720, height: 1280 }
    },
    caption: 'Amazing sunset view from my balcony! 🌅',
    privacy: 'public',
    tags: ['sunset', 'nature', 'beautiful'],
    hashtags: ['sunset', 'nature', 'beautiful'],
    mentions: [],
    reactions: [],
    comments: [],
    shares: 15,
    saves: 8,
    views: 890,
    trending: { score: 72, rank: 3, category: 'nature' },
    isActive: true,
    isArchived: false,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14')
  },
  {
    _id: '3',
    author: {
      _id: 'user3',
      name: 'Mike Chen',
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      username: 'mikechen',
      isVerified: true
    },
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=200&h=300&fit=crop',
      dimensions: { width: 400, height: 600 }
    },
    caption: 'Perfect morning coffee ☕️ #coffee #morning #vibes',
    privacy: 'public',
    tags: ['coffee', 'morning', 'vibes'],
    hashtags: ['coffee', 'morning', 'vibes'],
    mentions: [],
    reactions: [],
    comments: [],
    shares: 32,
    saves: 18,
    views: 2100,
    trending: { score: 91, rank: 2, category: 'lifestyle' },
    isActive: true,
    isArchived: false,
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13')
  },
  {
    _id: '4',
    author: {
      _id: 'user4',
      name: 'Emma Wilson',
      profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      username: 'emmaw',
      isVerified: false
    },
    media: {
      type: 'video',
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=300&fit=crop',
      duration: 20,
      dimensions: { width: 720, height: 1280 }
    },
    caption: 'Dance practice session 💃 #dance #practice #fitness',
    privacy: 'public',
    tags: ['dance', 'practice', 'fitness'],
    hashtags: ['dance', 'practice', 'fitness'],
    mentions: [],
    reactions: [],
    comments: [],
    shares: 28,
    saves: 15,
    views: 1750,
    trending: { score: 78, rank: 4, category: 'fitness' },
    isActive: true,
    isArchived: false,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  },
  {
    _id: '5',
    author: {
      _id: 'user5',
      name: 'David Kim',
      profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      username: 'davidkim',
      isVerified: true
    },
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=300&fit=crop',
      dimensions: { width: 400, height: 600 }
    },
    caption: 'Mountain hiking adventure! 🏔️ #hiking #adventure #nature',
    privacy: 'public',
    tags: ['hiking', 'adventure', 'nature'],
    hashtags: ['hiking', 'adventure', 'nature'],
    mentions: [],
    reactions: [],
    comments: [],
    shares: 45,
    saves: 22,
    views: 3200,
    trending: { score: 88, rank: 5, category: 'adventure' },
    isActive: true,
    isArchived: false,
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11')
  }
]
