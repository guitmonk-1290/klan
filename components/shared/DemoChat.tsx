"use client"

interface Props {
    chatId: string
}

export default function DemoChat({ chatId } : Props) {

    return (
        <button onClick={() => {}} className="border-2 border-red-200 bg-red-500">
            Create Demo Chat
        </button>
    )
}