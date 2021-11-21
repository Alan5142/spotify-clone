import mongoose from "mongoose";

const trackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    album: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Album",
        required: true,
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artist",
        required: true,
    },
    genre: {
        type: [String],
        required: true,
    },
});

const Track = mongoose.model("Track", trackSchema);

export default Track;