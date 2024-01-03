"use client"

import { SignInButton, SignedOut, SignedIn } from "@clerk/nextjs";

import Link from "next/link";
import { sidebarLinks } from "../../constants/index"
import { SignOutButton, UserButton, currentUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher/pusher";
import { toPusherKey } from "@/lib/utils";

interface Params {
    userId?: string
}

function LeftSidebar({
    userId
}: Params) {
    const router = useRouter();
    const pathname = usePathname();

    const [newReq, setNewReq] = useState<boolean>(false);

    useEffect(() => {
        pusherClient.subscribe(
            toPusherKey(`user:${userId}:incoming_requests`)
        )
        console.log("subscribed to pusher: ", `user:${userId}:incoming_requests`);

        const friendRequestHandler = () => {
            console.log("[+] ------------------ new friend request ---------------------- [+]")
            setNewReq(true);
        }

        pusherClient.bind('incoming_requests', friendRequestHandler)

        return () => {
            pusherClient.unsubscribe(
                toPusherKey(`user:${userId}:incoming_requests`)
            )
            pusherClient.unbind('incoming_requests', friendRequestHandler)
        }
    }, [])

    return (
        <section className="custom-sidebar leftsidebar">
            <div className="flex w-full flex-1 flex-col gap-4 px-6">
                {sidebarLinks.map((link) => {

                    const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;

                    return (
                        <div key={link.label} className="text-white cursor-pointer hover:text-violet-400">
                            <Link
                                href={link.route}
                                key={link.label}
                                className={`leftsidebar_link ${isActive && 'bg-primary-500'}`}
                            >
                                {
                                    newReq && link.label === "Activity" ? (
                                        <Image
                                            src='/assets/heart-filled.svg'
                                            alt={link.label}
                                            width={20}
                                            height={20}
                                            className=""
                                        />
                                    ) : (
                                        <Image
                                            src={link.imgURL}
                                            alt={link.label}
                                            width={20}
                                            height={20}
                                        />
                                    )
                                }
                                <p className="text-light-1 hover:text-violet-400 max-lg:hidden">
                                    {link.label}
                                    {newReq && link.label === "Activity" && <span className="text-red-400"> .</span>}
                                </p>
                            </Link>
                        </div>

                    )
                }
                )}
            </div>
            <div className='mt-10 px-6'>
                <SignedIn>
                    <SignOutButton signOutCallback={() => router.push("/sign-in")}>
                        <div className='flex cursor-pointer gap-4 p-4'>
                            <Image
                                src='/assets/logout.svg'
                                alt='logout'
                                width={24}
                                height={24}
                            />

                            <p className='text-light-2 max-lg:hidden'>Logout</p>
                        </div>
                    </SignOutButton>
                </SignedIn>
            </div>
        </section>
    )
}

export default LeftSidebar;