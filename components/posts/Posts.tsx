import { fetchPosts } from "@/lib/actions/post.actions";
import { currentUser } from "@clerk/nextjs";
import PostCard from "../cards/PostCard";

const Posts = async () => {

    await new Promise(resolve => setTimeout(resolve, 3000));

    const result = await fetchPosts();
    const user = await currentUser();
    if (!user) return null;

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
                            currentUserId={user?.id}
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