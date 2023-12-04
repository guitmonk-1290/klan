"use client"

import MessageInterface from "@/lib/actions/chat.actions";
import { FC, useEffect, useRef, useState } from "react"
import moment from "moment";
import Image from "next/image";
import { pusherClient } from "@/lib/pusher/pusher";
import { toPusherKey } from "@/lib/utils";

interface ChatMessagesProps {
    initialMessages: MessageInterface[]
    userId: string,
    u_image: string,
    o_image: string,
    chatId: string
}

const ChatMessages : FC<ChatMessagesProps> = ({
    initialMessages,
    userId,
    u_image,
    o_image,
    chatId
}) => {

    const [messages, setMessages] = useState<MessageInterface[]>(initialMessages);

    useEffect(() => {
        pusherClient.subscribe(
            toPusherKey(`chat:${chatId}`)
        )
        console.log("subscribed to pusher: ", `chat:${chatId}`);

        const messageHandler = (message: any) => {
            console.log("[+] ------------------ new message ---------------------- [+]")
            setMessages((prev) => [message, ...prev])
        }

        pusherClient.bind('incoming_message', messageHandler)

        return () => {
            pusherClient.unsubscribe(
                toPusherKey(`chat:${chatId}`)
            )
            pusherClient.unbind('incoming_message', messageHandler)
        }
    }, [])

    console.log("[OK] initialMessages: ", initialMessages);

    const scrollDownRef = useRef<HTMLDivElement | null>(null);

    const formatTimestamp = (timestamp: number) => {
        return moment(timestamp).format("HH:mm");
    }

    return (
        <div id="messages" className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter bg-gradient-to-b from-white to-violet-200 scrollbar-w-2 scrollbar-touch">
            <div ref={scrollDownRef} />

            {messages.map((message, index) => {
                const isCurrentUser = message.creatorId === userId

                const hasNextMessageFromSameUser = messages[index-1]?.creatorId === messages[index].creatorId
                
                return (
                    <div 
                        className="chat-message" 
                        key={`${message.creatorId}-${message.createdAt}`}>
                            <div className={`flex items-end ${isCurrentUser ? 'justify-end' : ''}`}>
                                <div
                                    className={`flex flex-col space-y-2 text-[14px] max-w-xs mx-2 ${isCurrentUser ? 'order-1 items-end' : 'order-2 items-start'}`}
                                >
                                    <span 
                                        className={`px-2 py-2 rounded-lg inline-block ${isCurrentUser ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-200'} ${!hasNextMessageFromSameUser && isCurrentUser ? 'rounded-br-none' : ''}
                                        ${!hasNextMessageFromSameUser && !isCurrentUser ? 'rounded-bl-none' : ''}`}
                                    >
                                        {message.body}{' '}
                                        <span className="ml-2 text-[12px] text-gray-300">
                                            {formatTimestamp(message.createdAt)}
                                        </span>
                                    </span>
                                </div>

                                <div className={`relative w-[28px] h-[28px] rounded-full ${isCurrentUser ? 'order-2' : 'order-1'} ${hasNextMessageFromSameUser ? 'invisible' : ''}`}>
                                    <Image
                                        alt={'chat user'}
                                        src={isCurrentUser ? u_image : o_image}
                                        width={28}
                                        height={28}
                                        className="rounded-full"
                                    />
                                </div>
                            </div>
                    </div>
                )
            })}
        </div>
    )
}

export default ChatMessages