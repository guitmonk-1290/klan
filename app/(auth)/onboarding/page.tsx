import AccountProfile from "@/components/forms/AccountProfile";
import { currentUser } from "@clerk/nextjs"

async function Page() {

    const user = await currentUser();

    const userInfo = {
    };
    
    const userData = {
        id: user?.id,
        objectId: userInfo?.id,
        username: userInfo?.username || user?.username,
        name: userInfo?.username || user?.firstName || "",
        bio: userInfo?.bio || "",
        image: userInfo?.image || user?.imageUrl
    }

    //console.log("userData: ", userData);

    return (
        <main className="mx-auto flex flex-col max-w-3xl justify-start px-10 py-20">
            <span className="mt-2 head-text justify-center flex">Welcome to <span className="ml-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Klan</span></span>
            <p className="mt-4 text-base-regular text-light-2 flex justify-center">
                Let's quickly set up your profile...
            </p>

            <section className="mt-9 bg-dark-2 p-10">
                <AccountProfile 
                    user={userData}
                    btnTitle="Continue..."
                />
            </section>
        </main>
    )
}

export default Page;