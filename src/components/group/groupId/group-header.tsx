import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  updateCoverPhoto,
  updateProfilePicture,
} from "@/lib/actions/group.action";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface Group {
  coverPhoto?: string;
  profilePicture?: string;
  isAdmin: boolean;
  isCreator: boolean;
  name?: string;
}

interface Props {
  group: Group;
  groupId?: string;
  pageId?: string;
  userId?: string;
  compact?: boolean;
  noHorizontalPadding?: boolean;
}

export default function GroupHeader({ group, groupId, pageId, userId, compact = false, noHorizontalPadding = false }: Props) {
  const { data: session } = authClient.useSession();
  const isEditable = group.isAdmin && group.isCreator;
  const [coverPhoto, setCoverPhoto] = useState<string>(
    group.coverPhoto as string
  );
  const [avatar, setAvatar] = useState<string>(group.profilePicture as string);

  const inputCoverRef = useRef<HTMLInputElement>(null);
  const inputAvatarRef = useRef<HTMLInputElement>(null);

  const [isTouchDevice, setIsTouchDevice] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isTouch =
        "ontouchstart" in window ||
        (navigator &&
          (navigator.maxTouchPoints > 0 ||
            (window.matchMedia && window.matchMedia("(hover: none)").matches)));
      setIsTouchDevice(!!isTouch);
    }
  }, []);

  const { mutate } = useMutation({
    mutationKey: ["updateGroupCoverPhoto"],
    mutationFn: async (coverPhoto: string) => {
      const result = await updateCoverPhoto({
        image: coverPhoto,
        token: session?.session.token as string,
        groupId: groupId,
        pageId: pageId,
        userId: userId,
      });
      return result.url;
    },
  });

  const { mutate: mutateProfilePicture } = useMutation({
    mutationKey: ["updateGroupProfilePicture"],
    mutationFn: async (profilePicture: string) => {
      const result = await updateProfilePicture({
        image: profilePicture,
        token: session?.session.token as string,
        groupId: groupId,
        pageId: pageId,
        userId: userId,
      });
      return result.url;
    },
  });

  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const preview = reader.result as string;
        setCoverPhoto(preview);
        if (preview) {
          mutate(preview);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const preview = reader.result as string;
        setAvatar(preview);

        if (preview) {
          mutateProfilePicture(preview);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleCoverClick = () => {
    if (!isEditable) return;
    if (!isTouchDevice) return;
    inputCoverRef.current?.click();
  };

  return (
    <div className="w-full relative">
      {/* Cover Photo */}
      <div onClick={handleCoverClick} className={cn(
        "w-full relative group/cover overflow-hidden rounded-b-md max-md:rounded-b-none",
        compact ? "h-[200px] md:h-[300px]" : "h-[300px] md:h-[400px]"
      )}>
        <Image
          src={coverPhoto || "/images/cover.jpeg"}
          alt="cover photo"
          fill
          className={cn(
            isEditable && "group-hover/cover:brightness-75 transition-all"
          )}
          priority
        />
        {isEditable && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/cover:opacity-100 transition-opacity duration-300 bg-black/40 pointer-events-none group-hover/cover:pointer-events-auto">
            <input
              type="file"
              className="hidden"
              ref={inputCoverRef}
              onChange={handleCoverPhotoChange}
            />
            <Button
              onClick={(e) => {
                e.stopPropagation();
                inputCoverRef.current?.click();
              }}
              variant="secondary"
              className="flex items-center gap-2 bg-white text-black shadow-lg rounded-full px-4 py-2 hover:bg-gray-100">
              <Pencil className="w-5 h-5" />
              Edit Cover
            </Button>
          </div>
        )}
      </div>
      {/* Profile Picture and Name Container */}
      <div className={cn("container mx-auto", noHorizontalPadding ? "px-0" : "px-4 md:px-6") }>
        <div className="relative flex flex-col items-center md:items-start gap-4 pt-4 md:pt-0">
          {/* Profile Picture - Positioned to overlap cover photo */}
          <div className={cn(
            "absolute left-1/2 md:left-0 transform md:transform-none -translate-x-1/2 md:translate-x-0 w-[180px] h-[180px] rounded-full overflow-hidden border-4 border-white shadow-xl group/avatar flex-shrink-0 bg-white",
            compact ? "-top-[90px] md:-top-[100px]" : "-top-[100px] md:-top-[120px]"
          )}>
            <Image
              src={avatar || "/images/user.png"}
              alt="avatar"
              fill
              className={cn(
                "rounded-full object-cover",
                isEditable && "group-hover/avatar:brightness-75 transition-all"
              )}
            />
            {isEditable && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 bg-black/40 rounded-full">
                <input
                  type="file"
                  className="hidden"
                  ref={inputAvatarRef}
                  onChange={handleAvatarChange}
                />
                <Button
                  onClick={() => {
                    inputAvatarRef.current?.click();
                  }}
                  variant="secondary"
                  className="flex items-center gap-2 bg-white text-black shadow-lg rounded-full px-4 py-2 hover:bg-gray-100">
                  <Pencil className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
          {/* Group Name */}
          <div className={cn(
            "text-center md:text-left mb-4 md:mb-0 md:ml-[200px]",
            compact ? "mt-[85px] md:mt-0" : "mt-[100px] md:mt-[10px]"
          )}>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {group.name}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
