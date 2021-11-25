import './mongo.js';
import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
import { Router } from 'express';
import { ObjectId } from 'mongodb';

export async function upload(file, filename, albumId) {
    const bucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: "files",
        chunkSizeBytes: 1024 * 64,
    });
    const uploadStream = bucket.openUploadStream(filename, {
        metadata: {
            filename,
            contentType: file.mimetype,
            albumId,
        },
    });
    await new Promise((resolve, reject) => {
        uploadStream.write(file.buffer);
        uploadStream.on("error", reject);
        uploadStream.on("finish", resolve);
        uploadStream.end();
    });
    return uploadStream.id;
}

async function getFileMetadata(bucket, id) {
    const file = await bucket.find({ _id: ObjectId(id) }).toArray();
    return file[0];
}

/**
 * 
 * @param {String} fileId 
 * @returns {Promise<{buffer: Buffer, mime: string}>}
 */
export async function getFile(fileId) {
    fileId = new ObjectId(fileId);
    const bucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: "files",
    });
    const downloadStream = bucket.openDownloadStream(fileId);

    const chunks = [];
    downloadStream.on("data", (chunk) => {
        chunks.push(chunk);
    });

    await new Promise((resolve, reject) => {
        downloadStream.on("error", reject);
        downloadStream.on("end", resolve);
        downloadStream.end();
    });

    const fileInfo = await getFileMetadata(bucket, fileId);
    return {
        buffer: Buffer.concat(chunks),
        mime: fileInfo.metadata.contentType,
    };
}

export const coverRouter = Router({ mergeParams: true });

coverRouter.get('/:id', async (req, res) => {
    try {
        const file = await getFile(req.params.id);
        res.set('Content-Type', file.mime);
        res.send(file.buffer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

