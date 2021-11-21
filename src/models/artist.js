import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    description: String,
    password: String,
    type: String,
});

artistSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ id: this._id, userType: 'artist', type: this.type }, process.env.JWT_KEY);
    return token;
};

const Artist = mongoose.model('Artist', artistSchema);

export default Artist;