"use client";

import PostForm from "@/components/post/forms/post-form";
import { Separator } from "@/components/ui/separator";

const Post = () => {
  return (
    <div className="max-md:px-3">
      <h2 className="font-semibold text-2xl">Create Post</h2>
      <Separator />
      <PostForm />
    </div>
  );
};

export default Post;
