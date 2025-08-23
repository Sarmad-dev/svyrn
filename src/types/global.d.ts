type Author = {
  profilePicture: string;
  name: string;
  username?: string;
  isVerified?: boolean;
  _id?: string;
};

type User = {
  id: string;
  name: string;
  username: string;
  email?: string;
  profilePicture: string;
  coverPhoto: string;
  bio: string;
  currentJob: string;
  location: string;
  website: string;
  dateOfBirth?: Date | string;
  worksAt: string;
  livesIn: string;
  From: string;
  gender: "male" | "female" | "other";
  martialStatus:
    | "single"
    | "married"
    | "engaged"
    | "in a relationship"
    | "complicated";
  isVerified: boolean;
  privacy?: string;
  followers: Author[];
  following: Author[];
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  createdAt: string;
};

type Media = {
  type: "image" | "video" | "document";
  url: string;
  caption: string;
  size: number;
  duration: number;
  _id: string;
};

interface Comment {
  _id?: string;
  author: Author;
  post?: string;
  content: string;
  createdAt: string | Date; // or Date, depending on your serialization
  updatedAt?: string; // or Date
  parentComment?: string | null;
  level?: number;
  isEdited?: boolean;
  replies?: Comment[];
}

type Reaction = {
  user: {
    _id: string;
    name: string;
    profilePicture: string;
  };
  type: "like" | "love" | "haha" | "wow" | "sad" | "angry";
  createdAt: Date;
};

type Post = {
  _id: string;
  content: {
    text: string;
    media: Media[];
  };
  author: Author;
  privacy: "public" | "private" | "followers"; // adjust based on actual enum
  tags: string[];
  comments: Comment[]; // replace `any` with a proper `Comment` type if available
  isEdited: boolean;
  isActive: boolean;
  isPinned: boolean;
  isGroup: boolean;
  reactions: Reaction[]; // replace `any` with a `Reaction` type if available
  shares: number; // replace `any` with a `Share` type if available
  // editHistory: any[]; // replace `any` with a `History` type if available
  createdAt: Date; // or Date if you're parsing it
  updatedAt: string;
  __v: number;
};

type Group = {
  _id: string;
  name: string;
  description: string;
  profilePicture: string;
  coverPhoto: string;
  category: string;
  privacy: "public" | "private" | "secret";
  members: {
    user: Author;
    role: "admin" | "moderator" | "member";
  };
  membersCount: number;
  postsCount: number;
  isMember: boolean;
  createdAt: string; // ISO date string
  creator: Author;
  settings: {
    approveMembers: boolean;
    allowMemberPosts: boolean;
    allowMemberInvites: boolean;
  };
  rules: {
    title: string;
    description: string;
  }[];
  isAdmin: boolean;
  isCreator: boolean;
  isModerator: boolean;
};

export type GroupWithPosts = Group & {
  posts: Post[];
};

type Role = "admin" | "moderator" | "member";

interface Member {
  user: Author;
  role: Role;
}

type ProductCard = {
  _id: string;
  images: string[];
  title: string;
  description: string;
  price: { amount: number; currency: string };
  averageRating: number; // from 0 to 5
  location?: {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
};

interface ChatContact {
  id: number;
  name: string;
  AvatarImage: string;
  lastMessage: { content: { text: string } };
  timestamp?: string;
  isOnline?: boolean;
}

export type Message = {
  _id: string;
  conversation: string;
  sender: {
    _id: string;
    name: string;
    profilePicture: string;
  };
  content: {
    text: string;
    media: {
      type: string;
      url: string;
      caption: string;
      size: number;
    }[]; // Assuming media is an array of URLs (strings)
  };
  type: "text" | "image" | "video" | "file" | string; // Extend this union if needed
  isEdited: boolean;
  isDeleted: boolean;
  readBy: {
    user: string;
    readAt: string;
    _id: string;
  }[];
  deliveredTo: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type MessageList = Message[];

// Reel types
export interface Reel {
  _id: string;
  author: Author;
  media: {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
    duration?: number;
    size?: number;
    dimensions?: {
      width: number;
      height: number;
    };
  };
  caption?: string;
  commentCount: number;
  
  privacy: 'public' | 'friends' | 'private' | 'followers';
  location?: string;
  tags: string[];
  hashtags: string[];
  mentions: string[];
  reactions: Reaction[];
  comments: ReelComment[];
  shares: number;
  saves: {
    user: {
      _id: string;
      name: string;
      profilePicture: string;
    };
    savedAt: Date;
  }[];
  views: number;
  trending: {
    score: number;
    rank?: number;
    category?: string;
  };
  isActive: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReelComment {
  _id: string;
  reel: string;
  author: Author;
  content: string;
  parentComment?: string;
  replies: ReelComment[];
  reactions: Reaction[];
  mentions: string[];
  hashtags: string[];
  isEdited: boolean;
  editHistory: {
    content: string;
    editedAt: Date;
  }[];
  moderationStatus: 'pending' | 'approved' | 'rejected' | 'flagged';
  isHidden: boolean;
  isPinned: boolean;
  isSpam: boolean;
  spamScore: number;
  createdAt: Date;
  updatedAt: Date;
}
