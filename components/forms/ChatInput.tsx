"use client"

import { useRef, useState } from "react"
import TextAreaAutoSize from "react-textarea-autosize"
import { Button } from "../ui/button";
import { createMessage } from "@/lib/actions/chat.actions";

interface chatInputProps {
    userId: string,
    chatId: string
}

export default function ChatInput({
    userId,
    chatId
} : chatInputProps) {

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [input, setInput] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false);

    const sendMessage = async () => {
        setLoading(true);

        try {
            await createMessage(userId, chatId, input);
            setInput('');
        } catch (error : any) {
            console.error("[ERROR] sendMessage(): ", error.message);
        }
        setLoading(false);
    }

    return (
        <div className="pb-4 border-gray-600 px-4 pt-4 mb-2 sm:mb-0">
            <div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2">
                <TextAreaAutoSize 
                    ref={textareaRef}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage()
                        }
                    }}
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder='Message...'
                    className="block p-2 w-full resize-none border-0 bg-transparent text-gray-100 placeholder:text-gray-600 focus:ring-0 sm:py-1.5 sm:text-small sm:ring-6"
                />
            </div>

            
        </div>
    )
}