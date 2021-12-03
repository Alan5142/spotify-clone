import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { secret } from "../utils/auth.js";

const artistSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    description: String,
    password: String,
    artistType: String,
    albums: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }],
    // add fulltext search
    
}, {
    toObject: {
        transform: function (doc, ret) {
            delete ret.password;
            delete ret.__v;
            ret.id = ret._id;
        },
    },
});
artistSchema.index({ name: 'text', description: 'text' });

artistSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ id: this._id, userType: 'artist', type: this.artistType, name: this.name }, secret);
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