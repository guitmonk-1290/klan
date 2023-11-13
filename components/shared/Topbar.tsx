import { SignInButton, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

function Topbar() {
    return (
        <nav className="topbar">
            <Link 
                href="/"
                className="flex items-center gap-4"
            >
                    <p className="text-heading3-bold flex bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                        Klan
                    </p>
            </Link>

            <div className="flex items-center gap-1">
                <div className="block ">
                    <SignedOut>
                        <SignInButton>
                            <div className="flex cursor-pointer text-white text-xl hover:bg-violet-300 hover:text-black transition duration 150 p-2 rounded-md">
                                Sign in
                            </div>
                        </SignInButton>
                    </SignedOut>
                </div>
                <div className="">
                    <UserButton />
                </div>
            </div>
        </nav>
    )
}

export default Topbar;