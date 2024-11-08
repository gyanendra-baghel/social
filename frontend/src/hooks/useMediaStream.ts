import { useCallback, useRef, useState } from "react";

const useMediaStream = () => {
  const stream = useRef<MediaStream>(new MediaStream());
  const [streaming, setStreaming] = useState(false);

  const stopStream = useCallback(() => {
    if (streaming) {
      stream.current.getTracks().forEach((track) => {
        if (track.readyState === "live") {
          track.stop();
        }
      });
    }
    setStreaming(false);
  }, [streaming]);

  const startStream = useCallback(
    async (onStreamReady: unknown) => {
      if (!streaming) {
        try {
          const newStream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
          });
          stream.current = newStream;
          console.log("setting your stream");
          setStreaming(true);
          if (typeof onStreamReady == "function") onStreamReady(newStream);
        } catch (e) {
          console.log("Error in media navigator", e);
        }
      }
    },
    [streaming]
  );

  // // Clean up the stream on component unmount
  // useEffect(() => {
  //   return () => stopStream();
  // }, [stopStream]);

  return {
    stream: stream.current,
    streaming,
    stopStream,
    startStream,
  };
};

export default useMediaStream;
