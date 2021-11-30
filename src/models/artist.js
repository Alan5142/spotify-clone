import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const artistSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    description: String,
    password: String,
    artistType: String,
    albums: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }],
}, {
    toObject: {
        transform: function (doc, ret) {
            delete ret.password;
            delete ret.__v;
            ret.id = ret._id;
        },
    },
});

artistSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ id: this._id, userType: 'artist', type: this.artistType }, process.env.JWT_KEY);
    return token;
};

artistSchema.methods.toJSON = function () {
    const artist = this.toObject();
    delete artist.password;
    artist.id = artist._id;
    delete artist._id;
    delete artist.__v;
    return artist;
};

const Artist = mongoose.model('Artist', artistSchema);

export default Artist;