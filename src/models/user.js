import mongoose from "mongoose";

const User = mongoose.model('User', {
    name: String,
    email: { type: String, unique: true },
    password: String,
});

export default User;