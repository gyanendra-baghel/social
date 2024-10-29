export interface Message {
  sender: string;
  receiver: string;
  content: string;
  type: "text" | "image";
  time: string;
}

export interface Friend {}
