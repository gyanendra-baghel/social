import { createContext, useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Message, User } from "../@types";
import config from "../config";
import { useUser } from "../hooks/useUser";

interface ChatContextType {
  socket: Socket | null;
  getMessagesForReceiver: (receiverUsername: string) => Promise<Message[]>;
  messagesCache: Record<string, Message[]>;
  saveMessage: (msg: Message, friendUsername: string) => void;
  friends: User[];
  saveFriends: React.Dispatch<React.SetStateAction<User[]>>;
}

export const ChatContext = createContext<ChatContextType | null>(null);

const ChatContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messagesCache, setMessagesCache] = useState<Record<string, Message[]>>(
    {}
  );
  const [friends, saveFriends] = useState<User[]>([]);
  const { authenticated } = useUser();

  useEffect(() => {
    if (authenticated) {
      const newSocket = io(config.apiUrl + "/", {
        withCredentials: true,
        reconnectionDelay: 1000 * 8, // defaults to 1000
        reconnectionDelayMax: 1000 * 15, // defaults to 5000
        reconnectionAttempts: 100, // Maximum retries
      });

      newSocket.on("connect", () => {
        setSocket(newSocket);
      });
    }

    return () => {
      if (socket) socket.disconnect();
      setSocket(null);
    };
  }, [authenticated]);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!authenticated) return;

      try {
        const response = await fetch(config.apiUrl + "/api/v1/friend", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const result = await response.json();
          if (result.success) saveFriends(result.data);
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, [authenticated]);

  const getMessagesForReceiver = useCallback(
    async (receiverUsername: string): Promise<Message[]> => {
      if (messagesCache[receiverUsername]) {
        return messagesCache[receiverUsername];
      }

      // Otherwise, fetch messages from the server
      try {
        const response = await fetch(`${config.apiUrl}/api/v1/message`, {
          method: "POST",
          body: JSON.stringify({ receiver: receiverUsername }),
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            const newMessages = result.data;

            // Cache the fetched messages for future requests
            setMessagesCache((prevCache) => ({
              ...prevCache,
              [receiverUsername]: newMessages,
            }));

            return newMessages;
          }
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }

      return [];
    },
    [messagesCache]
  );

  const saveMessage = (msg: Message, friendUsername: string) => {
    console.log("Message received:", msg);
    setMessagesCache((prevCache) => {
      const messages = prevCache[friendUsername] || [];
      const cache = {
        ...prevCache,
        [friendUsername]: [...messages, msg],
      };
      console.log("Message saved:", cache);
      return cache;
    });
  };

  if (!authenticated) {
    return (
      <div className="h-screen flex justify-center items-center text-5xl font-bold bg-neutral-800">
        Connecting...
      </div>
    );
  }

  return (
    <ChatContext.Provider
      value={{
        socket,
        messagesCache,
        saveMessage,
        getMessagesForReceiver,
        friends,
        saveFriends,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;
