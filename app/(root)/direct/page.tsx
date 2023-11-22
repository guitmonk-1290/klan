import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.actions";

const Page = async () => {
    return (
        <div className="text-light-1">Chat</div>
    )
}

export default Page;