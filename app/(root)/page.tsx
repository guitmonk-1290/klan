import { UserButton } from "@clerk/nextjs";
import { fetchPosts } from "@/lib/actions/post.actions";
import { Suspense } from "react";
import Loading from "../../components/shared/loading";
import Posts from "@/components/posts/Posts";
import Image from "next/image";
import Link from "next/link";
import HomeSearch from "@/components/shared/HomeSearch";

export default async function Home() {

  return (
    <div className="">
      {/* <UserButton afterSignOutUrl="/"/> */}
      <article
          className={`flex w-full flex-col sticky shadow-2xl z-20 top-14 bg-dark-1 pb-4 pt-2 mb-2`}
      >
        <div className="flex flex-row">
          <HomeSearch />
          <Link href='/direct'>
            <Image 
              alt="chat"
              src="/assets/reply.svg"
              width={44}
              height={44}
              className="cursor-pointer ml-4 mt-2"
            />
          </Link>
        </div>
      </article>
      <Suspense fallback={<Loading />}>
        <Posts />
      </Suspense>
    </div>
  )
}