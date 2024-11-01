export interface Message {
  senderUsername: string;
  receiverUsername: string;
  content: string;
  type: "text" | "image";
  time: string;
}

export interface User {
  username: string;
  fullName: string;
  requested: undefined | boolean;
}
