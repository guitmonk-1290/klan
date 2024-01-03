"use client"

import { useRouter } from "next/navigation"

export default function NoUser() {

    const router = useRouter();

    return (
        <section className="main-container flex flex-col gap-4 justify-center">
            <div>
                <p className="no-result">You need to be signed in to use Klan</p>
            </div>
            <div className="flex flex-row w-60 gap-2">
                <button 
                    className="text-light-1 rounded-lg p-2 bg-violet-700 w-full"
                    onClick={() => router.push("/sign-in")}    
                >Sign In</button>
                <span className="text-light-1 mt-auto mb-auto"> | </span>
                <button 
                    className="text-black bg-violet-400 p-2 rounded-lg w-full"
                    onClick={() => router.push("/sign-up")}     
                >Sign Up</button>
            </div>
        </section>
    )
}