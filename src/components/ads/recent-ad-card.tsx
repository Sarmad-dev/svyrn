import Image from "next/image";
import React from "react";

interface RecentAdProps {
  author: {
    name: string;
    avatar: string;
  };
  image: string;
  likes: number;
  comments: number;
  hashtags: string[];
  description: string;
}

const RecentAdCard: React.FC<RecentAdProps> = ({
  author,
  image,
  likes,
  comments,
  hashtags,
  description,
}) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 mb-4">
      <div className="h-48 relative bg-gray-200 overflow-hidden">
        <Image src={image} alt="Ad content" fill objectFit="cover" />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative h-10 w-10">
            <Image
              src={author.avatar}
              alt={author.name}
              className="rounded-full"
              fill
              objectFit="cover"
            />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">{author.name}</h4>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>❤️ {likes}</span>
              <span>💬 {comments}</span>
            </div>
          </div>
        </div>
        <div className="flex">
          {hashtags?.map((tag) => (
            <p key={tag} className="text-blue-500 text-sm mb-2">
              #{tag}
            </p>
          ))}
        </div>
        <p className="text-gray-700 text-sm">{description}</p>
      </div>
    </div>
  );
};

export default RecentAdCard;
