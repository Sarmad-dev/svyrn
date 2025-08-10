"use client";
import React, { memo } from "react";
import { PostCard } from "./post-card";
import { Post, User } from "@/types/global";

interface MemoizedPostCardProps {
  post: Post;
  currentUser: User;
  index: number;
}

// Memoized PostCard to prevent unnecessary re-renders
export const MemoizedPostCard = memo<MemoizedPostCardProps>(
  ({ post, currentUser, index }) => {
    return (
      <PostCard
        {...post}
        author={{
          name: post.author.name as string,
          profilePicture: post.author.profilePicture as string,
          isVerified: post.author.isVerified as boolean,
          _id: post.author._id as string,
        }}
        createdAt={post.createdAt as Date}
        key={`${post._id}-${index}`}
        reactions={post.reactions}
        currentUser={currentUser}
      />
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function for optimal re-rendering
    return (
      prevProps.post._id === nextProps.post._id &&
      prevProps.post.reactionsCount === nextProps.post.reactionsCount &&
      prevProps.post.commentsCount === nextProps.post.commentsCount &&
      prevProps.currentUser._id === nextProps.currentUser._id &&
      prevProps.index === nextProps.index
    );
  }
);

MemoizedPostCard.displayName = "MemoizedPostCard";
