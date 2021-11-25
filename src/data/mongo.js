import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";

/** @type GridFSBucket */
let bucket;

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/singstereo";

const connection = mongoose.connect(mongoUri)
.then(mg => {
    bucket = new GridFSBucket(mg.connection.db);
});

async function uploadFile(file, metadata) {
    bucket.openUploadStream()
}