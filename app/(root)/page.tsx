import { UserButton, currentUser } from "@clerk/nextjs";
import { fetchPosts } from "@/lib/actions/post.actions";
import { Suspense } from "react";
import Loading from "../../components/shared/loading";
import Posts from "@/components/posts/Posts";
import Image from "next/image";
import Link from "next/link";
import HomeSearch from "@/components/shared/HomeSearch";
import NoUser from "@/components/shared/NoUser";
import RightSidebar from "@/components/shared/RightSidebar";

export default async function Home() {

  const user = await currentUser();
  if (!user) return (
    <>
      <NoUser />
    </>
  );

  return (
    <>
      <section className='main-container'>
        <div className='w-full max-w-4xl'>
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
              <Posts userId={user.id} />
            </Suspense>
          </div>
        </div>
      </section>

      <RightSidebar />
    </>
  )
}