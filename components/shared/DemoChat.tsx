"use client"

import { createChat } from "@/lib/actions/chat.actions"

interface Props {
    chatId: string
}

export default function DemoChat({ chatId } : Props) {

    return (
        <button onClick={() => createChat(chatId)} className="border-2 border-red-200 bg-red-500">
            Create Demo Chat
        </button>
    )
}