export interface Message {
  senderUsername: string;
  receiverUsername: string;
  content: string;
  type: "text" | "image";
  time: string;
}

export interface User {
  username: string;
  fullname: string;
  requested: undefined | boolean;
  status: "online" | "offline";
}
