import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation"

import PostCard from "@/components/cards/PostCard";
import Comment from "@/components/forms/Comment";

import { fetchUser } from "@/lib/actions/user.actions";
import { fetchPostById } from "@/lib/actions/post.actions";

async function page({ params }: { params: { id: string } }) {

    if (!params.id) return null;

    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect("/onboarding");

    const post = await fetchPostById(params.id);

    return (
        <section className="relative ml-2 mr-2">
            <div>
                <PostCard
                    id={post._id}
                    currentUserId={user.id}
                    parentId={post.parentId}
                    content={post.text}
                    author={post.author}
                    community={post.community}
                    createdAt={post.createdAt}
                    comments={post.children}
                />
            </div>

            <div className="mt-7">
                <Comment 
                    postId={params.id}
                    currentUserImg={userInfo.image}
                    currentUserId={JSON.stringify(userInfo._id)}
                />
            </div>

            <div className="mt-10">
                {post.children.map((child: any) => (
                    <PostCard
                        key={child._id}
                        id={child._id}
                        currentUserId={user.id}
                        parentId={child.parentId}
                        content={child.text}
                        author={child.author}
                        community={child.community}
                        createdAt={child.createdAt}
                        comments={child.children}
                        isComment
                    />
                ))}
            </div>
        </section>
    )
}

export default page;