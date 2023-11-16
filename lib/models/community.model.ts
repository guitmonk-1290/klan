import mongoose from "mongoose"

const communitySchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false,
        default: ""
    },
    banner: {
        type: String,
        required: false,
        default: ""
    },
    numberOfMembers: {
        type: mongoose.Schema.Types.Number,
        default: 1
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ]
})

const Community = mongoose.models.Community || mongoose.model("Community", communitySchema)

export default Community;