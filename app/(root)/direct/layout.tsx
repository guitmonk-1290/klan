import LeftChatbar from "@/components/shared/LeftChatbar";
import RootLayout from "../layout";
import ChatRoom from "@/components/shared/ChatRoom";

export default function ChatLayout({
    children
} : {
    children: React.ReactNode
}) {
    return (
        <>
        <div className="flex flex-row border-2 border-red-200 w-full h-full">
            <LeftChatbar />
            {children}
        </div>
            
        </>
    )
}