import { fetchUser } from "@/lib/actions/user.actions";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs";
import { notFound } from "next/navigation";
import { createChat } from "@/lib/actions/chat.actions";
import DemoChat from "@/components/shared/DemoChat";
import { getChats } from "@/lib/actions/chat.actions";

async function getChatMessages(chatId: string) {
    
}

async function demochat(chatId: string) {
    await createChat(chatId).then(() => console.log("demo chat created!!"));
}

async function Page({params}: {params: { id: string }}) {

    if (!params.id) return notFound();

    // user must be logged in
    const user = await currentUser();
    if (!user) return notFound();

    const u_user = await fetchUser(user.id);

    // userId must be a connect of the current user
    const isConnect = u_user.connects.find((connect: any) => connect.id === params.id);
    if (!isConnect) return notFound();

    const o_user = await fetchUser(params.id);

    return (
        <section className="">
            <div className="flex flex-row m-0">
                <DemoChat chatId={params.id} />
            </div>
        </section>
    )
}

export default Page;