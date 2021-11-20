import mongoose from "mongoose";

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/singstereo";
mongoose.connect(mongoUri);
