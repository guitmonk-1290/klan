"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import Community from "../models/community.model";
import Post from "../models/post.model";
import { connectToDB } from "../mongoose"

interface Params {
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string;
}

export async function fetchUser(userId: string) {
    // fetch user from database
    try {
        connectToDB();

        return await User.findOne({ id: userId })
    } catch (error: any) {
        throw new Error("[ERROR] Failed to fetch user: ", error);
    }
}

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
        // connect with MongoDB
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