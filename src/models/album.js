import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
    title: {type: String, required: true},
    releaseDate: {type: Date, required: true},
    tracks: [{ type: mongoose.Types.ObjectId, ref: 'Track', default: [] }],
    artist: { type: mongoose.Types.ObjectId, ref: 'Artist', required: true },
    image: String,
    description: String,
    genres: [String],
});

const Album = mongoose.model('Album', albumSchema);

export default Album;