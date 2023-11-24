"use client"

import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface Params {
    id: string;
    name: string;
    username: string;
    image: string;
    type: string;
}

const UserCard = ({
    id,
    name,
    username,
    image,
    type
} : Params) => {

    const router = useRouter();
    
    return (
        <article className="user-card">
            <div className="user-card_avatar">
                <div className="profile-image-container w-[28] h-[28]">
                    <Image 
                        src={image}
                        alt='logo'
                        width={28}
                        height={28}
                        className="rounded-full object-cover w-full h-full"
                    />
                </div>

                <div className="flex-1 text-ellipsis">
                    <h4 className="text-base-semibold text-light-1">{name}</h4>
                    <p className="text-small-medium text-gray-1">@{username}</p>
                </div>
            </div>

            <Button className="user-card_btn" onClick={() => router.push(`/profile/${id}`)}>
                View
            </Button>
        </article>
    )
}
export default UserCard;