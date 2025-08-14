import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import { sidebarLinks } from "@/lib/constants";
import { LogOut, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const MobileSheet = () => {
  const pathname = usePathname();
  const router = useRouter();

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
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" className="md:hidden">
          <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>
            <Image
              src={"/icons/logo-gray.png"}
              alt="logo"
              width={150}
              height={70}
            />
          </SheetTitle>
          <SheetDescription className="sr-only">Navigation</SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 px-2">
          <nav className="flex flex-col gap-2 pb-2">
            {sidebarLinks.map((link) => (
              <SheetClose key={link.route}>
                <Link
                  href={link.route}
                  key={link.route}
                  className={`w-full flex items-center p-2 border-b border-primary transition-colors h-[60px] ${
                    pathname.includes(link.route)
                      ? "bg-primary text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}>
                  <Image
                    src={link.icon}
                    alt={link.label}
                    className="h-12 w-12 mr-2"
                  />
                  <span>{link.label}</span>
                </Link>
              </SheetClose>
            ))}
          </nav>
        </ScrollArea>

        <SheetFooter>
          <Button
            variant="outline"
            className="flex items-center justify-start"
            onClick={handleLogout}>
            <LogOut className="mr-2" />
            Logout
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSheet;
