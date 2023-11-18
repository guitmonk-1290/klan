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
    try {
        connectToDB();

        const toSkip = (page - 1) * pageSize;

        const postsQuery = Post.find({ parentId: { $in: [null, undefined] } })
                               .sort({ createdAt: "desc" })
                               .skip(toSkip)
                               .limit(pageSize)
                               .populate({
                                path: "author",
                                model: User,
                               })
                               .populate({
                                path: "community",
                                model: Community,
                               })
                               .populate({
                                path: "children",
                                populate: {
                                    path: "author",
                                    model: "User",
                                    select: "_id name parentId image"
                                }
                               });

        const totalPosts = await Post.countDocuments({
            parentId: { $in: [null, undefined] }
        })

        const posts = await postsQuery.exec();

        const isRem = totalPosts > toSkip + posts.length;

        return { posts, isRem };

    } catch (error: any) {
        
    }
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

// recursively gets all the child Posts of a top-level post
async function fetchChildPosts(postId: string): Promise<any[]> {
    const childPosts = await Post.find({ parentId: postId });

    const desc_childPosts = [];
    for(const childPost of childPosts) {
        const descendants= await fetchChildPosts(childPost._id);
        desc_childPosts.push(childPost, ...descendants);
    }

    return desc_childPosts;
} 

export async function deletePost(id: string, path: string) {

    /**
     * -> get the main post
     * -> get the corresponding child posts, or comments
     * -> get authors and community IDs
     * -> delete main post
     * -> delete child posts
     * -> update User and Community models
     */

    try {
        connectToDB();

        const mainPost = await Post.findById(id).populate("author community");
        
        if (!mainPost) {
            throw new Error("Post not found");
        }

        // get all the child posts and their descendants respectively
        const childPosts = await fetchChildPosts(id);

        // extract all the IDs including the main post ID and child post IDs 
        const childPostsIds = [
            id,
            ...childPosts.map((post) => post._id),
        ];

        // get author IDs and community IDs of both main post and child posts to update their models
        
        const uniqueAuthorIds = new Set(
            [
                ...childPosts.map((post) => post.author?._id?.toString()),
                mainPost.author?._id?.toString(),
            ].filter((id) => id !== undefined)
        );

        const uniqueCommunityIds = new Set(
            [
                ...childPosts.map((post) => post.community?._id?.toString()),
                mainPost.community?._id?.toString(),
            ].filter((community) => community !== undefined)
        );

        // delete child posts and their childs recursively
        await Post.deleteMany({ _id: { $in: childPostsIds } })

        // update User model
        await User.updateMany(
            { _id: { $in: Array.from(uniqueAuthorIds) } },
            { $pull : { posts: { $in: childPostsIds } } }
        )

        // update Community model
        await Community.updateMany(
            { _id: { $in: Array.from(uniqueCommunityIds) } },
            { $pull: { posts: { $in: childPostsIds } } }
        )

        revalidatePath(path);

    } catch (error) {
        console.log("deletePost(): ", error);
    }
}