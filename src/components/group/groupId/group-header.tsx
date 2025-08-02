import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  updateCoverPhoto,
  updateProfilePicture,
} from "@/lib/actions/group.action";
import { authClient } from "@/lib/auth-client";

interface Group {
  coverPhoto?: string;
  profilePicture?: string;
  isAdmin: boolean;
  isCreator: boolean;
}

interface Props {
  group: Group;
  groupId?: string;
  pageId?: string;
  userId?: string;
}

export default function GroupHeader({ group, groupId, pageId, userId }: Props) {
  const { data: session } = authClient.useSession();
  const isEditable = group.isAdmin && group.isCreator;
  const [coverPhoto, setCoverPhoto] = useState<string>(
    group.coverPhoto as string
  );
  const [avatar, setAvatar] = useState<string>(group.profilePicture as string);

  const inputCoverRef = useRef<HTMLInputElement>(null);
  const inputAvatarRef = useRef<HTMLInputElement>(null);

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
    mutationKey: ["updateGroupCoverPhoto"],
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

  return (
    <div className="w-full relative">
      {/* Cover Photo */}
      <div className="w-full h-96 max-md:h-64 relative group/cover overflow-hidden rounded-b-md max-md:rounded-none">
        <Image
          src={coverPhoto || "/images/cover.jpeg"}
          alt="cover photo"
          fill
          className="object-cover transition-all duration-300 group-hover/cover:blur-sm"
        />

        {isEditable && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/cover:opacity-100 transition-opacity duration-300 bg-black/30">
            <input
              type="file"
              className="hidden"
              ref={inputCoverRef}
              onChange={handleCoverPhotoChange}
            />
            <Button
              onClick={() => {
                inputCoverRef.current?.click();
              }}
              variant="secondary"
              className="flex items-center gap-2 bg-white text-black shadow-md">
              <Pencil className="w-4 h-4" />
              Change Cover Photo
            </Button>
          </div>
        )}
      </div>

      {/* Profile Picture */}
      <div className="absolute left-6 bottom-[-55px] w-[110px] h-[110px] rounded-full overflow-hidden border-4 border-white group/avatar">
        <Image
          src={avatar || "/images/user.png"}
          alt="avatar"
          fill
          className="object-cover transition-all duration-300 group-hover/avatar:blur-sm rounded-full"
        />

        {isEditable && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 bg-black/30 rounded-full">
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
              className="flex items-center gap-2 bg-white text-black shadow-md">
              <Pencil className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
