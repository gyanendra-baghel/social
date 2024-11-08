import { useEffect, useRef } from "react";

type VideoPlayerProps = {
  stream: MediaStream | null;
  muted: boolean;
  playing: boolean;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  stream,
  muted,
  playing,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream instanceof MediaStream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return <video ref={videoRef} autoPlay={playing} muted={muted} />;
};

export default VideoPlayer;
