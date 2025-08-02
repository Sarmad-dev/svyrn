import home from "@/../public/images/sidebar/home.png";
import pages from "@/../public/images/sidebar/pages.png";
import groups from "@/../public/images/sidebar/groups.png";
import chat from "@/../public/images/sidebar/chat.png";
import ads from "@/../public/images/sidebar/ads.png";
import post from "@/../public/images/sidebar/post.png";
import marketplace from "@/../public/images/sidebar/marketplace.png";
import profile from "@/../public/images/sidebar/profile.png";
import setting from "@/../public/images/sidebar/setting.png";

import { StaticImageData } from "next/image";

interface SidebarLinkProps {
  icon: StaticImageData;
  route: string;
  label: string;
}

export const sidebarLinks: SidebarLinkProps[] = [
  {
    icon: home,
    route: "/home",
    label: "Home",
  },
  {
    icon: pages,
    route: "/pages",
    label: "Pages",
  },
  {
    icon: groups,
    route: "/groups",
    label: "Groups",
  },
  {
    icon: chat,
    route: "/chat",
    label: "Chat",
  },
  {
    icon: ads,
    route: "/ads",
    label: "Ads",
  },
  {
    icon: post,
    route: "/post",
    label: "Post",
  },
  {
    icon: marketplace,
    route: "/marketplace",
    label: "Marketplace",
  },
  {
    icon: profile,
    route: "/profile",
    label: "Profile",
  },
  {
    icon: setting,
    route: "/settings",
    label: "Settings",
  },
];
