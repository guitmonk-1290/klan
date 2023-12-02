import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.actions";
import Image from "next/image";

const Page = async () => {
    return (
        <div className="flex justify-center items-center ml-auto mr-auto">
            <div className="flex flex-col mt-12">
                <div className="flex">
                    <Image 
                        alt="Direct Chat"
                        src="/assets/chats.png"
                        width={284}
                        height={284}
                        className="m-auto"
                    />
                </div>
                <div className="flex m-auto">
                    <span className="text-gray-500 text-[24px] text-heading1-bold">
                        Direct Chat
                    </span>
                </div>
                <span className="text-gray-400 m-auto text-[14px]">
                    Chat directly with a single user or user groups
                </span>
            </div>
        </div>
    )
}

export default Page;