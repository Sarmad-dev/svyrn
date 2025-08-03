import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { UploadCloud, X, Eye, Users, Plus } from "lucide-react";
import { cn } from "@/lib/utils"; // or use classnames if needed
import Image from "next/image";
import { User } from "@/types/global";
import { Textarea } from "../ui/textarea";
import { authClient } from "@/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStory } from "@/lib/actions/story.action";

export const StoryUploadDialog = ({ user }: { user: User }) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState<"public" | "friends">("public");
  const [storyText, setStoryText] = useState("");

  const queryCleint = useQueryClient();

  const { data } = authClient.useSession();
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["createStory"],
    mutationFn: async () =>
      await createStory({
        token: data?.session.token as string,
        content: {
          caption: storyText,
          url: previewUrl as string,
        },
        privacy,
      }),
    onSuccess: () => {
      queryCleint.invalidateQueries({
        queryKey: ["getStories", data?.user.id],
      });
      setOpen(false);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(selected);
  };

  const handleUpload = async () => {
    if (!file) return;
    await mutateAsync();
  };

  const handleRemove = () => {
    setFile(null);
    setPreviewUrl(null);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <div className="min-w-[150px] h-[200px] rounded-xl bg-white overflow-hidden relative flex-shrink-0 shadow-md">
          <Image
            src={user.profilePicture || "/images/user.png"}
            alt="Create story"
            fill
            objectFit="cover"
          />
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-2">
            <div className="bg-white text-blue-600 p-2 rounded-full mb-2">
              <Plus className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-center">Create story</p>
          </div>
        </div>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 max-w-md w-full -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl p-6 space-y-4">
          <Dialog.Title className="text-lg font-semibold text-gray-800">
            Upload Story
          </Dialog.Title>
          <Dialog.Close className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
            <X className="w-5 h-5" />
          </Dialog.Close>

          {/* Privacy Selection */}
          <div className="flex justify-between space-x-2">
            <button
              onClick={() => setPrivacy("public")}
              className={cn(
                "flex items-center px-4 py-2 rounded-lg text-sm font-medium",
                privacy === "public"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700"
              )}>
              <Eye className="w-4 h-4 mr-2" />
              Public
            </button>
            <button
              onClick={() => setPrivacy("friends")}
              className={cn(
                "flex items-center px-4 py-2 rounded-lg text-sm font-medium",
                privacy === "friends"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700"
              )}>
              <Users className="w-4 h-4 mr-2" />
              Friends
            </button>
          </div>

          {/* File Upload Area */}
          {!previewUrl ? (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-xl cursor-pointer hover:bg-gray-50 transition">
              <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-gray-500 text-sm">
                Click to upload image or video
              </p>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative">
              <button
                className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-100"
                onClick={handleRemove}>
                <X className="w-4 h-4 text-gray-700" />
              </button>
              {file?.type.startsWith?.("image/") ? (
                <div className="w-full h-64 relative">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    objectFit="cover"
                  />
                </div>
              ) : (
                <video
                  src={previewUrl}
                  controls
                  className="w-full h-64 rounded-xl"
                />
              )}
            </div>
          )}

          <Textarea
            placeholder="write what's on your mind"
            value={storyText}
            onChange={(e) => setStoryText(e.target.value)}
          />

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!file}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl transition disabled:opacity-50"
            aria-disabled={isPending}>
            {isPending ? "Uploading..." : "Upload"}
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
