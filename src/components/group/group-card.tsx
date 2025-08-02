import Image from "next/image";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { joinGroup } from "@/lib/actions/group.action";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

interface GroupCardProps {
  _id: string;
  name: string;
  coverPhoto: string;
  membersCount: number;
  postsCount: number;
  isMember: boolean;
}

export const GroupCard: React.FC<GroupCardProps> = ({
  _id,
  name,
  coverPhoto,
  membersCount,
  postsCount,
  isMember,
}) => {
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationKey: ["join-group"],
    mutationFn: async () => {
      return await joinGroup({
        groupId: _id,
        token: session?.session.token as string,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-groups"] });
    },
  });

  const onJoin = async () => {
    await mutateAsync();
  };

  return (
    <div className="relative bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
      {/* Close button */}
      <button className="absolute top-3 right-3 z-10 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Group image */}
      <div className="h-28 w-full relative bg-gray-200 overflow-hidden">
        <Image
          src={coverPhoto || "/images/cover.jpeg"}
          alt={name}
          fill
          objectFit="cover"
        />
      </div>

      {/* Group info */}
      <div className="p-4">
        <Link href={`/groups/${_id}`} className="hover:underline">
          <h3 className="font-semibold text-gray-900 mb-2">{name}</h3>
        </Link>
        <p className="text-sm text-gray-600 mb-4">
          {membersCount} members • {postsCount} posts
        </p>

        <Button
          onClick={onJoin}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
          disabled={isMember}>
          {isMember ? "Joined" : "Join Group"}
        </Button>
      </div>
    </div>
  );
};
