import mongoose from "mongoose";
import { string } from "zod";

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: String,
    bio: String,
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        },
    ],
    communities: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Community"
        }
    ],
    onboarded: {
        type: Boolean,
        default: false,
    },
    incon: {
        type: Array,
        default: []
    },
    outcon: {
        type: Array,
        default: []
    },
    connects: {
        type: Array,
        default: []
    }
});

// Initially, mongoose.models.User would be undefined!
console.log(mongoose.models)
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

// to: String,
// time: {
//     type: Date,
//     default: Date.now
// },
// default: []