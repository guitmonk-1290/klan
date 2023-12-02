"use client"

import { sidebarLinks } from "@/constants";
import { pusherClient } from "@/lib/pusher/pusher";
import { toPusherKey } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Params {
    userId?: string
}

function Bottombar({
    userId
} : Params) {

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
        <section className="bottombar">
            <div className="bottombar_container">
                {sidebarLinks.map((link) => {
                    return (
                        <Link
                            href={link.route}
                            key={link.label}
                            className="bottombar_link"
                        >
                            {
                                newReq && link.label==="Activity" ? (
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
                            <p className="text-subtle-medium text-light-1 max-sm:hidden">
                                {link.label}
                                {newReq && link.label==="Activity" && <span className="text-red-400"> .</span>}
                            </p>

                        </Link>
                    )
                })}
            </div>
        </section>
    )
}

export default Bottombar;