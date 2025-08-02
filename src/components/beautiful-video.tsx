import React, { useEffect, useRef } from "react";
import "plyr/dist/plyr.css";

// Define the props interface for the BeautifulVideo component
interface BeautifulVideoProps {
  src: string;
  poster?: string;
  plyrOptions?: Plyr.Options;
}

function BeautifulVideo({
  src,
  poster,
  plyrOptions = {},
  ...videoProps
}: BeautifulVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<Plyr | null>(null);

  useEffect(() => {
    let PlyrInstance: Plyr;

    // Only run on the client
    const loadPlayer = async () => {
      if (typeof window !== "undefined" && videoRef.current) {
        const Plyr = (await import("plyr")).default;
        // Import Plyr CSS from node_modules

        PlyrInstance = new Plyr(videoRef.current, {
          controls: [
            "play-large",
            "play",
            "progress",
            "current-time",
            "mute",
            "volume",
            "captions",
            "settings",
            "pip",
            "airplay",
            "fullscreen",
          ],
          ...plyrOptions,
        });

        playerRef.current = PlyrInstance;
      }
    };

    loadPlayer();

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [plyrOptions]);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      playsInline
      {...videoProps}
      className="h-96"
    />
  );
}

export default BeautifulVideo;
