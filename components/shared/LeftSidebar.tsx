"use client"

import Link from "next/link";
import { sidebarLinks } from "../../constants/index"
import { SignOutButton, UserButton } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

function LeftSidebar() {
    const router = useRouter();
    const pathname = usePathname();

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
                            <Image 
                                src={link.imgURL} 
                                alt={link.label} 
                                width={20}
                                height={20}    
                            />
                            <p className="text-light-1 hover:text-violet-400 max-lg:hidden">{link.label}</p>
                        </Link>
                    </div>

                    )}
                )}        
            </div>
        </section>
    )
}

export default LeftSidebar;