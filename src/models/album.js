import { model } from "mongoose";

const Album = model('Album', {
    title: String,
    releaseDate: Date,
    artist: { type: String, ref: 'Artist' },
    tracks: [{ type: String, ref: 'Track' }],
    image: String,
    description: String,
    genres: [String],
});

export default Album;