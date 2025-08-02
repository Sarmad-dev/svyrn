import { Author } from "@/types/global";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { authClient } from "@/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unfollowUser } from "@/lib/actions/user.action";

const FollowingCard = ({ user }: { user: Author }) => {
  const { data } = authClient.useSession();
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationKey: ["unfollow"],
    mutationFn: async (id: string) =>
      await unfollowUser({ token: data?.session.token as string, userId: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["following"],
      });
      queryClient.invalidateQueries({
        queryKey: ["similar-users"],
      });
    },
  });
  const handleUnfollow = async () => {
    await mutateAsync(user._id as string);
  };

  return (
    <Card className="h-fit w-[210px] rounded-md p-0">
      <CardHeader className="sr-only px-0">
        <CardTitle>Following</CardTitle>
        <CardDescription>See You following</CardDescription>
      </CardHeader>
      <CardContent className="px-0 space-y-2">
        <div className="w-full h-[130px] relative">
          <Image
            src={user.profilePicture || "/images/user.png"}
            alt="profile picture"
            className="rounded-md"
            fill
            objectFit="cover"
            loading="eager"
          />
        </div>
        <Link
          className="hover:underline font-medium text-sm line-clamp-1 ml-2"
          href={`/user/${user._id}`}>
          {user.name}
        </Link>
        <div className="w-full relative">
          <Button
            className="w-[200px] ml-[5px] mb-2"
            variant="ghost"
            onClick={handleUnfollow}>
            Unfollow
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FollowingCard;
