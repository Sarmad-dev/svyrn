import * as Dialog from "@radix-ui/react-dialog";
import { X, Bookmark, MessageCircle, Share2 } from "lucide-react";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CommentItem from "./comment/comment-item";
import CommentInput from "./comment/comment-input";
import { Comment, Reaction, User } from "@/types/global";
import ReactionPopover from "./reactions/reaction-popover";

interface MediaItem {
  type: "image" | "video" | "document";
  url: string;
  caption: string;
  size: number;
  duration: number;
}

interface PostMediaDialogProps {
  media: MediaItem[];
  comments: Comment[];
  setComments: React.Dispatch<
    React.SetStateAction<
      {
        content?: string;
        author: {
          name: string;
          profilePicture: string;
        };
        createdAt: Date | string;
      }[]
    >
  >;
  reactions: Reaction[];
  postId: string;
  currentUser: User;
  author: {
    name: string;
    profilePicture: string;
    isVerified: boolean;
  };
  trigger: React.ReactNode;
}

export const PostMediaDialog = ({
  media,
  trigger,
  comments,
  setComments,
  reactions,
  postId,
  currentUser,
  author,
}: PostMediaDialogProps) => {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
  });

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Title className="sr-only">Media Dialog</Dialog.Title>
        <Dialog.Description className="sr-only">
          View and interact with media content.
        </Dialog.Description>
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-md shadow-lg relative w-[95vw] h-[90vh] flex max-md:flex-col overflow-hidden">
            {/* Close Button */}
            <Dialog.Close className="absolute top-4 right-4 z-50 text-gray-700 hover:text-red-500">
              <X size={28} />
            </Dialog.Close>

            {/* Left: Media Display */}
            <div className="w-[60%] h-full flex justify-center items-center bg-black">
              {media.length > 1 ? (
                <div ref={sliderRef} className="keen-slider w-full h-full">
                  {media.map((item, idx) => (
                    <div
                      key={idx}
                      className="keen-slider__slide flex justify-center items-center">
                      <Image
                        src={item.url}
                        alt={item.caption}
                        width={800}
                        height={800}
                        className="object-contain max-h-[85vh] w-auto"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <Image
                  src={media[0].url}
                  alt={media[0].caption}
                  width={800}
                  height={800}
                  className="object-contain max-h-[85vh] w-auto"
                />
              )}
            </div>

            {/* Right: Sidebar (White Background) */}
            <div className="w-[40%] h-full bg-white flex flex-col justify-between border-l border-gray-200">
              {/* Header */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                <Avatar>
                  <AvatarImage
                    src={author.profilePicture || "/images/user.png"}
                  />
                </Avatar>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                    {author.name}
                    {author.isVerified && (
                      <Badge variant="default" className="w-4 h-4 p-0">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Comments */}
              <div className="flex-1 overflow-y-auto px-4 space-y-4 py-4">
                {comments.length > 0 ? (
                  comments.map((comment, idx) => (
                    <CommentItem key={idx} comment={comment} postId={postId} />
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No comments yet.</p>
                )}
              </div>

              {/* Reactions and Add Comment */}
              <div className="border-t border-gray-100 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <ReactionPopover
                    postId={postId}
                    isReacted={reactions.some(
                      (r) => r.user === currentUser?.id
                    )}
                    isReactedType={
                      reactions.find((r) => r.user === currentUser?.id)
                        ?.type as
                        | "like"
                        | "love"
                        | "haha"
                        | "wow"
                        | "sad"
                        | "angry"
                    }
                  />
                  <Button variant="outline" size="icon" className="border-none">
                    <MessageCircle />
                  </Button>
                  <Button variant="outline" className="border-none">
                    <Share2 />
                  </Button>
                  <button className="ml-auto text-gray-600 hover:text-gray-800">
                    <Bookmark />
                  </button>
                </div>

                <p className="text-sm text-gray-700 font-medium mb-2">
                  {reactions.length} likes
                </p>

                {/* Comment Input */}
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                  <Avatar>
                    <AvatarImage
                      src={currentUser?.profilePicture || "/images/user.png"}
                      alt="User"
                    />
                  </Avatar>
                  <CommentInput
                    postId={postId}
                    onSuccess={(newComment) => {
                      setComments((prev) => [
                        ...prev,
                        {
                          content: newComment.content,
                          author: {
                            name: newComment.author.name,
                            profilePicture: newComment.author.profilePicture,
                          },
                          createdAt: newComment.createdAt as Date,
                        },
                      ]);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
