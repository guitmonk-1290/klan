"use client"

import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";

function Bottombar() {
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
                            <Image
                                src={link.imgURL}
                                alt={link.label}
                                height={20}
                                width={20} />

                            <p className="text-subtle-medium text-light-1 max-sm:hidden">
                                {link.label}
                            </p>

                        </Link>
                    )
                })}
            </div>
        </section>
    )
}

export default Bottombar;