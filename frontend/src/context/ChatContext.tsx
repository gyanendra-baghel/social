import { createContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Message, Friend } from "../@types/Message";
import config from "../config";
import { useUser } from "../hooks/useUser";

interface ChatContextType {
  socket: Socket | null;
  messages: Message[];
  saveMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  friends: Friend[];
  saveFriends: React.Dispatch<React.SetStateAction<Friend[]>>;
}

export const ChatContext = createContext<ChatContextType | null>(null);

const ChatContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, saveMessages] = useState<Message[]>([]);
  const [friends, saveFriends] = useState<Friend[]>([]);
  const { username } = useUser();

  useEffect(() => {
    if (username) {
      const newSocket = io(config.apiUrl + "/", {
        withCredentials: true,
        reconnectionDelay: 1000 * 5, // defaults to 1000
        reconnectionDelayMax: 1000 * 10, // defaults to 5000
      });

      newSocket.on("connect", () => {
        setSocket(newSocket);
      });
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, [username]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(config.apiUrl + "/api/v1/friend", {
          method: "GET",
          credentials: "include",
        });
        if (response.status == 200) {
          const data = await response.json();
          // console.log(data.friends);
          saveFriends(data.friends);
        }
      } catch (err) {
        console.log(err);
      }
      // chat messages
      try {
        const response = await fetch(config.apiUrl + "/api/v1/message", {
          credentials: "include",
        });
        if (response.status == 200) {
          const data = await response.json();
          // console.log(data);
          saveMessages(data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [username]);

  if (!socket) {
    return (
      <div className="h-screen flex justify-center items-center text-5xl font-bold bg-neutral-800">
        Connecting...
      </div>
    );
  }

  return (
    <ChatContext.Provider
      value={{ socket, messages, saveMessages, friends, saveFriends }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;
