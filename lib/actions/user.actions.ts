"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"

interface Params {
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string;
}

// connect with MongoDB
export async function updateUser(
    {
        userId,
        username,
        name,
        bio,
        image,
        path
    } : Params
): Promise<void> {
    try {
        connectToDB();

        User.findOneAndUpdate(
            { id: userId },
            {
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarded: true,
            },
            { upsert: true }
        ).then(() => console.log("[+] DATA UPDATED!!"))

        if (path === "/profile/edit") {
            revalidatePath(path);
        }

    } catch (error: any) {
        throw new Error("[ERROR] failed to create/update user: ", error);
    }
}