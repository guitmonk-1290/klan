import { z } from "zod"

export const messageValidation = z.object({
    _id: z.any(),
    creatorId : z.object({
        _id: z.any(),
        id: z.string()
    }),
    body : z.string(),
    createdAt : z.any()
})

export const messageArrayValidation = z.array(messageValidation)

export type MessageValidator = z.infer<typeof messageValidation>