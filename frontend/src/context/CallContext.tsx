import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { useChat, useUser } from "../hooks";
import Peer from "peerjs";
import useMediaStream from "../hooks/useMediaStream";
import VideoPlayer from "../components/ui/VideoPlayer";
import { EndCall, MicMute } from "../assets/icons";

export interface CallContextProps {
  isCalling: boolean;
  startCall: (receiver: string) => void;
  acceptCall: (caller: string) => void;
  endCall: () => void;
  peer: Peer | null;
  myPeerId: string;
}

export interface CallAcceptData {
  callerPeerId: string;
  receiverPeerId: string;
  caller: string;
  receiver: string;
}

export const CallContext = createContext<CallContextProps | undefined>(
  undefined
);

export const CallContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { username } = useUser();
  const [isCalling, setIsCalling] = useState(false);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [isCallAccepted, setIsCallAccepted] = useState(false);
  const { socket } = useChat();
  const [peer, setPeer] = useState<Peer | null>(null);
  const [myPeerId, setPeerMyId] = useState<string>("");
  const [caller, setCaller] = useState<string>("");
  const [callerPeerId, setCallerPeerId] = useState<string>("");
  const { stream, startStream, stopStream } = useMediaStream();
  const [receiverStream, setReceiverStream] = useState<MediaStream | null>(
    null
  );

  const startCall = (receiver: string) => {
    if (!socket) return;
    if (isCalling) {
      console.log("You are already in a call");
      return;
    }
    setIsCalling(true);
    (async function initPeer() {
      const myPeer = new (await import("peerjs")).default();
      setPeer(myPeer);

      myPeer.on("open", (id) => {
        setPeerMyId(id);
        console.log(`your peer id is ${id}`);
        socket?.emit("call-user", { receiver, peerId: id });
      });
    })();
    console.log(`calling ${receiver}`);
  };

  const acceptCall = () => {
    if (!socket && !isCalling) return;
    (async function initPeer() {
      const myPeer = new (await import("peerjs")).default();
      setPeer(myPeer);

      myPeer.on("open", (id) => {
        setPeerMyId(id);
        console.log(`your peer id is ${id}`);
        socket?.emit("call-accept", {
          caller,
          receiverPeerId: id,
          callerPeerId,
        });
      });
    })();

    console.log(`accepting call from ${callerPeerId}`);
    setIsCalling(true);
    setIsIncomingCall(false);
  };

  const endCall = () => {
    peer?.disconnect();
    peer?.destroy();
    socket?.emit("call-leave", { peer: caller });
    setIsCallAccepted(false);
    setIsCalling(false);
    stopStream();
  };

  const handleUserConnected = useCallback(
    async (data: CallAcceptData) => {
      if (!peer) return;
      const onStreamReady = (stream: MediaStream) => {
        const { callerPeerId, receiverPeerId, caller, receiver } = data;
        console.log(data);
        const newUser = caller === username ? receiver : caller;
        console.log(`user connected in call with user ${newUser}`);
        if (username === caller) {
          // console.log(`calling ${receiver}`);
          const call = peer.call(receiverPeerId, stream);
          call.on("stream", (incomingStream) => {
            console.log(`incoming stream from ${newUser}`);
            setReceiverStream(incomingStream);
          });
          setIsCallAccepted(true);
        } else if (username === receiver) {
          // console.log(`calling ${caller}`);
          const call = peer.call(callerPeerId, stream);
          call.on("stream", (incomingStream) => {
            console.log(`incoming stream from ${newUser}`);
            setReceiverStream(incomingStream);
          });
          setIsCallAccepted(true);
        }
      };
      await startStream(onStreamReady);
    },
    [peer, startStream, username]
  );

  useEffect(() => {
    peer?.on("close", () => {
      console.log("peer disconnected");
      setIsCallAccepted(false);
      setIsCalling(false);
    });

    peer?.on("call", (call) => {
      const { peer: callerId } = call;
      call.answer(stream);
      call.on("stream", (incomingStream) => {
        console.log(`incoming stream from ${callerId}`);
        setReceiverStream(incomingStream);
      });
    });
    return () => {
      if (peer) {
        peer.off("call");
        peer.off("close");
      }
    };
  }, [peer, stream]);

  useEffect(() => {
    socket?.on("call-made", ({ peerId, caller }) => {
      console.log(`incoming call from ${caller}`);
      setCaller(caller);
      setCallerPeerId(peerId);
      setIsIncomingCall(true);
      setIsCalling(true);
    });

    socket?.on("call-ended", () => {
      peer?.disconnect();
      peer?.destroy();
      setIsCalling(false);
      setIsCallAccepted(false);
      stopStream();
    });

    socket?.on("call-accepted", handleUserConnected);
    return () => {
      socket?.off("call-made");
      socket?.off("call-ended");
      socket?.off("call-accepted");
    };
  }, [socket, handleUserConnected, stopStream]);

  return (
    <>
      {isIncomingCall && (
        <div className="fixed bottom-0 right-0 z-50 flex items-center bg-black p-3 px-5 rounded">
          <p className="mr-10">
            Incoming call <b>{caller ? `(${caller})` : ""}</b>
          </p>
          <button className="bg-orange-500 p-1 rounded-md" onClick={acceptCall}>
            Accept
          </button>
        </div>
      )}
      {isCallAccepted && (
        <div className="fixed bottom-0 right-0 z-50 bg-black p-2 px-4 rounded-md flex flex-col items-center">
          <div className="mb-2">
            In Call <b>{caller ? `(${caller})` : ""}</b>
          </div>
          <VideoPlayer
            stream={stream}
            muted={true}
            playing={true}
            hidden={true}
          />
          <VideoPlayer
            stream={receiverStream}
            muted={false}
            playing={true}
            hidden={true}
          />
          <div className="flex justify-between min-w-[200px]">
            <EndCall
              width={30}
              height={30}
              color="red"
              className="mx-3"
              onClick={endCall}
            />
            <MicMute
              width={30}
              height={30}
              color="white"
              className="mx-3 opacity-50"
            />
          </div>
        </div>
      )}
      <CallContext.Provider
        value={{ isCalling, startCall, acceptCall, endCall, peer, myPeerId }}
      >
        {children}
      </CallContext.Provider>
    </>
  );
};
