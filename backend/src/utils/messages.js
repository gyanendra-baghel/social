// import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";

const saveMessage = async (msg) => {
  const { senderUsername, receiverUsername, type, content } = msg;

  try {
    // const receiver = await User.findOne({ username: receiverUsername });
    // if (!receiver) return;

    const message = new Message({
      sender: senderUsername,
      receiver: receiverUsername,
      type: type || "text",
      content: content,
    });

    await message.save();
  } catch (error) {
    console.error(error.message);
  }
};

export { saveMessage };
