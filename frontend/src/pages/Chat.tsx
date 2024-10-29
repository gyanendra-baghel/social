import { FormEvent, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Friend, Message } from "../@types/Message";
import { ArrowLeft, MicIcon } from "../assets/icons";
import Sidebar from "../components/Sidebar";
import { useUser, useChat } from "../hooks/index";

function Chat() {
  const { username, fullname } = useUser();
  const { socket, messages, saveMessages, friends } = useChat();
  const [currentInput, setCurrentInput] = useState<string>("");
  const [isListening, setIsListening] = useState(false);
  const [micSupported, setMicSupported] = useState(true);
  const { receiver } = useParams<{ receiver?: string }>();

  const navigate = useNavigate();
  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    setMicSupported(false);
  }

  const startListening = () => {
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.onstart = () => {
      setIsListening(true);
    };
    recognition.onresult = (event: any) => {
      const currentTranscript = event.results[0][0].transcript;
      setCurrentInput(currentTranscript);
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    recognition.start();
  };

  useEffect(() => {
    if (socket) {
      socket.on("message", (msg: Message) => {
        saveMessages((prev: Message[]) => [...prev, msg]);
      });

      return () => {
        socket.off("message");
      };
    }
  }, [socket]);

  function sendMessage(e: FormEvent) {
    e.preventDefault();
    if (currentInput.length < 2 || !receiver) return;
    // chatContainer.current.scrollTop = chatContainer.current.scrollHeight
    const msg: Message = {
      sender: username,
      receiver,
      type: "text",
      content: currentInput,
      time: new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    if (socket) socket.emit("sendMessage", msg);
    console.log({ sender: username, receiver, msg: currentInput });
    saveMessages((prev: Message[]) => [...prev, msg]);
    setCurrentInput("");
  }

  return (
    <main className="h-screen flex items-center bg-neutral-800 text-white">
      <div
        className={`bg-neutral-900 h-full z-40 w-full sm:w-96 ${
          receiver ? "hidden sm:flex" : "flex"
        }`}
      >
        <Sidebar />
        <div className="w-full overflow-y-scroll flex flex-col p-3 h-full">
          <div className="flex items-center">
            <div className="flex-grow ml-1 mr-2 overflow-ellipsis overflow-hidden whitespace-nowrap">
              <p className="text-2xl font-semibold">{fullname}</p>
              <p className="text-xs">{username}</p>
            </div>
          </div>
          <hr className="mt-2" />
          <div className=" flex-1">
            {friends.length === 0 && (
              <p className="text-center mt-5 text-gray-500">
                Friends not Available.
              </p>
            )}
            {friends.map((user: Friend) => {
              return (
                <Link to={`/chat/${user.username}`} key={user.username}>
                  <div className="user-card">
                    <p>{user.fullName}</p>
                    <p className=" text-xs">{user.username}</p>
                  </div>
                </Link>
              );
            })}
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
            <div className="flex justify-between items-center bg-zinc-900">
              <div className="ml-2 flex items-center">
                <button
                  onClick={() => {
                    navigate(-1);
                  }}
                  className="font-bold text-2xl sm:hidden"
                >
                  <ArrowLeft height={30} width={40} />
                </button>
                <span className="text-3xl p-2 font-semibold">{receiver}</span>
              </div>
              <span className="text-3xl p-2 font-semibold mr-2">
                {username}
              </span>
            </div>
            <div className="flex-1 relative overflow-y-scroll overflow-hidden">
              <div className="h-full px-2">
                {receiver &&
                  messages.map((data: Message) => {
                    if (data.sender != receiver && data.receiver != receiver)
                      return;
                    return (
                      <div
                        className={`message ${
                          data.sender == username ? "outgoing" : "incoming"
                        }`}
                        key={Math.random() * 99999}
                      >
                        <p className="text">{data.content}</p>
                        <p className="meta">{data.time}</p>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="m-auto rounded-lg overflow-hidden bg-white pl-2 my-3 font-normal w-80 sm:w-96 md:w-1/2 md:min-w-fit">
              <form
                className="flex items-center"
                onSubmit={(e) => {
                  sendMessage(e);
                }}
              >
                <input
                  className="outline-none bg-transparent p-3 text-black flex-grow"
                  type="text"
                  placeholder="Enter Message"
                  value={currentInput}
                  onChange={(e) => {
                    setCurrentInput(e.target.value);
                  }}
                  autoComplete="off"
                  spellCheck="false"
                  autoFocus={true}
                />
                <button
                  className={`text-black mx-2 hidden sm:block ${
                    isListening && "text-orange-500"
                  }`}
                  onClick={startListening}
                  hidden={!micSupported}
                >
                  <MicIcon width={30} height={30} />
                </button>
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
