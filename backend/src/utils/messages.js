// import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";

const saveMessage = async ({ senderUsername, receiverUsername, type, content }) => {

  try {
    // const receiver = await User.findOne({ username: receiverUsername });
    // if (!receiver) return;

    console.log({
      sender: senderUsername,
      receiver: receiverUsername,
      type: type || "text",
      content,
    });

    const message = new Message({
      sender: senderUsername,
      receiver: receiverUsername,
      type: type || "text",
      content,
    });

    await message.save();

  } catch (error) {
    console.error(error.message);
  }
}

export {
  saveMessage
}