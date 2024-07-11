import { Message } from "../models/message.model.js";


const getMessages = async (req, res) => {
    const user = req.user;
    try {
        const messages = await Message.find({
            $or: [
                { sender: user.username },
                { receiver: user.username },
            ]
        });
        const formattedMessages = messages.map(message => ({
            content: message.content,
            sender: message.sender,
            receiver: message.receiver,
            type: message.type,
            time: message.createdAt.toLocaleString("en-US", { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
        }));

        res.status(200).json(formattedMessages);
    } catch (error) {
        res.status(500).json({ messages: [], message: "Internal Server Error." })
    }
}

const sendMessage = async (req, res) => {
    const sender = req.user;
    let { receiver, content, type } = req.body;

    // if(!isUser(receiver))

    try {
        const message = new Message({
            sender: sender.username,
            receiver,
            type: type || "text",
            content,
        });

        await message.save();

        res.json(message).status(200);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server Error' });
    }
};

export {
    sendMessage,
    getMessages
}