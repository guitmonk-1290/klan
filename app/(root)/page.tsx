import { UserButton } from "@clerk/nextjs";
import { fetchPosts } from "@/lib/actions/post.actions";
import { Suspense } from "react";
import Loading from "../../components/shared/loading";
import Posts from "@/components/posts/Posts";

export default async function Home() {

  return (
    <div>
      {/* <UserButton afterSignOutUrl="/"/> */}
      <Suspense fallback={<Loading />}>
        <Posts />
      </Suspense>
    </div>
  )
}