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
    duration: {
        type: String,
        required: true,
    },
    artistName: {
        type: String,
        required: true,
    }
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

trackSchema.index({ title: "text", artistName: "text" });

trackSchema.methods.toJSON = function () {
    const track = this.toObject();
    return track;
};

const Track = mongoose.model("Track", trackSchema);

export default Track;