"use client"

import Image from "next/image"
import { Input } from "../ui/input"
import { useState } from "react";

export default function HomeSearch() {

    const [search, setSearch] = useState("");

    return (
        <div className='searchbar flex-1'>
            <Image
                src='/assets/search-gray.svg'
                alt='search'
                width={24}
                height={24}
                className='object-contain'
            />
            <Input
                id='text'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                // placeholder={`${routeType !== "search" ? "Search communities" : "Search creators"
                //     }`}
                placeholder="Find collaborations..."
                className='no-focus searchbar_input'
            />
        </div>
    )
}