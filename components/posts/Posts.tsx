import { fetchPosts } from "@/lib/actions/post.actions";
import { currentUser } from "@clerk/nextjs";
import PostCard from "../cards/PostCard";
import { notFound } from "next/navigation";
import NoUser from "../shared/NoUser";

interface Params {
    userId: string
}

const Posts = async ({
    userId
} : Params) => {

    const result = await fetchPosts();

    return (
        <section className='flex flex-col gap-10'>
            {result?.posts.length === 0 ? (
                <p className='no-result'>No threads found</p>
            ) : (
                <>
                    {result?.posts.map((post) => (
                        <PostCard
                            key={post._id}
                            id={post._id}
                            currentUserId={userId}
                            parentId={post.parentId}
                            content={post.text}
                            author={post.author}
                            community={post.community}
                            createdAt={post.createdAt}
                            comments={post.children}
                      />
                    ))}
                </>
            )}
        </section>
    )
}

export default Posts;