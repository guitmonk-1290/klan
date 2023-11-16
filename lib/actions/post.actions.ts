"use server"

import { revalidatePath } from "next/cache";
import Community from "../models/community.model";
import Post from "../models/post.model"
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

// make sure author is clickable and UNIQUE

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string
}

export async function fetchPosts(page=1, pageSize=20) {
    
}

export async function createPost({
    text,
    author,
    communityId,
    path
}: Params) {
    try {
        connectToDB();

        // get the respective community from DB
        const communityIdObj = await Community.findOne(
            {id: communityId},
            { _id: 1 }
        );

        // create post document
        const createdPost = await Post.create({
            text,
            author,
            community: communityIdObj
        })

        // update user model
        await User.findByIdAndUpdate(author, {
            $push: { posts: createdPost._id },
        });

        if (communityIdObj) {
            // update community model
            await Community.findByIdAndUpdate(communityIdObj, {
                $push: { posts: createdPost._id }
            })
        }

        revalidatePath(path);
        
    } catch (error: any) {
        console.log("[-] Error creating post: ", error);
    }
}