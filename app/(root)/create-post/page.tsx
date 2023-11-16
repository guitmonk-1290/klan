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
            <div className="text-[20px] border-b-[2px] border-gray-600 text-light-1">
                Create a Post
            </div>

            <Post userId={userInfo?._id}/>
        </main>
    )
}

export default Page;