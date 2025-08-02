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
    <section className="w-full mt-3">
      <div className="w-full">
        <Card>
          <CardHeader>
            <CardTitle className="sr-only">Post</CardTitle>
            <CardDescription className="sr-only">Create a Post</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-5">
              <div className="relative h-[40px] w-[40px] rounded-full">
                <Image
                  src={user?.profilePicture || "/images/user.png"}
                  alt="user"
                  fill
                  objectFit="contain"
                />
              </div>
              <CreateGroupPostDialog groupId={id as string} user={user} />
            </div>
          </CardContent>
        </Card>
      </div>
      {group.posts &&
        group.posts.length > 0 &&
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
        ))}
    </section>
  );
};

export default DiscussionContent;
