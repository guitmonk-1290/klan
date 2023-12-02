import LeftChatbar from "@/components/shared/LeftChatbar";
import RootLayout from "../layout";
import { headers } from "next/headers";

export default function ChatLayout({
    children
} : {
    children: React.ReactNode
}) {

    const headersList = headers();
    const pathname = headersList.get('next-url');

    return (
        <>
        <div className="flex flex-row border-2 border-gray-800 w-full h-full">
            <LeftChatbar />
            {children}
        </div>
            
        </>
    )
}