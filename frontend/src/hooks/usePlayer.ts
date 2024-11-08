import { useState } from "react";
import { useChat } from "./useChat";

type VideoPlayer = {
  url?: MediaStream;
  muted: boolean;
  playing: boolean;
};

const usePlayer = (myId: string, roomId: string) => {
  const { socket } = useChat();
  const [players, setPlayers] = useState<Record<string, VideoPlayer>>({});

  const toggleAudio = () => {
    console.log("I toggled my audio");
    setPlayers((prev) => {
      prev[myId].muted = !prev[myId].muted;
      return { ...prev };
    });
    socket?.emit("user-toggle-audio", myId, roomId);
  };

  const toggleVideo = () => {
    console.log("I toggled my video");
    setPlayers((prev) => {
      prev[myId].playing = !prev[myId].playing;
      return { ...prev };
    });
    socket?.emit("user-toggle-video", myId, roomId);
  };

  const getPlayer = (userId: string) => {
    return players[userId];
  };

  const getOtherPlayers = () => {
    return Object.entries(players).filter(([id]) => id !== myId);
  };

  return {
    players,
    getPlayer,
    getOtherPlayers,
    setPlayers,
    toggleAudio,
    toggleVideo,
  };
};

export default usePlayer;
