import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
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

            <div className="flex items-center gap-4">
                <div className="block ">
                    <OrganizationSwitcher
                        appearance={{
                            baseTheme: dark,
                            elements: {
                            organizationSwitcherTrigger: "py-2 px-4",
                            },
                        }}
                    />
                </div>
                <div className="">
                    <UserButton />
                </div>
            </div>
        </nav>
    )
}

export default Topbar;