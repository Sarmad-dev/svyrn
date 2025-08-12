# Reels System

A comprehensive reels system for the social media platform, featuring both frontend and backend components.

## Features

### Frontend Components

1. **ReelsSection** - Displays reels in a horizontal grid layout
2. **ReelsGrid** - Grid layout for displaying multiple reels
3. **ReelItem** - Individual reel item with media and interaction buttons
4. **FullscreenReelsViewer** - Full-screen viewer with vertical scrolling navigation
5. **CreateReelDialog** - Dialog for creating new reels
6. **ReelsContainer** - Container component for reels (legacy)

### Backend System

- **Reel Model** - MongoDB schema for reels with privacy, engagement, and analytics
- **ReelComment Model** - Comments system for reels with nested replies
- **ReelAnalytics Model** - Comprehensive analytics tracking
- **ReelReport Model** - Content moderation and reporting system
- **API Endpoints** - Full CRUD operations for reels and comments

## Usage

### Displaying Reels

```tsx
import { ReelsSection } from '@/components/reels'

<ReelsSection 
  reels={reelsData} 
  onReelClick={handleReelClick}
/>
```

### Full-Screen Viewer

```tsx
import { FullscreenReelsViewer } from '@/components/reels'

<FullscreenReelsViewer
  reels={reels}
  initialReelIndex={selectedIndex}
  onClose={handleClose}
  onReelChange={handleReelChange}
/>
```

### Creating Reels

```tsx
import { CreateReelDialog } from '@/components/reels'

<CreateReelDialog
  isOpen={isOpen}
  onClose={handleClose}
  user={currentUser}
  onReelCreated={handleReelCreated}
/>
```

## Navigation

### Vertical Scrolling
- **Mouse Wheel**: Scroll up/down to navigate between reels
- **Touch/Swipe**: Swipe up/down on mobile devices
- **Keyboard**: Arrow keys (Up/Down) for navigation
- **Spacebar**: Play/pause videos
- **Escape**: Close full-screen viewer

### Full-Screen Features
- Progress indicators showing current reel position
- User information and follow button
- Like, comment, share, and save actions
- Caption and audio information display
- Responsive design for all screen sizes

## Data Structure

### Reel Interface
```typescript
interface Reel {
  _id: string
  author: Author
  media: {
    type: 'image' | 'video'
    url: string
    thumbnail?: string
    duration?: number
    dimensions?: { width: number; height: number }
  }
  caption?: string
  audioInfo?: string
  privacy: 'public' | 'friends' | 'private' | 'followers'
  reactions: Reaction[]
  comments: ReelComment[]
  shares: number
  saves: number
  views: number
  trending: { score: number; rank?: number; category?: string }
  isActive: boolean
  isArchived: boolean
  createdAt: Date
  updatedAt: Date
}
```

## Integration

The reels system is integrated into the home page (`frontend/src/app/(main)/(site)/home/page.tsx`) and displays reels after the first two posts. Users can:

1. View trending reels in a horizontal grid
2. Click on any reel to open the full-screen viewer
3. Navigate between reels using vertical scrolling
4. Create new reels using the create button
5. Interact with reels (like, comment, share, save)

## Backend API

### Endpoints
- `POST /api/reels` - Create new reel
- `GET /api/reels/trending` - Get trending reels
- `GET /api/reels/feed` - Get user feed reels
- `GET /api/reels/:id` - Get specific reel
- `POST /api/reels/:id/reactions` - Toggle reactions
- `POST /api/reels/:id/comments` - Add comments
- `GET /api/reels/:id/comments` - Get reel comments

### Authentication
All endpoints require authentication via Bearer token in the Authorization header.

## Future Enhancements

- Real-time notifications for reel interactions
- Advanced analytics dashboard
- Content moderation tools
- Monetization features
- Collaborative reels
- AI-powered content recommendations

## Testing

The system includes sample data for testing purposes. Import `sampleReels` from `@/components/reels/sample-reels-data` to test the frontend components without backend integration.

## Dependencies

- React 18+
- Next.js 14+
- Tailwind CSS
- Lucide React (icons)
- TanStack Query (data fetching)
- Better Auth (authentication)
