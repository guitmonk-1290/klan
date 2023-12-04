import { fetchUser } from "@/lib/actions/user.actions";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs";
import { notFound } from "next/navigation";
import DemoChat from "@/components/shared/DemoChat";
import { getChatMessages } from "@/lib/actions/chat.actions";
import Chat from "@/components/shared/Chat";
import ChatMessages from "@/components/shared/ChatMessages";
import ChatInput from "@/components/forms/ChatInput";
import { Conversation, Message } from "@/lib/models/chat.model";
import User from "@/lib/models/user.model";
import { messageArrayValidation } from "@/lib/validations/message";
import MessageInterface from "@/lib/actions/chat.actions"
import { headers } from "next/headers";
import LeftChatbar from "@/components/shared/LeftChatbar";


async function Page({ params }: { params: { id: string } }) {

    const headersList = headers();
    const pathname = headersList.get('next-url');

    if (!params.id) return notFound();

    // user must be logged in
    const user = await currentUser();
    if (!user) return notFound();

    const u_user = await fetchUser(user.id);

    // userId must be a connect of the current user
    const isConnect = u_user.connects.find((connect: any) => connect.id === params.id);
    if (!isConnect) return notFound();

    const o_user = await fetchUser(params.id);

    const chatId = user.id > params.id ? user.id + "--" + params.id : params.id + "--" + user.id

    const messages = await getChatMessages(user.id, params.id);
    let initialMessages: MessageInterface[] = [];
    // console.log("TYPE : ", conversation.messages[0].creatorId);
    // console.log("conversation: ", conversation);
    messages.map((message: any) => {
        const obj = {
            creatorId: message.creatorId.id,
            body: message.body,
            createdAt: message.createdAt.getTime()
        }

        initialMessages.push(obj);
    })

    return (
        <>
            <LeftChatbar />
            <div className={`${pathname?.length! > 8 ? 'w-full h-full' : 'w-full h-full max-sm:hidden max-md:hidden md:visible xl:visible'}`}>
                <section>
                    <div className="flex-1 justify-between flex flex-col h-screen w-full">
                        <div className="bg-dark-2 text-light-1 flex sm:items-center justify-between py-2 border-b-1 px-2">
                            <div className="relative flex items-center space-x-4">
                                <div className="relative">
                                    <div className="profile-image-container w-[34px] h-[34px] flex-shrink-0">
                                        <Image
                                            alt={`${o_user.name} profile photo`}
                                            src={o_user.image}
                                            width={34}
                                            height={34}
                                            className="rounded-full w-full h-full"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col leading-tight">
                                    <div className="text-xl flex items-center">
                                        <span className="text-gray-300 mr-3 font-semibold">
                                            {o_user.name}
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-400">
                                        @{o_user.username}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <ChatMessages
                            initialMessages={initialMessages}
                            userId={user.id}
                            u_image={u_user.image}
                            o_image={o_user.image}
                            chatId={chatId}
                        />

                        <ChatInput
                            userId={user.id}
                            chatId={params.id}
                        />
                    </div>
                </section>
            </div>
        </>
    )
}

export default Page;