"use client"

import { rejectConnect } from "@/lib/actions/user.actions";
import { addConnect } from "@/lib/actions/user.actions";

interface Params {
    userId: string;
    conId: string;
    name: string;
    username: string;
    image: string;
}

export default function ConnectionButtons({
    userId,
    conId,
    name,
    username,
    image
} : Params) {

    const acceptConnect = async () => {
        await addConnect(userId, conId, name, username, image).then(() => location.reload());

    }

    const denyConnect = async () => {
        await rejectConnect(userId, conId).then(() => location.reload());
    }

    return (
        <div className="ml-auto gap-2 ml-4">
            <button 
                className="connection-btn text-green-700"
                onClick={acceptConnect}    
            >
                Accept
            </button>
            <button 
                className="connection-btn text-red-500"
                onClick={denyConnect}    
            >
                Reject
            </button>
        </div>
    )
}