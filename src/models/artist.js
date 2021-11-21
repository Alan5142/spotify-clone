import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const artistSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    description: String,
    password: String,
    artistType: String,
    albums: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }],
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
    return artist;
};

const Artist = mongoose.model('Artist', artistSchema);

export default Artist;