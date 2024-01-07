"use server"

import { fetchTopCommunities } from "@/lib/actions/community.actions";

import Image from "next/image";
import Link from "next/link";

async function RightSidebar() {

    const communities = await fetchTopCommunities(5);

    return (
        <section className="custom-scrollbar rightsidebar">
            <div className="flex flex-col bg-gradient-to-r from-pink-700 via-yellow-700 to-purple-700 p-2">
                <h3 className="text-light-1 text-heading4-medium">Top Klans</h3>
            </div>
            <div className="flex flex-col gap-4">
                {
                    communities?.map((community) => (
                        <Link 
                            href={`/communities/${community.id}`}
                        >
                            <div className="text-red-400">
                                <div className="flex flex-row gap-2">
                                    <div className="relative h-9 w-9">
                                        <Image
                                            alt="community image" 
                                            src={community.image}
                                            fill
                                            className="rounded-full"
                                        />
                                    </div>
                                    <div className="pt-2 text-[14px]">{community.name}</div>
                                </div>
                            </div>
                        </Link>
                    ))
                }
            </div>
            <div className="flex flex-col gap-2 mt-4 group relative">
                <button
                className="text-light-1 text-base-semibold bg-blue rounded-full hover:bg-transparent hover:border-[1px] hover:border-white transition duration-100 p-2">
                    Explore Klans
                </button>
                <span className="absolute top-10 scale-0 rounded bg-gray-800 p-[2px] text-xs text-white group-hover:scale-100">✨ coming soon...</span>
            </div>
        </section>
    )
}

export default RightSidebar;