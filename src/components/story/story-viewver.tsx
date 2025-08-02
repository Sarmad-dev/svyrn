import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";

type Story = {
  id: string | number;
  type: "image" | "video";
  url: string;
  name: string;
  avatarUrl: string;
  caption: string;
};

type Props = {
  stories: Story[];
  onClose: () => void;
};

export const StoryViewer = ({ stories, onClose }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(20000); // default 20s
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentStory = stories[currentIndex];

  // Handle image or video duration setup
  useEffect(() => {
    if (currentStory.type === "image") {
      setDuration(20000); // 20 seconds
    }
    setProgress(0);
  }, [currentStory]);

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  }, [currentIndex, stories, onClose]);

  // Handle progress bar animation
  useEffect(() => {
    if (currentStory.type === "video" && !duration) return;

    const updateInterval = 100;
    const steps = duration / updateInterval;

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(intervalRef.current!);
          handleNext();
          return 100;
        }
        return prev + 100 / steps;
      });
    }, updateInterval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [duration, currentStory, handleNext]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const third = window.innerWidth / 2;
    if (e.clientX > third) {
      handleNext();
    } else {
      handlePrev();
    }
  };

  const handleVideoMetadata = () => {
    if (videoRef.current?.duration) {
      setDuration(videoRef.current.duration * 1000); // convert to ms
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center overflow-hidden"
      onClick={handleTap}>
      {/* Progress Indicators */}
      <div className="absolute top-0 left-0 w-full flex gap-1 px-4 py-2 z-10">
        {stories.map((_, index) => (
          <div
            key={index}
            className="flex-1 h-1 bg-white/30 rounded overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-100 linear"
              style={{
                width:
                  index < currentIndex
                    ? "100%"
                    : index === currentIndex
                    ? `${progress}%`
                    : "0%",
              }}
            />
          </div>
        ))}
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300">
        <X className="w-6 h-6" />
      </button>

      {/* User Info */}
      <div className="absolute top-4 left-4 flex items-center gap-3 text-white">
        <div className="relative w-8 h-8 rounded-full border border-white">
          <Image
            src={currentStory.avatarUrl}
            alt={currentStory.name}
            className="rounded-full"
            fill
            objectFit="cover"
          />
        </div>
        <span className="text-sm font-medium">{currentStory.name}</span>
      </div>

      {/* Media */}
      {currentStory.type === "image" ? (
        <div className="h-[80vh] w-[calc(100vw-100px)] relative">
          <Image src={currentStory.url} alt="story" fill objectFit="contain" />
        </div>
      ) : (
        <video
          ref={videoRef}
          key={currentStory.id}
          src={currentStory.url}
          autoPlay
          muted
          playsInline
          onLoadedMetadata={handleVideoMetadata}
          onEnded={handleNext}
          className="max-h-full max-w-full object-contain"
        />
      )}

      <p className="text-white text-lg">{currentStory.caption}</p>
    </div>
  );
};
