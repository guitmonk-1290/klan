"use server"

import { fetchUser } from "./user.actions"
import { connectToDB } from "../mongoose"
import User from "../models/user.model"
import Chat from "../models/chat.model"
import { currentUser } from "@clerk/nextjs"
import { connect } from "http2"

export async function getChats(userId: string, chatId: string) {
    
} 

export async function createChat(chatId: string) {
    
}