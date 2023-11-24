import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation";

import UserCard from "@/components/cards/UserCard";
import Searchbar from "@/components/shared/Searchbar";
import Pagination from "@/components/shared/Pagination";

const page = async ({
    searchParams
} : {
    searchParams : { [key: string] : string | undefined }
}) => {

    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect("/onboarding");

    const result = await fetchUsers({
        userId: user.id,
        searchString: searchParams.q,
        pageNumber: searchParams?.page ? +searchParams.page : 1,
        pageSize: 25
    })

    return (
        <section>
            <h1 className="head-text mb-10 text-light-1">Search</h1>

            <Searchbar routeType="search" />

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

            {
                result && 
                <Pagination
                    path='search'
                    pageNumber={searchParams?.page ? +searchParams.page : 1}
                    isNext={result.isNext}
                /> 
            }
        </section>
    )
}

export default page
