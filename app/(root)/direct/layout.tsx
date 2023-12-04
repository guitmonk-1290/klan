import LeftChatbar from "@/components/shared/LeftChatbar";

export default function ChatLayout({
    children
}: {
    children: React.ReactNode
}) {

    return (
        <>
            <main className='flex flex-row flex-1 z-50'>
                {children}
            </main>
        </>
    )
}