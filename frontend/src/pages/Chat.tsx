import { FormEvent, useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Message, User } from "../@types";
import Sidebar from "../components/Sidebar";
import { useUser, useChat } from "../hooks/index";
import {
  ArrowLeft,
  MoreVertical,
  Smile,
  Paperclip,
  Send,
  Mic,
  Search,
  // Video,
  Lock,
  Phone,
  MessageCircle,
} from "lucide-react";

import ProfileImage from "../components/ProfileImage";
import { useCall } from "../hooks/useCall";
import OnlineIndicator from "../components/OnlineIndicator";
import DateSeparator from "../components/DateSeparator";
import { getDateLabel, formatMessageTime } from "../utils/dateHelpers";

function Chat() {
  const { username, fullname } = useUser();
  const {
    socket,
    getMessagesForReceiver,
    saveMessage,
    friends,
    messagesCache,
    getUserStatus,
  } = useChat();
  const { startCall } = useCall();
  const { receiver } = useParams<{ receiver?: string }>();

  const [currentInput, setCurrentInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [contactSearch, setContactSearch] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const filtered = friends
      .filter(
        (u) =>
          contactSearch.length === 0 ||
          u.fullname.toLowerCase().includes(contactSearch.toLowerCase()) ||
          u.username.toLowerCase().includes(contactSearch.toLowerCase())
      )
      .sort((a, b) => {
        if (a.status === "online" && b.status === "offline") return -1;
        if (a.status === "offline" && b.status === "online") return 1;
        return 0;
      });
    setFilteredUsers(filtered);
  }, [friends, contactSearch]);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const receiverStatus = receiver ? getUserStatus(receiver) : "offline";

  return (
    <main className="h-screen flex bg-[#0a0a0f] text-slate-100 overflow-hidden">
      <div
        className={`h-full z-40 w-full sm:w-[360px] flex-shrink-0 border-r border-white/5 ${receiver ? "hidden sm:flex" : "flex"
          }`}
      >
        <Sidebar />

        <div className="flex flex-col h-full w-full bg-[#0d0d14]">
          {/* My profile header */}
          <header className="flex items-center px-4 py-3 h-[65px] border-b border-white/5 flex-shrink-0">
            <div className="relative">
              <ProfileImage firstName={fullname} size={42} />
              <span
                className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-[#0a0a0f]"
                style={{ boxShadow: "0 0 6px #22c55e" }}
              />
            </div>
            <div className="ml-3 flex-grow overflow-hidden">
              <h1 className="text-sm font-semibold text-slate-100 truncate">
                {fullname}
              </h1>
              <p className="text-xs text-slate-500 truncate">@{username}</p>
            </div>
            <button className="p-2 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-colors">
              <MoreVertical size={18} />
            </button>
          </header>

          {/* Search Connections */}
          <div className="px-3 py-2.5 border-b border-white/5 flex-shrink-0">
            <div className="glass-input flex items-center px-3 h-9 gap-2">
              <Search className="text-slate-600 shrink-0" size={14} />
              <input
                type="text"
                placeholder="Search Connections..."
                className="bg-transparent outline-none text-sm text-slate-200 placeholder-slate-600 flex-grow w-full"
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
                autoComplete="off"
              />
            </div>
          </div>

          {/* Contact list */}
          <div className="flex-1 overflow-y-auto py-2">
            {friends.length === 0 ? (
              <p className="text-center mt-10 text-slate-600 text-sm px-4">
                No connections yet. Find people to start chatting.
              </p>
            ) : filteredUsers.length === 0 ? (
              <p className="text-center mt-6 text-slate-600 text-sm px-4">
                No connections match your search.
              </p>
            ) : (
              filteredUsers.map((user: User, i: number) => (
                <Link to={`/chat/${user.username}`} key={user.username + i}>
                  <div
                    className={`user-card flex items-center ${receiver === user.username ? "active" : ""
                      }`}
                  >
                    <div className="relative shrink-0">
                      <ProfileImage firstName={user.fullname} size={46} />
                      <OnlineIndicator status={user.status} size="sm" />
                    </div>
                    <div className="flex-grow ml-3 overflow-hidden">
                      <div className="flex justify-between items-baseline">
                        <p className="text-sm font-medium text-slate-100 truncate">
                          {user.fullname}
                        </p>
                        <span className="text-[11px] text-slate-600 ml-2 shrink-0">
                          {messagesCache[user.username]?.slice(-1)[0]?.time
                            ? formatMessageTime(
                              messagesCache[user.username].slice(-1)[0].time
                            )
                            : ""}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 truncate mt-0.5">
                        {messagesCache[user.username]?.slice(-1)[0]?.content ||
                          "@" + user.username}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ─── RIGHT PANEL ────────────────────────────────────── */}
      <div
        className={`flex-grow flex-col h-full ${receiver ? "flex" : "hidden sm:flex"
          }`}
      >
        {receiver ? (
          <>
            {/* Chat header */}
            <div className="flex items-center px-4 py-2 h-[65px] border-b border-white/5 glass-card flex-shrink-0">
              <Link
                to="/chat"
                className="mr-2 sm:hidden text-slate-400 hover:text-slate-200 transition-colors"
              >
                <ArrowLeft width={22} height={22} />
              </Link>

              <div className="relative mr-3 shrink-0">
                <ProfileImage firstName={receiver} size={42} />
                <OnlineIndicator status={receiverStatus} size="md" />
              </div>

              <div className="flex-grow overflow-hidden">
                <h2 className="text-sm font-semibold text-slate-100 truncate">
                  {receiver}
                </h2>
                <p className="text-xs">
                  {receiverStatus === "online" ? (
                    <span className="text-green-400">● online</span>
                  ) : (
                    <span className="text-slate-500">last seen recently</span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-0.5">
                {/* <button className="p-2 rounded-lg text-slate-600 hover:text-slate-200 hover:bg-white/5 transition-colors">
                  <Video size={18} />
                </button> */}
                <button
                  className="p-2 rounded-lg text-slate-600 hover:text-slate-200 hover:bg-white/5 transition-colors"
                  onClick={() => startCall(receiver)}
                >
                  <Phone size={18} />
                </button>
                <button className="p-2 rounded-lg text-slate-600 hover:text-slate-200 hover:bg-white/5 transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto chat-bg">
              <div className="py-4">
                {messages.reduce(
                  (acc: React.ReactNode[], msg: Message, index: number) => {
                    const label = getDateLabel(msg.time);
                    const prevLabel =
                      index > 0
                        ? getDateLabel(messages[index - 1].time)
                        : null;
                    if (label && label !== prevLabel) {
                      acc.push(
                        <DateSeparator key={`sep-${index}`} label={label} />
                      );
                    }
                    const isOutgoing = msg.senderUsername === username;
                    acc.push(
                      <div
                        className={`message ${isOutgoing ? "outgoing" : "incoming"
                          }`}
                        key={`${msg.time}-${msg.senderUsername}-${index}`}
                      >
                        <p className="text">{msg.content}</p>
                        <div className="meta">
                          <span>{formatMessageTime(msg.time)}</span>
                        </div>
                      </div>
                    );
                    return acc;
                  },
                  []
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input bar */}
            <div className="border-t border-white/5 glass-card px-3 py-3 flex-shrink-0">
              <form className="flex items-center gap-2" onSubmit={sendMessage}>
                <button
                  type="button"
                  className="p-2 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-colors shrink-0"
                >
                  <Smile size={20} />
                </button>
                <button
                  type="button"
                  className="p-2 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-colors shrink-0"
                >
                  <Paperclip size={20} />
                </button>

                <div className="glass-input flex-grow px-4 py-2.5">
                  <input
                    className="w-full bg-transparent outline-none text-sm text-slate-200 placeholder-slate-600"
                    type="text"
                    placeholder="Type a message..."
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    autoComplete="off"
                    spellCheck="false"
                    autoFocus
                  />
                </div>

                <button
                  type={currentInput.length >= 2 ? "submit" : "button"}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl shrink-0 transition-all ${currentInput.length >= 2
                    ? "bg-blue-600 text-white hover:bg-blue-500"
                    : "bg-white/5 text-slate-500 hover:bg-white/10 hover:text-slate-300"
                    }`}
                  style={
                    currentInput.length >= 2
                      ? { boxShadow: "0 0 16px rgba(37,99,235,0.45)" }
                      : {}
                  }
                >
                  {currentInput.length >= 2 ? (
                    <Send size={18} />
                  ) : (
                    <Mic size={18} />
                  )}
                </button>
              </form>
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center chat-bg select-none relative">
            <div
              className="w-28 h-28 rounded-3xl glass-card flex items-center justify-center mb-6"
              style={{ boxShadow: "0 0 40px rgba(37,99,235,0.12)" }}
            >
              <MessageCircle size={56} className="text-blue-500/40" />
            </div>
            <h2 className="text-xl font-semibold text-slate-200 mb-2">
              Your conversations
            </h2>
            <p className="text-sm text-slate-500 text-center max-w-xs px-4">
              Select a connection from the left to start a conversation.
            </p>
            <div className="absolute bottom-5 flex items-center gap-2 text-slate-700 text-xs">
              <Lock size={11} />
              <span>Messages are private and secure</span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Chat;
