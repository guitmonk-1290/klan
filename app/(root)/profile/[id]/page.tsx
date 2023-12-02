import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.actions";

import { redirect } from "next/navigation"
import ProfileHeader from "@/components/shared/ProfileHeader";

async function Page({ params }: { params: { id: string } }) {

    if (!params.id) return null;

    const user = await currentUser();
    if (!user) return null;
    //console.log("user: ", user);

    const userInfo = await fetchUser(params.id);
    //console.log("userInfo: ", userInfo);
    if (user.id === params.id && user.id === userInfo.id) {
        if (!userInfo.onboarded) redirect("/onboarding");
    }

    const requested = params.id!==user.id && userInfo.incon.find((con: any) => con.from === user.id);

    const isConnect = userInfo.connects.includes(user.id);

    return (
        <section>
            <ProfileHeader
                accountId={userInfo.id}
                authUserId={user.id}
                name={userInfo.name}
                username={userInfo.username}
                imgUrl={userInfo.image}
                bio={userInfo.bio}
                isConnect={isConnect}
                requested={requested}
            />
        </section>   
    )
}

export default Page;