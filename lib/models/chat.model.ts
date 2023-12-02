import mongoose from "mongoose"
import { number, string } from "zod"

const groupMemberSchema = new mongoose.Schema({
    id: {
        type: String
    },
    conversation_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation"
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
    leftAt: {
        type: Date
    }
})

const conversationSchema = new mongoose.Schema({
    conversation_id: {
        type: String
    },
    conversation_name: {
        type: String
    },
    numberOfMembers: {
        type: Number,
        default: 2
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GroupMember"
        }
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        }
    ]
})

const messageSchema = new mongoose.Schema({
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    body: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    parent_message_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    },
    conversation_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation"
    }
})

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

const Conversation = mongoose.models.Conversation || mongoose.model("Conversation", conversationSchema);

const GroupMember = mongoose.models.GroupMember || mongoose.model("GroupMember", groupMemberSchema);

export {
    Message, Conversation, GroupMember
}