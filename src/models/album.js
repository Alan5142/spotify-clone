import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
    title: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    tracks: [{ type: mongoose.Types.ObjectId, ref: 'Track', default: [] }],
    artist: { type: mongoose.Types.ObjectId, ref: 'Artist', required: true },
    image: String,
    description: String,
    genres: [String],
});

albumSchema.methods.toJSON = function () {
    const album = this.toObject();
    delete album.__v;
    album.id = album._id;
    delete album._id;

    album.image = `/public/covers/${album.image}`;
    album.tracks = album.tracks.map((track) => {
        return {
            id: track._id,
            title: track.title,
            music: `/public/music/${track.file}`,
            artist: track.artist,
            album: track.album,
        }
    });
    return album;
};

const Album = mongoose.model('Album', albumSchema);

export default Album;