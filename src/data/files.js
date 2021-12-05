import './mongo.js';
import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
import { Router } from 'express';
import { ObjectId } from 'mongodb';

async function upload(file, filename, bucketName, metadata) {
    const bucket = new GridFSBucket(mongoose.connection.db, {
        bucketName,
        chunkSizeBytes: 1024 * 64,
    });
    const uploadStream = bucket.openUploadStream(filename, {
        metadata,
    });
    await new Promise((resolve, reject) => {
        uploadStream.write(file.buffer);
        uploadStream.on("error", reject);
        uploadStream.on("finish", resolve);
        uploadStream.end();
    });
    return uploadStream.id;
}

export function uploadCover(file, filename, albumId) {
    return upload(file, filename, "covers", {
        filename,
        contentType: file.mimetype,
        albumId,
    });
}

export function uploadTrack(file, filename, albumId) {
    return upload(file, filename, "tracks", {
        filename,
        contentType: file.mimetype,
        albumId,
    });
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
export async function getFile(fileId, bucketName) {
    fileId = new ObjectId(fileId);
    const bucket = new GridFSBucket(mongoose.connection.db, {
        bucketName,
        chunkSizeBytes: 1024 * 1024,
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
        const file = await getFile(req.params.id, "covers");
        res.set('Content-Type', file.mime);
        res.send(file.buffer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export const trackRouter = Router({ mergeParams: true });

trackRouter.get('/:id', async (req, res) => {
    try {
        const file = await getFile(req.params.id, "tracks");
        res.set('Accept-Ranges', 'bytes');
        res.set('Content-Type', file.mime);
        res.send(file.buffer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});