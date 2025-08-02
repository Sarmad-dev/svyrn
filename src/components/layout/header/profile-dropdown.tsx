import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, Users } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getUserProfile } from "@/lib/actions/user.action";
import { toast } from "sonner";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const ProfileDropdown = () => {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const { data: userData } = useQuery({
    queryKey: ["get-user", data?.user.id],
    queryFn: async () =>
      await getUserProfile(
        data?.user.id as string,
        data?.session.token as string
      ),
    enabled: !!data?.user.id && !!data?.session.token,
  });

  const user = userData?.user;

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("user logged out successfully");
          router.push("/sign-in");
        },
      },
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full p-0 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          disabled={isPending}>
          <div className="h-10 w-10 ring-2 ring-gray-500 dark:ring-gray-400 ring-offset-2 dark:ring-offset-gray-900 rounded-full flex items-center justify-center">
            {isPending ? (
              <Loader2 className="animate-spin" size={10} />
            ) : (
              <Avatar className="h-full w-full">
                <AvatarImage
                  src={user?.profilePicture || "/images/user.png"}
                  alt={user?.username}
                  className="object-cover"
                />
              </Avatar>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-72 bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-600 rounded-xl mt-2 p-2 z-[9999] transition-all duration-200 ease-in-out"
        align="end">
        <DropdownMenuLabel className="font-normal p-3">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <Avatar>
                <AvatarImage
                  src={user?.profilePicture || "/images/user.png"}
                  alt={user?.username}
                  className="object-cover"
                />
              </Avatar>

              <div>
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {user?.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-600 my-2" />
        <DropdownMenuItem className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
          <Link href={`/profile`} className="flex items-center">
            <Users className="mr-3 h-5 w-5 text-gray-600 dark:text-gray-300" />
            <span className="text-gray-900 dark:text-gray-200">Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-600 my-2" />
        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
          <LogOut className="mr-3 h-5 w-5 text-gray-600 dark:text-gray-300" />
          <span className="text-gray-900 dark:text-gray-200">Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
