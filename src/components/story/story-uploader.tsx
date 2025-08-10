import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { UploadCloud, X, Eye, Users, Plus, Image as ImageIcon, Video, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { User } from "@/types/global";
import { Textarea } from "../ui/textarea";
import { authClient } from "@/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStory } from "@/lib/actions/story.action";

interface MediaItem {
  file: File;
  previewUrl: string;
  type: 'image' | 'video';
  id: string;
}

export const StoryUploadDialog = ({ user }: { user: User }) => {
  const [open, setOpen] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [privacy, setPrivacy] = useState<"public" | "friends">("friends");
  const [caption, setCaption] = useState<string>("");

  const queryClient = useQueryClient();

  const { data } = authClient.useSession();
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["createStory"],
    mutationFn: async () => {
      const mediaData = mediaItems.map((item, index) => ({
        url: item.previewUrl,
        caption: index === 0 ? caption : "", // Only first item gets the caption
      }));
      
      return await createStory({
        token: data?.session.token as string,
        mediaItems: mediaData,
        privacy,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getStories", data?.user.id],
      });
      handleClose();
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach((file) => {
      if (mediaItems.length >= 10) return; // Max 10 items
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const newItem: MediaItem = {
          file,
          previewUrl: reader.result as string,
          type: file.type.startsWith('video/') ? 'video' : 'image',
          id: Math.random().toString(36).substr(2, 9),
        };
        
        setMediaItems(prev => [...prev, newItem]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveItem = (id: string) => {
    setMediaItems(prev => prev.filter(item => item.id !== id));
  };

  // Remove individual caption change handler as we now use single caption

  const handleUpload = async () => {
    if (mediaItems.length === 0) return;
    await mutateAsync();
  };

  const handleClose = () => {
    setOpen(false);
    setMediaItems([]);
    setCaption("");
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <div className="w-[120px] h-[200px] md:w-[140px] md:h-[240px] rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden relative cursor-pointer group hover:scale-[1.05] transition-all duration-500 shadow-xl group-hover:shadow-2xl border-2 border-white/50">
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-pink-600/20 group-hover:opacity-80 transition-opacity duration-500" />
          
          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <div className="bg-white/30 backdrop-blur-md p-4 rounded-full mb-4 group-hover:bg-white/40 transition-all duration-300 group-hover:scale-110">
              <Plus className="w-8 h-8" />
            </div>
            <p className="text-sm font-bold text-center px-3 drop-shadow-lg">Create Story</p>
          </div>
          
          {/* Enhanced Profile Picture */}
          <div className="absolute -top-3 left-3">
            <div className="relative p-1.5 rounded-full bg-gradient-to-tr from-cyan-400 via-violet-500 to-fuchsia-500 group-hover:from-cyan-500 group-hover:via-violet-600 group-hover:to-fuchsia-600 transition-all duration-500 animate-pulse">
              <div className="bg-white dark:bg-gray-900 rounded-full p-1">
                <Image
                  src={user.profilePicture || '/images/user.png'}
                  alt="Your avatar"
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              </div>
            </div>
          </div>
          
          {/* Floating Glow Effect */}
          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none shadow-[0_0_40px_rgba(147,51,234,0.5)]" />
        </div>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 max-w-2xl w-full max-h-[90vh] -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden z-50">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <Dialog.Title className="text-xl font-bold text-gray-900 dark:text-white">
                Create Story
              </Dialog.Title>
              <Dialog.Description className="sr-only">
                Upload images and videos to create a story that will be visible to your friends for 24 hours
              </Dialog.Description>
            </div>
            <Dialog.Close 
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </Dialog.Close>
          </div>

          <div className="p-6 max-h-[calc(90vh-80px)] overflow-y-auto">
            {/* Privacy Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Who can see your story?
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setPrivacy("public")}
                  className={cn(
                    "flex items-center px-6 py-3 rounded-lg text-sm font-medium transition-colors flex-1 justify-center",
                    privacy === "public"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  )}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Public
                </button>
                <button
                  onClick={() => setPrivacy("friends")}
                  className={cn(
                    "flex items-center px-6 py-3 rounded-lg text-sm font-medium transition-colors flex-1 justify-center",
                    privacy === "friends"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  )}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Friends
                </button>
              </div>
            </div>

            {/* File Upload Area */}
            {mediaItems.length === 0 ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 p-12 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <UploadCloud className="w-8 h-8 text-blue-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                      Add photos and videos
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Select up to 10 files • JPG, PNG, MP4, MOV
                    </p>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <ImageIcon className="w-4 h-4" />
                      Images
                    </div>
                    <div className="flex items-center gap-1">
                      <Video className="w-4 h-4" />
                      Videos
                    </div>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="space-y-6">
                {/* Media Grid */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Selected Media ({mediaItems.length}/10)
                    </h3>
                    {mediaItems.length < 10 && (
                      <label className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-sm">
                        <Plus className="w-4 h-4" />
                        Add More
                        <input
                          type="file"
                          accept="image/*,video/*"
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  
                  {/* Grid Layout for Media */}
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {mediaItems.map((item, index) => (
                      <div key={item.id} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                          {/* First item indicator */}
                          {index === 0 && (
                            <div className="absolute top-2 left-2 z-10 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                              Main
                            </div>
                          )}
                          
                          {/* Remove button */}
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          
                          {/* Video play indicator */}
                          {item.type === 'video' && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-black/50 rounded-full p-2">
                                <Video className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          )}
                          
                          {item.type === 'image' ? (
                            <Image
                              src={item.previewUrl}
                              alt="Preview"
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <video
                              src={item.previewUrl}
                              className="w-full h-full object-cover"
                              muted
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Single Caption for First Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Caption for your story
                  </label>
                  <Textarea
                    placeholder="What's on your mind?"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="min-h-[80px] resize-none"
                    maxLength={200}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {caption.length}/200 characters
                  </div>
                </div>
              </div>
            )}

            {/* Upload Button */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleClose}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={mediaItems.length === 0 || isPending}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sharing...
                  </div>
                ) : (
                  `Share Story ${mediaItems.length > 0 ? `(${mediaItems.length})` : ''}`
                )}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
