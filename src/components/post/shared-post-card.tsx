/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { formateDate } from "@/lib/utils";

interface SharedPostCardProps {
  sharer: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  sharedAt: string | Date;
  caption?: string;
  target?: {
    type: "feed" | "group" | "conversation";
    name?: string;
    id?: string;
  };
  originalPost: {
    _id: string;
    author: {
      _id: string;
      name: string;
      profilePicture?: string;
    };
    createdAt: string | Date;
    content: {
      text?: string;
      media?: { type: "image" | "video" | "document"; url: string }[];
    };
  };
}

export const SharedPostCard: React.FC<SharedPostCardProps> = ({
  sharer,
  sharedAt,
  caption,
  target,
  originalPost,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 w-full border border-gray-100">
      {/* Share Header */}
      <div className="p-4 flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={sharer.profilePicture || "/images/user.png"} alt={sharer.name} />
        </Avatar>
        <div className="flex-1">
          <div className="text-sm text-gray-800">
            <Link href={`/user/${sharer._id}`} className="font-semibold hover:underline">
              {sharer.name}
            </Link>{" "}
            <span className="text-gray-600">shared</span>{" "}
            <Link href={`/user/${originalPost.author._id}`} className="font-semibold hover:underline">
              {originalPost.author.name}
            </Link>
            {target && target.type !== "feed" && target.name && (
              <>
                {" "}
                <span className="text-gray-600">in</span>{" "}
                <Link
                  href={`/${target.type === "group" ? "groups" : "chat"}/${target.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {target.name}
                </Link>
              </>
            )}
            <span className="text-gray-500"> • {formateDate(sharedAt)}</span>
          </div>
          {caption && <p className="mt-1 text-gray-700 text-sm">{caption}</p>}
        </div>
      </div>

      {/* Original Post Preview */}
      <div className="mx-4 mb-4 rounded-lg border bg-gray-50">
        <div className="p-3 flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={originalPost.author.profilePicture || "/images/user.png"}
              alt={originalPost.author.name}
            />
          </Avatar>
          <div className="text-sm">
            <Link href={`/user/${originalPost.author._id}`} className="font-semibold hover:underline">
              {originalPost.author.name}
            </Link>
            <span className="text-gray-500"> • {formateDate(originalPost.createdAt)}</span>
          </div>
        </div>

        {originalPost.content.text && (
          <p className="px-3 pb-3 text-gray-800 text-sm">{originalPost.content.text}</p>
        )}

        {originalPost.content.media && originalPost.content.media.length > 0 && (
          <div className="relative w-full aspect-[4/2.5] bg-gray-100">
            <Image
              src={originalPost.content.media[0].url}
              alt="Shared post content"
              fill
              className="object-cover rounded-b-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
};


