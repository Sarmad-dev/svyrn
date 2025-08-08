import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import React from "react";
import CreateGroupPostDialog from "./create-group-post-dialog";
import { useParams } from "next/navigation";
import { GroupWithPosts, Post, User } from "@/types/global";
import { PostCard } from "@/components/post-card";

const DiscussionContent = ({
  user,
  group,
}: {
  user: User;
  group: GroupWithPosts;
}) => {
  const { id } = useParams();
  return (
    <section className="w-full space-y-6">
      {/* Create Post Card */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="sr-only">Create Post</CardTitle>
          <CardDescription className="sr-only">
            Share something with the group
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-4">
            <div className="relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={user?.profilePicture || "/images/user.png"}
                alt="user"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <CreateGroupPostDialog groupId={id as string} user={user} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      <div className="space-y-4">
        {group.posts && group.posts.length > 0 ? (
          group.posts.map((post: Post) => (
            <PostCard
              _id={post._id}
              key={post._id}
              content={post.content}
              createdAt={post.createdAt}
              author={{
                ...post.author,
                isVerified: post.author.isVerified as boolean,
                _id: post.author._id as string,
              }}
              reactions={post.reactions}
              comments={post.comments}
              currentUser={user}
            />
          ))
        ) : (
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="py-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No posts yet
                </h3>
                <p className="text-gray-500 text-sm">
                  Be the first to share something with the group!
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default DiscussionContent;
