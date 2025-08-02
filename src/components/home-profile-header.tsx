import { getUserPosts } from "@/lib/actions/user.action";
import { authClient } from "@/lib/auth-client";
import { User } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ProfileSectionProps {
  id: string;
  name: string;
  description: string;
  website: string;
  followers: number;
  following: number;
  coverImage: string;
  profileImage: string;
  shopImage: string;
  photosImage: string;
  videosImage: string;
}

const HomeProfileHeader = ({ user }: { user: User }) => {
  const { data: session } = authClient.useSession();

  const { data: posts } = useQuery({
    queryKey: ["get-user-posts"],
    queryFn: async () =>
      await getUserPosts({
        token: session?.session.token as string,
        userId: session?.user?.id as string,
      }),
    enabled: !!session?.user?.id && !!session?.session.token,
  });

  const images = posts?.flatMap((post) =>
    post.content.media
      .filter((media) => media.type === "image")
      .map((media) => media.url)
  );

  console.log();

  const profileData = {
    id: user.id,
    name: user.name,
    description: `${user.currentJob} based in ${user.location}`,
    website: user.website,
    followers: user.followersCount,
    following: user.followingCount,
    coverImage: user.coverPhoto,
    profileImage: user.profilePicture,
    shopImage:
      "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1",
    photosImage: images?.[0],
    videosImage:
      "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-8">
      <ProfileSection {...profileData} photosImage={profileData.profileImage} />
    </div>
  );
};

const ProfileSection: React.FC<ProfileSectionProps> = ({
  id,
  name,
  description,
  website,
  followers,
  following,
  coverImage,
  profileImage,
  shopImage,
  photosImage,
  videosImage,
}) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
      {/* Cover Photo */}
      <div className="relative h-48">
        <div className="h-full w-full relative">
          <Image src={coverImage} alt="Cover" fill objectFit="cover" />
        </div>

        {/* Profile Picture */}
        <div className="absolute left-6 bottom-0 transform translate-y-1/2">
          <div className="w-32 h-32 relative rounded-full border-4 border-white overflow-hidden">
            <Image src={profileImage} alt={name} fill objectFit="cover" />
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-16 px-6 pb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{name}</h1>
        <p className="text-gray-600 mb-2">{description}</p>
        <a
          href="#"
          className="text-[#4eaae9] hover:underline text-sm font-medium">
          {website}
        </a>

        {/* Stats */}
        <div className="flex items-center gap-8 mt-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <span className="font-semibold text-gray-900">{followers}</span>
            <span className="text-gray-600 ml-1">Follows</span>
          </div>
          <div className="text-center">
            <span className="font-semibold text-gray-900">{following}</span>
            <span className="text-gray-600 ml-1">Following</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="h-24 relative rounded-lg overflow-hidden mb-2">
              <Image src={shopImage} alt="Shop" fill objectFit="cover" />
            </div>
            <Link href={`/marketplace/${id}`}>
              <p className="text-sm font-medium text-gray-700">
                Visit {name}&apos;s
                <br />
                <span>SVRYN Shop</span>
              </p>
            </Link>
          </div>

          <div className="text-center">
            <div className="h-24 relative rounded-lg overflow-hidden mb-2">
              <Image src={photosImage} alt="Photos" fill objectFit="cover" />
            </div>
            <Link href={`/profile`}>
              <p className="text-sm font-medium text-gray-700">
                View {name}&apos;s
                <br />
                <span>Photos</span>
              </p>
            </Link>
          </div>

          <div className="text-center">
            <div className="h-24 relative rounded-lg overflow-hidden mb-2">
              <Image src={videosImage} alt="Videos" fill objectFit="cover" />
            </div>
            <Link href={`/profile`}>
              <p className="text-sm font-medium text-gray-700">
                View {name}&apos;s
                <br />
                <span>Videos</span>
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeProfileHeader;
