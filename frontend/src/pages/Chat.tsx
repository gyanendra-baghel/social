import { FormEvent, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Message, User } from "../@types";
import Sidebar from "../components/Sidebar";
import { useUser, useChat } from "../hooks/index";
import { ArrowLeft } from "../assets/icons";

function Chat() {
  const { username, fullname } = useUser();
  const {
    socket,
    getMessagesForReceiver,
    saveMessage,
    friends,
    messagesCache,
  } = useChat();
  const { receiver } = useParams<{ receiver?: string }>();

  const [currentInput, setCurrentInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (socket) {
      const handleMessage = (msg: Message) => {
        saveMessage(msg, msg.senderUsername);
      };

      socket.on("message", handleMessage);

      return () => {
        socket.off("message", handleMessage);
      };
    }
  }, [socket]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (receiver) {
        const fetchedMessages = await getMessagesForReceiver(receiver);
        setMessages(fetchedMessages);
      }
    };
    fetchMessages();
  }, [receiver, messagesCache, getMessagesForReceiver]);

  const sendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (currentInput.length < 2 || !receiver) return;

    const msg: Message = {
      senderUsername: username,
      receiverUsername: receiver,
      type: "text",
      content: currentInput,
      time: new Date().toLocaleString("en-US"),
    };

    socket?.emit("sendMessage", msg);
    saveMessage(msg, receiver);
    setCurrentInput("");
  };

  return (
    <main className="h-screen flex items-center bg-neutral-800 text-white">
      <div
        className={`bg-neutral-900 h-full z-40 w-full sm:w-96 ${
          receiver ? "hidden sm:flex" : "flex"
        }`}
      >
        <Sidebar />
        <div className="w-full overflow-y-scroll flex flex-col p-3 h-full">
          <header className="flex items-center">
            <div className="flex-grow ml-1 mr-2 overflow-ellipsis  whitespace-nowrap">
              <h1 className="text-2xl font-semibold">{fullname}</h1>
              <p className="text-xs">{username}</p>
            </div>
          </header>
          <hr className="mt-2" />
          <div className="flex-1">
            {friends.length === 0 ? (
              <p className="text-center mt-5 text-gray-500">
                Friends not Available.
              </p>
            ) : (
              friends.map((user: User, i: number) => (
                <Link to={`/chat/${user.username}`} key={user.username + i}>
                  <div className="user-card">
                    <p>{user.fullname}</p>
                    <p className="text-xs">{user.username}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
      <div
        className={`flex-grow flex-col h-full ${
          receiver ? "flex" : "hidden sm:flex"
        }`}
      >
        {receiver ? (
          <>
            <div className="flex justify-between items-center bg-zinc-900 p-2">
              <div className="flex items-center">
                <Link to="/chat" className="font-bold inline sm:hidden">
                  <ArrowLeft width={40} height={40} />
                </Link>
                <h2 className="text-3xl font-semibold">{receiver}</h2>
              </div>
            </div>
            <div className="flex-1 relative overflow-y-scroll overflow-hidden">
              <div className="h-full px-2">
                {messages.map((msg: Message, index: number) => {
                  return (
                    <div
                      className={`message ${
                        msg.senderUsername === username
                          ? "outgoing"
                          : "incoming"
                      }`}
                      key={`${msg.time}-${msg.senderUsername}-${index}`}
                    >
                      <p className="text">{msg.content}</p>
                      <p className="meta">{msg.time}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="m-auto rounded-lg overflow-hidden bg-white pl-2 my-3 font-normal w-80 sm:w-96 md:w-1/2 md:min-w-fit">
              <form className="flex items-center" onSubmit={sendMessage}>
                <input
                  className="outline-none bg-transparent p-3 text-black flex-grow"
                  type="text"
                  placeholder="Enter Message"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  autoComplete="off"
                  spellCheck="false"
                  autoFocus
                />
                <button
                  className="bg-orange-400 px-3 py-3 hidden sm:block"
                  type="submit"
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <h2 className="text-center mt-16 text-gray-500 text-4xl">
            No User Selected
          </h2>
        )}
      </div>
    </main>
  );
}

export default Chat;
