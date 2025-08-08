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
import { followUser } from "@/lib/actions/user.action";

const FollowCard = ({ user }: { user: Author }) => {
  const { data } = authClient.useSession();
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationKey: ["follow"],
    mutationFn: async (id: string) =>
      await followUser({ token: data?.session.token as string, userId: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["following"],
      });
      queryClient.invalidateQueries({
        queryKey: ["similar-users"],
      });
    },
  });
  const handleFollow = async () => {
    await mutateAsync(user._id as string);
  };

  return (
    <Card className="h-fit w-[230px] rounded-xl overflow-hidden p-0 shadow-sm border hover:shadow-md transition-shadow">
      <CardHeader className="sr-only px-0">
        <CardTitle>Following</CardTitle>
        <CardDescription>See You following</CardDescription>
      </CardHeader>
      <CardContent className="px-0 space-y-3">
        <div className="w-full h-[140px] relative">
          <Image
            src={user.profilePicture || "/images/user.png"}
            alt="profile picture"
            className=""
            fill
            objectFit="cover"
            loading="eager"
          />
        </div>
        <div className="px-3">
          <Link
            className="hover:underline font-medium text-[15px] line-clamp-1"
            href={`/user/${user._id}`}>
            {user.name}
          </Link>
          <p className="text-xs text-muted-foreground">@{(user.name || "").replace(/\s+/g, "").toLowerCase()}</p>
        </div>
        <div className="px-3 pb-3">
          <Button className="w-full" variant="outline" onClick={handleFollow}>
            Follow
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FollowCard;
