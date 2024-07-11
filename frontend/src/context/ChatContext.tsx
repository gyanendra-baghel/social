import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client"
import { UserContext } from "./UserContext";
import { Message } from "../@types/Message";

export const ChatContext = createContext<any>(null);

const ChatContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<any>(null);
    const [messages, saveMessages] = useState<Message[]>([]);
    const [friends, saveFriends] = useState<[]>([]);

    let { username } = useContext(UserContext);

    useEffect(() => {
        if (username) {
            const newSocket = io('http://localhost:5000/', {
                withCredentials: true,
                reconnectionDelay: 1000 * 5, // defaults to 1000
                reconnectionDelayMax: 1000 * 10, // defaults to 5000
                query: { username }
            });
            newSocket.on("connect", () => {
                setSocket(newSocket);
            });
        }

        return () => {
            if (socket) socket.disconnect();
        }
    }, [username]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/v1/friend", {
                    method: "GET",
                    credentials: "include"
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
                const response = await fetch("/api/v1/message", { credentials: "include" });
                if (response.status == 200) {
                    const data = await response.json();
                    // console.log(data);
                    saveMessages(data);
                }
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, [username]);

    if (!socket) {
        return (<div className="">Connecting...</div>)
    }

    return (
        <ChatContext.Provider value={{ socket, messages, saveMessages, friends, saveFriends }}>
            {children}
        </ChatContext.Provider>
    );
};

export default ChatContextProvider;
