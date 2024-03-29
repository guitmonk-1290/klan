"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import Community from "../models/community.model";
import Post from "../models/post.model";
import {Conversation, GroupMember} from "../models/chat.model"
import { connectToDB } from "../mongoose"
import { redirect } from "next/navigation";
import { string } from "zod";
import { FilterQuery, SortOrder } from "mongoose";
import { pusherServer } from "../pusher/pusher";
import { toPusherKey } from "../utils";

interface Params {
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string;
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

export async function fetchUser(userId: string) {
    // fetch user from database
    try {
        connectToDB();

        return await User.findOne({ id: userId })
    } catch (error: any) {
        throw new Error("[ERROR] Failed to fetch user: ", error);
    }
}

export async function fetchUsers({
    userId,
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = "desc"
} : {
    userId: string,
    searchString?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: SortOrder
}) {
    try {
        connectToDB();

        const skipAmount = (pageNumber - 1) * pageSize;

        const regex = new RegExp(searchString, "i");

        const query: FilterQuery<typeof User> = {
            id : { $ne: userId }
        }

        if (searchString.trim() !== '') {
            query.$or = [
                { username: { $regex: regex } },
                { name: { $regex: regex } }
            ]
        }

        const sortOptions = { createdAt: sortBy };

        const usersQuery = User.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize);

        const totalUsersCount = await User.countDocuments(query);

        const users = await usersQuery.exec();

        const isNext = totalUsersCount > skipAmount + users.length;

        return { users, isNext };

    } catch (error : any) {
        console.log("[ERROR] fetchUser(): ", )
    }
}

interface Connect {
    id: string;
    name: string;
    username: string;
    image: string;
}

export async function fetchConnects(
    userId: string
) {
    
}

interface OutRequest {
    to: String;
    date: Date;
    status: String;
    name: String;
    username: String;
}

interface InRequest {
    from: String;
    name: String;
    username: String,
    date: Date;
    image: string;
    text: string;
}

export async function requestConnect(
    userId : string,
    conId : string,
    name : string,
    username : string,
    text: string
) : Promise<void> {
    try {
        connectToDB();

        const userInfo = await fetchUser(userId);

        // update the incon field on recv DB
        const out_request : OutRequest = {
            to: conId,
            date: new Date(),
            name: name,
            username: username,
            status: "pending",
        } 

        const in_request : InRequest = {
            from: userId,
            date: new Date(),
            name: userInfo.name,
            username: userInfo.username,
            image: userInfo.image,
            text: text,
        }

        console.log("OUTGOING REQUEST: ", out_request);
        console.log("INCOMING REQUEST: ", in_request);

        const outDocUser = await User.findOne({ id: userId })
        const isAlreadyPrevConnected = outDocUser.outcon.find((con: any) => con.to === conId);

        if (!isAlreadyPrevConnected) {
            const outDoc = await User.findOneAndUpdate(
                { id: userId },
                { $push: {
                    outcon: out_request
                } },
                { upsert: true, new: true }
            )
            console.log("UPDATED OUT DOC: ", outDoc);

            const inDoc = await User.findOneAndUpdate(
                { id: conId },
                { $push: {
                    incon: in_request
                } },
                { upsert: true, new: true }
            )
            console.log("UPDATED IN DOC: ", inDoc);
        }

        console.log("[/] trigger pusher...");
        pusherServer.trigger(
            toPusherKey(`user:${conId}:incoming_requests`),
            'incoming_requests',
            {
                senderId: userId
            }
        )

    } catch (error : any) {
        console.log("[ERROR] requestConnect(): ", error.message);
    }
}

export async function rejectConnect(
    userId: string,
    conId: string,
) : Promise<void> {
    try {
        connectToDB();

        await User.findOneAndUpdate(
            { id: userId },
            { $pull : {
                incon: { from: conId }
            } },
            { upsert: false, multi: true }
        )

        await User.findOneAndUpdate(
            { id: conId, "outcon.to": userId },
            { $set: { 'outcon.$.status': 'reject', 'outcon.$.date': new Date() } },
        )

    } catch (error : any) {
        console.log("[ERROR] denyRequest: ", error.message);
    }
}


export async function addConnect(
    userId : string,
    conId : string,
    name : string,
    username : string,
    image : string
) : Promise<void> {
    try {
        connectToDB();

        const user = await fetchUser(userId);
        const con = await fetchUser(conId);

        const connectObj : Connect = {
            id: conId,
            name: name,
            username: username,
            image: image
        }

        const userObj : Connect = {
            id: userId,
            name: user.name,
            username: user.username,
            image: user.image
        }

        await User.findOneAndUpdate(
            {id: userId},
            { $pull: {
                incon: { from : conId}
            } },
            { upsert: false, multi: true }
        )

        await User.findOneAndUpdate(
            { id: conId, "outcon.to": userId },
            { $set: { 'outcon.$.status': 'accept', 'outcon.$.date': new Date() } },
        )

        await User.findOneAndUpdate(
            {id: userId},
            { $push: {
                connects: connectObj
            } }
        )

        await User.findOneAndUpdate(
            {id: conId},
            { $push: {
                connects: userObj
            } }
        )
        
        const conversation_id = userId>conId ? userId.concat("--", conId) : conId.concat("--", userId);

        const conversation = new Conversation({
            conversation_id: conversation_id,
            numberOfMembers: 2,
        })

        const savedConversation = await conversation.save();

        const groupMember1 = new GroupMember({
            id: user._id,
            conversation_id: savedConversation._id,
        })

        const groupMember2 = new GroupMember({
            id: con._id,
            conversation_id: savedConversation._id,
        })

        const savedMember1 = await groupMember1.save();
        const savedMember2 = await groupMember2.save();

        console.log("saved-1 : ", savedMember1)
        console.log("saved-2 : ", savedMember2)

        // check working!
        await Conversation.findOneAndUpdate(
            { _id: savedConversation._id },
            { $push: { members: { $each: [savedMember1._id, savedMember2._id] } } }
        )

    } catch (error : any) {
        console.log("[ERROR] addConnect(): ", error.message);
    }
}


export async function getActivity(userId: string) {
    try {
        connectToDB();

        const userPosts = await Post.find({ author: userId });

        // get IDs of all the child threads for all of the user's posts
        const childPostsIds = userPosts.reduce((acc, userPost) => {
            return acc.concat(userPost.children)
        }, [])

        const replies = await Post.find({
            _id: { $in: childPostsIds },
            author: { $ne: userId }
        }).populate({
            path: 'author',
            model: User,
            select: 'name image _id'
        })

        return replies;

    } catch (error : any) {
        console.log("[ERROR] getActivity(): ", error.message);
    }
}