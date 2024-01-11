"use server"

import { fetchTopCommunities } from "@/lib/actions/community.actions";

import Image from "next/image";
import Link from "next/link";

async function RightSidebar() {

    const communities = await fetchTopCommunities(5);

    return (
        // pt-2 pb-6 pt-28
        <section className="custom-scrollbar rightsidebar">
            <div className="flex flex-col bg-gradient-to-r from-violet-900 to-sky-700 p-2 pt-28">
                <div className="flex flex-row gap-2 pl-1">
                    <Image
                        src="/assets/community.svg"
                        alt="top klans"
                        width={24}
                        height={24}
                    />
                    <h3 className="text-light-1 text-heading4-medium">Top Klans</h3>
                </div>
            </div>
            <div className="flex flex-col gap-4 pl-2">
                {
                    communities?.length===0 && (
                        <div className="flex flex-row gap-2">
                            <span className="text-light-1">No klans found!</span>
                            <Link href="/community/create">
                                <span className="text-violet-400 underline">Create a klan</span>
                            </Link>
                        </div>
                    )
                }
                {
                    communities?.map((community, index) => (
                        <Link
                            href={`/community/${community.id}`}
                        >
                            <div className="flex flex-row gap-4">
                                <span className=" text-gray-300 pt-1 mb-1">{`#${index + 1}`}{` `}</span>
                                <div className="text-red-400">
                                    <div className="flex flex-row gap-2">
                                        <div className="relative h-9 w-9">
                                            <Image
                                                alt="community image"
                                                src={community.image!}
                                                fill
                                                className="rounded-full"
                                            />
                                        </div>
                                        <div className="pt-2 text-[14px]">{community.name}</div>
                                    </div>
                                </div>
                            </div>

                        </Link>
                    ))
                }
            </div>
            <div className="flex flex-col gap-2 mt-4 group relative">
                <button
                    className="text-light-1 text-sm rounded-full bg-transparent border-[1px] border-white hover:bg-violet-700 hover:border-violet-700 transition duration-200 p-2">
                    Explore Klans
                </button>
                <span className="absolute top-10 scale-0 rounded bg-gray-800 p-[2px] text-xs text-white group-hover:scale-100">✨ coming soon...</span>
            </div>
            {/* <div className="flex flex-1 relative">
                <Image 
                    src="/assets/collab.jpg"
                    fill
                    alt="collab with klan"
                    className="absolute"
                />
            </div> */}
        </section>
    )
}

export default RightSidebar;