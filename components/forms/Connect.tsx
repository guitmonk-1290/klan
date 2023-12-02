"use client"

import { z } from "zod"
import Image from "next/image"
import {useForm} from "react-hook-form"
import { usePathname } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel
} from "@/components/ui/form"

import { Input } from "../ui/input"
import { Button } from "../ui/button"

import { CommentValidation } from "@/lib/validations/post"
import { requestConnect } from "@/lib/actions/user.actions"

interface Props {
    userId: string,
    conId: string,
    name: string,
    username: string,
    requested: boolean
}

function Connect({
    userId,
    conId,
    name,
    username,
    requested
} : Props) {
    const pathname = usePathname();
    let btn_text = "Connect"

    const form = useForm<z.infer<typeof CommentValidation>>({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            post: "",
        }
    })

    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        await requestConnect(userId, conId, name, username, values.post).then(() => console.log("DB updated!"));

        form.reset();
        requested = true;
    }

    return (
        <Form {...form}>
            <form className="connect-form bg-transparent" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name='post'
                    render={({ field }) => (
                        <FormItem className="flex w-full items-center gap-3 mb-4">
                            <FormLabel className="text-light-1">
                            </FormLabel>
                            <FormControl className="bg-transparent">
                                <Input 
                                    type="text"
                                    {...field}
                                    placeholder="Message"
                                    className="no-focus border-2 border-gray-600 text-light-1 outline-none"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button disabled={requested} type="submit" className="comment-form_btn mr-4 mb-2">
                    {btn_text}
                </Button>

            </form>
        </Form>
    )
}

export default Connect;