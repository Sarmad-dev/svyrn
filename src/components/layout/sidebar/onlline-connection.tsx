import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getOnlineUsers } from "@/lib/actions/user.action";
import { authClient } from "@/lib/auth-client";
import { User } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React from "react";

const OnlineConnections = () => {
  const { data: session } = authClient.useSession();
  const { data, isPending } = useQuery({
    queryKey: ["online-connections"],
    queryFn: async () =>
      await getOnlineUsers({ token: session?.session.token as string }),
    enabled: !!session?.session.token,
  });

  const onlineConnections = data?.onlineUsers || [];
  const count = data?.count || 0;

  return (
    <div className="border-2 border-primary rounded-md  p-4 mt-5">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Online Connections ({count})
      </h3>
      <div className="space-y-1 max-h-80 overflow-y-auto">
        {isPending && (
          <div className="flex items-center justify-center">
            <Loader2 className="animate-spin" />
          </div>
        )}
        {onlineConnections && onlineConnections.length > 0 ? (
          onlineConnections.map(
            (
              connection: { user: User; status: "online" | "away" | "busy" },
              index: number
            ) => (
              <OnlineConnectionItem
                key={index}
                name={connection.user.name}
                avatar={connection.user.profilePicture}
                status={connection.status}
              />
            )
          )
        ) : (
          <div className="flex items-center justify-center">
            <p>No User online yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const OnlineConnectionItem = ({
  name,
  avatar,
  status,
}: {
  name: string;
  avatar: string;
  status: "online" | "away" | "busy";
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 rounded-lg cursor-pointer">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>
            {name.split(" ")[0].charAt(0) + name.split(" ")[1].charAt(0)}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-gray-700">{name}</span>
      </div>
      <div
        className={`h-2 w-2 rounded-full ${
          status === "online"
            ? "bg-green-400"
            : status === "busy"
            ? "bg-orange-400"
            : "bg-red-400"
        }`}
      />
    </div>
  );
};

export default OnlineConnections;
