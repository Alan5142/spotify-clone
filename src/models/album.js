import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
    title: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    tracks: [{ type: mongoose.Types.ObjectId, ref: 'Track', default: [] }],
    artist: { type: mongoose.Types.ObjectId, ref: 'Artist', required: true },
    image: String,
    description: String,
    genres: [String],
    artistName: String,
}, {
    toObject: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;

            ret.cover = `/public/covers/${ret.image}`;
            delete ret.image;
            return ret;
        }
    }
});

albumSchema.index({ title: 'text', genres: 'text', 'genres.*': 'text', artistName: 'text' });

albumSchema.methods.toJSON = function () {
    const album = this.toObject();

    album.image = `/public/covers/${album.image}`;
    album.artistId = album.artist.id;
    album.artist = album.artist.name;
    return album;
};

const Album = mongoose.model('Album', albumSchema);

export default Album;