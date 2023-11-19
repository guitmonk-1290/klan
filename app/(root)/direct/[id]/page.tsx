import { fetchUser } from "@/lib/actions/user.actions";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs";

async function Page({params}: {params: { chatId: string }}) {

    if (!params.chatId) return null;
    const user = await currentUser();
    if (!user) return null;
    const u_user = await fetchUser(user.id);
    const o_user = await fetchUser(params.chatId);

    return (
        <section className="text-light-1 flex flex-col gap-4">
            <div className="flex flex-row gap-2">
                <div className="profile-image-container w-[24px] h-[24px]">
                    <Image
                        alt={u_user.username}
                        src={u_user.image}
                        width={24}
                        height={24}
                        className="rounded-full object-cover"
                    />
                </div>
                <span className="">You: {u_user.username}</span>
            </div>
            <div className="flex flex-row gap-2">
                <Image
                    alt={o_user.username}
                    src={o_user.image}
                    width={24}
                    height={24}
                    className="rounded-full object-contain"
                />
                <span className="">Chatting To: {o_user.username}</span>
            </div>
        </section>
    )
}

export default Page;