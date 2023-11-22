import mongoose from "mongoose"

const chatSchema = new mongoose.Schema({
    sender_id: {
        type: String,
        required: true
    },
    recv_id : {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: false
    },
    images: {
        type: Array<String>,
        default: ['']
    }
})

const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);

export default Chat;