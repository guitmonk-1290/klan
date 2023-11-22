import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation";

import UserCard from "@/components/cards/UserCard";

const page = async () => {

    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect("/onboarding");

    const result = await fetchUsers({
        userId: user.id,
        searchString: '',
        pageNumber: 1,
        pageSize: 25
    })

    return (
        <section>
            <h1 className="head-text mb-10 text-light-1">Search</h1>

            {/* <SearchBar /> */}

            <div className="mt-14 flex flex-col gap-9">
                {result?.users.length === 0 ? (
                    <p className="no-result">No users</p>
                ) : (
                    <>
                        {result?.users.map((user) => (
                            <UserCard 
                                key={user.id}
                                id={user.id}
                                name={user.name}
                                username={user.username}
                                image={user.image}
                                type='User'
                            />
                        ))}
                    </>
                )}
            </div>
        </section>
    )
}

export default page
