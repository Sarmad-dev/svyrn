"use client";

import React, { useState } from "react";
import { ChevronRight, X } from "lucide-react";
import clsx from "clsx";
import Image from "next/image";
import { StoryUploadDialog } from "./story/story-uploader";

const users = [
  { name: "William Grace", image: "/users/william.jpg", hasNew: true },
  { name: "Tuohy S", image: "/users/tuohy.jpg", hasNew: true },
  { name: "Elash B", image: "/users/elash.jpg", hasNew: false },
  { name: "Irene James", image: "/users/irene.jpg", hasNew: true },
  { name: "Ditadi F", image: "/users/ditadi.jpg", hasNew: false },
  { name: "Andrew", image: "/users/andrew.jpg", hasNew: false },
  { name: "Sophia", image: "/users/sophia.jpg", hasNew: true },
];

const UserStories = () => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const handleStoryClick = (name: string) => {
    setSelectedUser(name);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  const selectedUserData = users.find((u) => u.name === selectedUser);

  return (
    <div className="relative bg-white py-4 px-2">
      <div className="flex space-x-6 overflow-x-auto scrollbar-hide px-2">
        {users.map((user, index) => (
          <div
            key={index}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => handleStoryClick(user.name)}>
            <div
              className={clsx(
                "w-16 h-16 rounded-full p-[2px] relative",
                user.hasNew
                  ? "bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 animate-spin-slow"
                  : "border-4 border-gray-300"
              )}>
              <div className="w-full h-full rounded-full relative">
                <Image
                  src={user.image}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover border-4 border-white"
                  fill
                  objectFit="contain"
                />
              </div>
            </div>
            <p className="text-sm font-medium mt-1 text-black text-center whitespace-nowrap">
              {user.name}
            </p>
          </div>
        ))}

        <StoryUploadDialog user={user} />

        {/* Right Arrow Scroll Indicator */}
        <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-blue-400 bg-white cursor-pointer shrink-0">
          <ChevronRight className="text-blue-500" />
        </div>
      </div>

      {/* Story Modal */}
      {selectedUserData && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-[90%] max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-blue-500">
                <Image
                  src={selectedUserData.image}
                  alt={selectedUserData.name}
                  width={160}
                  height={160}
                  className="object-cover w-full h-full"
                />
              </div>
              <h2 className="text-xl font-semibold mt-4 text-gray-800">
                {selectedUserData.name}&apos;s Story
              </h2>
              <p className="mt-2 text-gray-600 text-sm text-center">
                This is a placeholder for the story content. You can replace
                this with actual story slides or videos.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserStories;
