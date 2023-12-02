"use client"

import Link from "next/link";
import Image from "next/image";
import { StringValidation } from "zod";

import { addConnect, fetchUser, requestConnect } from "@/lib/actions/user.actions";
import { useState } from "react";
import Connect from "../forms/Connect";

interface Props {
    accountId: string;
    authUserId: string;
    name: string;
    username: string;
    imgUrl: string;
    bio: string;
    type?: string;
    isConnect: boolean;
    requested: boolean
}

function ProfileHeader({
    accountId,
    authUserId,
    name,
    username,
    imgUrl,
    bio,
    type,
    isConnect,
    requested
}: Props) {

    const [connect, setConnect] = useState(false);


    return (
        <div className='flex w-full flex-col justify-start'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <div className='relative h-20 w-20 object-cover'>
                        <Image
                            src={imgUrl}
                            alt='logo'
                            fill
                            className='rounded-full object-cover shadow-2xl'
                        />
                    </div>

                    <div className='flex-1'>
                        <h2 className='text-left text-heading3-bold text-light-1'>
                            {name}
                        </h2>
                        <p className='text-base-medium text-gray-1'>@{username}</p>
                    </div>
                </div>
                {accountId === authUserId && type !== "Community" && (
                    <Link href='/profile/edit'>
                        <div className='flex cursor-pointer gap-3 rounded-lg bg-dark-3 px-4 py-2'>
                            <Image
                                src='/assets/edit.svg'
                                alt='logout'
                                width={16}
                                height={16}
                            />

                            <p className='text-light-2 max-sm:hidden'>Edit</p>
                        </div>
                    </Link>
                )}
                {accountId !== authUserId && type !== "Community" && (
                    <div className="flex flex-col gap-4">
                        {
                            isConnect ? (
                                <>
                                    <div 
                                        className='flex cursor-pointer gap-3 rounded-lg bg-violet-700 px-4 py-2'    
                                    >
                                        <Image
                                            src='/assets/user.svg'
                                            alt='logout'
                                            width={16}
                                            height={16}
                                            className="text-white"
                                        />
                                        <p className='text-light-2 max-sm:hidden'>Connected</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {
                                        requested ? (
                                            <>
                                                <div 
                                                    className='flex cursor-pointer gap-3 rounded-lg bg-dark-3 px-4 py-2 w-auto'    
                                                >
                                                    <Image
                                                        src='/assets/request.svg'
                                                        alt='logout'
                                                        width={16}
                                                        height={16}
                                                    />
                                                    <p className='text-light-2 max-sm:hidden'>Requested</p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div 
                                                    className='flex cursor-pointer gap-3 rounded-lg bg-dark-3 px-4 py-2 w-auto'
                                                    onClick={() => setConnect(!connect)}    
                                                >
                                                    <Image
                                                        src='/assets/request.svg'
                                                        alt='logout'
                                                        width={16}
                                                        height={16}
                                                    />
                                                    <p className='text-light-2 max-sm:hidden'>Connect</p>
                                                </div>
                                            </>
                                        )
                                    }
                                </>
                            )
                        }
                        <Link href={`...some api call to DB`}>
                        <div className='flex cursor-pointer gap-3 rounded-lg bg-dark-3 px-4 py-2 w-fit'>
                            <Image
                                src='/assets/heart.svg'
                                alt='logout'
                                width={16}
                                height={16}
                            />

                            <p className='text-light-2 max-sm:hidden'>Follow</p>
                        </div>
                    </Link>
                </div>
                )}
            </div>

            <p className='mt-6 max-w-lg text-base-regular text-light-2'>{bio}</p>

            <div className='mt-12 h-0.5 w-full bg-dark-3' />

            {
                connect && (
                    <div className="mt-4 w-full bg-dark-4">
                        <Connect 
                            userId={authUserId}
                            conId={accountId}
                            name={name}
                            username={username}
                            requested={requested}
                        />
                    </div>
                )
            }
        </div>
    )
}

export default ProfileHeader;