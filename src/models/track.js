import mongoose from "mongoose";

const trackSchema = new mongoose.Schema({
    title: {
        type: String,
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
    file: {
        type: String,
        required: true,
    },
}, {
    toObject: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            ret.music = `/public/music/${ret.file}`;
            delete ret.file;
        },
    },
},);

trackSchema.methods.toJSON = function () {
    const track = this.toObject();
    delete track.__v;
    track.id = track._id;
    delete track._id;
    
    track.music = `/public/music/${album.music}`;
    delete track.file;
    return track;
};

const Track = mongoose.model("Track", trackSchema);

export default Track;