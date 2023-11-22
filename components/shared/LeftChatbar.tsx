import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.actions";
import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers"

async function LeftChatbar() {

    const user = await currentUser();
    if (!user) return null;
    const userInfo = await fetchUser(user.id);

    const headersList = headers();
    const pathname = headersList.get('next-url');
    console.log("Headers: ", pathname);
    console.log("isActive: ", pathname?.includes("direct"));

    return (
        <section className="custom-sidebar leftchatbar">
            <div className="flex w-full flex-1 flex-col gap-0 px-2">
                <div className=" text-gray-400 border-2 border-red-400 h-12">Chats</div>
                {
                    userInfo.connects.map((connect: any) => {
                        const isActive = (pathname?.includes(connect.id) && connect.id.length > 1) || pathname === connect.id;

                        return (
                            <>
                                <div key={connect.username} className="text-white cursor-pointer hover:bg-gray-900 border-b-1  border-gray">
                                    <Link
                                        href={`/direct/${connect.id}`}
                                        key={connect.username}
                                        className={`leftsidebar_link ${isActive && 'bg-gray-800'}`}
                                    >
                                        <div className="profile-image-container w-[34px] h-[34px]">
                                            <Image
                                                src={connect.image}
                                                alt={connect.username}
                                                width={34}
                                                height={34}
                                                className="rounded-full w-full h-full object-cover"
                                            />
                                        </div>
                                        <p className="text-light-1 max-lg:hidden mt-1">{connect.username}</p>
                                    </Link>
                                </div>
                                <hr color="gray"/>
                            </>
                        )
                    })
                }
            </div>
        </section>
    )
}

export default LeftChatbar;