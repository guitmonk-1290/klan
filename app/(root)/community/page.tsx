import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { fetchUserCommunities } from "@/lib/actions/community.actions";
import { fetchUser } from "@/lib/actions/user.actions"
import NoUser from "@/components/shared/NoUser";

export default async function Page() {

    const user = await currentUser();
    if (!user) return <NoUser />

    const userInfo = await fetchUserCommunities(user.id);
    console.log("userInfo: ", userInfo);

    return (
        <section className="main-container pt-2">
            <div className="flex flex-col w-full h-full">
                {/* followed communities */}
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row">
                        <span className="flex flex-row gap-1 text-light-1 text-[22px]">
                            Joined
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Klans</span>
                        </span>
                    </div>
                    <div className="mt-4">
                        <div className="flex flex-row gap-3 overflow-hidden">
                            {
                                userInfo?.communities.map((community: any) => (
                                    <Link href={`/community/${community.id}`}>
                                        <div className="flex flex-col gap-2 items-center">
                                            <div className="relative h-20 w-20 rounded-full">
                                                <Image
                                                    src={community.image}
                                                    fill
                                                    alt={community.name}
                                                    className="rounded-full"
                                                />
                                            </div>
                                            <div className="justify-center">
                                                <span className="text-[14px] text-gray-400">
                                                    {community.name}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}