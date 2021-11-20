import mongoose from "mongoose";

const Artist = mongoose.model('Artist', {
    name: String,
    email: { type: String, unique: true },
    description: String,
    password: String,
    type: String,
});

export default Artist;