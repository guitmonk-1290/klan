import mongoose from 'mongoose'

let isConnected = false;

export const connectToDB = async () => {
    mongoose.set('strictQuery', true);

    if (!process.env.MONGODB_URL) return console.log("MONGODB_URL not found");
    if (isConnected) return console.log("Already connected to MongoDB");

    try {
        console.log("[/] connecting to DB...");
        await mongoose.connect(process.env.MONGODB_URL);

        isConnected = true;
        console.log("[+] MongoDB connected!!");
    } catch (error) {
        console.log("[ERROR] connectToDB failed: ", error);
    }
}