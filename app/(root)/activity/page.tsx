import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

import ConnectionButtons from "@/components/shared/ConnectionButtons";

async function Page() {

    const user = await currentUser();
    if (!user) return notFound();

    const userInfo = await fetchUser(user.id);
    if (!userInfo) return notFound();
    console.log("userInfo: ", userInfo)

    if (!userInfo.onboarded) redirect("/onboarded");

    // get activity
    const activity = await getActivity(userInfo._id);

    const status = {
        "accept": {
            label: "accepted",
            color: "text-green-400",
            border: "border-green-600"
        },
        "reject": {
            label: "rejected",
            color: "text-red-400",
            border: "border-red-600"
        },
        "pending": {
            label: "pending",
            color: "text-gray-400",
            border: ""
        }
    }


    interface out_conParams {
        to: string,
        date: Date,
        name: string,
        username: string,
        status: string,
    }

    return (
        <section className='flex flex-col gap-10'>
            <div className="w-full head-text text-gray-600">Activity</div>
            {
                userInfo.incon.map((con : any) => (
                    <>
                        <div className={`w-full bg-dark-4 light-text-1 flex flex-col gap-4 p-4 rounded-md`}>
                            <div className="flex flex-row gap-4">
                                <div className="profile-image-container w-[34px] h-[34px]">
                                    <Image
                                        src={con.image}
                                        alt={con.name}
                                        width={34}
                                        height={34}
                                        className="rounded-full w-full h-full object-cover border-2 border-violet-800"
                                    />
                                </div>
                                <span className="text-light-1 mt-1">You have a connection request from
                                    <Link href={`/profile/${con.from}`}>
                                        <span className="text-base-semibold hover:text-blue"> {con.name}</span>
                                    </Link>
                                </span>
                                <ConnectionButtons 
                                    userId={user.id}
                                    conId={con.from}
                                />
                            </div>
                            <div className="rounded-lg p-4 bg-gray-800 text-gray-400">
                                {con.text}
                            </div>
                        </div>
                    </>
                ))
            }
            {
                userInfo.outcon.map((con : out_conParams) => (
                    <>
                        <div className={`${status[con.status].border} border-[1px] w-full bg-dark-4 light-text-1 flex flex-col gap-4 p-2 rounded-md`}>
                            <div className="flex flex-row gap-4">
                                <div className="profile-image-container w-[34px] h-[34px]">
                                    <Image
                                        src='/assets/request.svg'
                                        alt='connection'
                                        width={34}
                                        height={34}
                                        className="rounded-full w-full h-full object-cover"
                                    />
                                </div>
                                <span className="text-light-1 mt-1">Connection request to 
                                    <Link href={`/profile/${con.to}`}>
                                        <span className="text-base-semibold hover:text-blue"> {con.name}</span>
                                    </Link>
                                </span>
                                <div className="ml-auto mr-2 bg-dark-4 border-2 border-gray-800 p-1 text-light-1">
                                    Status: 
                                    <span className={`${status[con.status].color} mt-1`}> {status[con.status].label}</span>
                                </div>
                            </div>
                        </div>
                    </>
                ))
            }
            {
                userInfo.incon.length>0 || userInfo.outcon.length>0 ? (
                    <>
                        <hr />
                    </>
                ) : (
                    <>
                    </>
                )
            }
            {
                activity && activity.length > 0 ? (
                    <>
                        {activity.map((activity) => (
                            <Link
                                key={activity._id}
                                href={`/post/${activity.parentId}`}
                            >
                                <article className="activity-card">
                                    <div className="profile-image-container w-[34px] h-[34px]">
                                        <Image
                                            src={activity.author.image}
                                            alt='connection'
                                            width={34}
                                            height={34}
                                            className="rounded-full w-full h-full object-cover border-2 border-gray-700"
                                        />
                                    </div>
                                    <p className="!text-small-regular text-light-1">
                                        <span className="mr-1 text-primary-500">
                                            {activity.author.name}
                                        </span>{" "}
                                        replied to your post
                                    </p>
                                </article>
                            </Link>
                        ))}
                    </>
                ) : (
                    <p className="text-base-regular text-light-3">No Activity yet...</p>
                )
            }
        </section>
    )
}

export default Page;