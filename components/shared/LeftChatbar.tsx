import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.actions";
import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers"
import NoUser from "./NoUser";

async function LeftChatbar() {

    const user = await currentUser();
    
    if (!user) return (
        <>
            <NoUser />
        </>
    );
    const userInfo = await fetchUser(user.id);
    console.log("userInfo: ", userInfo);

    const headersList = headers();
    const pathname = headersList.get('next-url');
    console.log("Headers: ", typeof(pathname));
    console.log("isActive: ", pathname?.includes("direct"));

    return (
        <section className={`${pathname?.length!>8 ? 'max-sm:hidden max-md:hidden' : 'leftchatbar max-sm:w-full max-md:w-full'}`}>
            <div className="flex w-full flex-1 flex-col gap-0 px-2 mt-2">
                <div className=" text-gray-400 h-12">Connects</div>
                {
                    userInfo.connects.length === 0 ? (
                        <>
                            <p className="text-light-1">No connections</p>
                        </>
                    ) : (
                        <>
                            {
                                userInfo.connects.map((connect: any) => {
                                    const isActive = (pathname?.includes(connect.id) && connect.id.length > 1) || pathname === connect.id;
            
                                    return (
                                        <>
                                            <div key={connect.username} className="text-white cursor-pointer hover:bg-gray-900 border-b-1  border-gray mt-2">
                                                <Link
                                                    href={`/direct/${connect.id}`}
                                                    key={connect.username}
                                                    className={`leftsidebar_link ${isActive && 'bg-gray-800 border-b-black'}`}
                                                >
                                                    <div className="profile-image-container w-[34px] h-[34px]">
                                                        <Image
                                                            src={connect.image}
                                                            alt={connect.username}
                                                            width={34}
                                                            height={34}
                                                            className="rounded-full w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <p className="text-light-1  mt-2">{connect.username}</p>
                                                </Link>
                                            </div>
                                        </>
                                    )
                                })   
                            }
                        </>
                    )
                }
            </div>
        </section>
    )
}

export default LeftChatbar;