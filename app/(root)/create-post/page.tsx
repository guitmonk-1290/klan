import Post from "@/components/forms/Post";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

async function Page() {

    const user = await currentUser();

    if (!user) return null;

    const userInfo = await fetchUser(user.id);

    if (!userInfo?.onboarded) redirect("/onboarding");

    return (
        <main className="mx-auto flex flex-col max-w-3xl py-2">
            <div className="text-[24px] text-light-1 flex flex-row">
                <span className="mr-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-yellow-500 to-purple-500">Create a Post</span>
            </div>

            <Post userId={userInfo?._id}/>
        </main>
    )
}

export default Page;