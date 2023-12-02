"use server"

import { fetchUser } from "./user.actions"
import { connectToDB } from "../mongoose"
import User from "../models/user.model"
import { currentUser } from "@clerk/nextjs"
import { Conversation, Message } from "../models/chat.model"
import { pusherServer } from "../pusher/pusher"
import { toPusherKey } from "../utils"

export default interface MessageInterface {
    creatorId: string
    body: string,
    createdAt: any
}

export async function getChatMessages(userId: string, chatId: string) {
    try {
        const conversation_id = userId > chatId ? userId+"--"+chatId : chatId+"--"+userId;

        const conversation = await Conversation.findOne(
            { conversation_id: conversation_id }
        ).populate({
            path: 'messages',
            model: Message,
            select: 'creatorId body createdAt',
            populate: {
                path: 'creatorId',
                model: User,
                select: 'id'
            }
        }).exec();

        return conversation.messages.reverse()

    } catch (error: any) {
        console.error("[ERROR] getChatMessages(): ", error.message);
    }
}

export async function createMessage(userId: string, chatId: string, text: string) {
    try {
        connectToDB();

        const user = await fetchUser(userId);
        const conversation_id = userId>chatId ? userId.concat("--", chatId) : chatId.concat("--", userId);

        const conversation = await Conversation.findOne({
            conversation_id: conversation_id
        })

        const message = new Message({
            creatorId: user._id,
            body: text,
            conversation_id: conversation._id
        })

        const savedMessage = await message.save();

        await Conversation.findOneAndUpdate(
            { conversation_id: conversation_id },
            { $push: { messages: savedMessage._id } }
        )

        const realTimeMessage : MessageInterface = {
            creatorId: user.id,
            body: text,
            createdAt: savedMessage.createdAt
        }

        // notify clients
        console.log("[/] trigger pusher...")

        pusherServer.trigger(toPusherKey(`chat:${conversation_id}`),
        'incoming_message', realTimeMessage)

    } catch (error : any) {
        console.error("[ERROR] send(): ", error.message);
    }
}