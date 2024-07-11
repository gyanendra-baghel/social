import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
    {
        type: {
            type: String,
            enum: ['text', 'image', 'video', 'file'],
            default: 'text'
        },
        content: {
            type: String,
            required: true
        },
        seen: {
            type: Boolean,
            default: false
        },
        time: {
            type: Date,
            default: Date.now,
            required: true,
        },
    }
);


export const Message = mongoose.model("Notification", notificationSchema);
