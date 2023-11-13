"use client"

import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "../ui/form";
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { ZodReadonly } from "zod";
import { userValidation } from "@/lib/validations/user";
import { Button } from "../ui/button";
import * as z from "zod"
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { Textarea } from "../ui/textarea";

interface Props {
    user: {
        id: string,
        objectId: string,
        username: string,
        name: string,
        image: string,
        bio: string
    };
    btnTitle: string;
}

const AccountProfile = ({ user, btnTitle }: Props) => {

    const [files, setFiles] = useState<File[]>([]);

    const form = useForm<z.infer<typeof userValidation>>({
        resolver: zodResolver(userValidation),
        defaultValues: {
            profile_photo: user?.image ? user?.image : "",
            name: user?.name ? user?.name : "",
            username: user?.username ? user?.username : "",
            bio: user?.bio ? user?.bio : ""
        }
    })

    const handleImage = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
        e.preventDefault();

        const fileReader = new FileReader();

        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setFiles(Array.from(e.target.files));
            if (!file.type.includes('image')) return;

            fileReader.onload = async (event) => {
                const imageDataUrl = event.target?.result?.toString() || '';
                console.log("imageDataUrl: ", imageDataUrl);

                fieldChange(imageDataUrl);
            }

            fileReader.readAsDataURL(file);
        }
    }

    function onSubmit(values: z.infer<typeof userValidation>) {
        console.log(values);
    }

    return (
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10">
                <FormField
                control={form.control}
                name="profile_photo"
                render={({ field }) => (
                    <FormItem className="flex justify-center mb-2">
                        <FormLabel className="">
                            {
                                field.value ? (
                                    <Image
                                        src={field.value}
                                        alt="profile photo"
                                        width={96}
                                        height={96}
                                        priority
                                        className="rounded-full object-contain"
                                    />
                                ) : (
                                    <Image 
                                        src="/assets/profile.svg"
                                        alt="profile photo"
                                        width={24}
                                        height={24}
                                        className="rounded-full object-contain"
                                    />
                                )
                            }
                        </FormLabel>
                        <FormControl>
                            <Input 
                                type="file"
                                accept="image/"
                                className="w-1 h-1 opacity-0 absolute overflow-hidden"
                                onChange={(e) => handleImage(e, field.onChange)}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="text-gray-400">
                            <FormLabel>Name</FormLabel>
                            <FormControl className="bg-dark-4 border-1">
                                <Input 
                                    type="text"
                                    className="no-focus"
                                />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem className="text-gray-400">
                            <FormLabel>Username</FormLabel>
                            <FormControl className="bg-dark-4 border-1">
                                <Input 
                                    type="text"
                                    className="no-focus"
                                />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem className="text-gray-400">
                            <FormLabel>Bio</FormLabel>
                            <FormControl className="bg-dark-4 border-1">
                                <Textarea 
                                    rows={10}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Tell people about yourself.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="bg-violet-800 hover:bg-violet-600">Submit</Button>
            </form>
        </Form>
    )
}

export default AccountProfile;