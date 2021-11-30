import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { secret } from "../utils/auth.js";

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: { type: String, required: true, minlength: 6 },
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ id: this._id, name: this.name, email: this.email, userType: 'user' }, secret);
    return token;
}

userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    user.id = user._id;
    delete user._id;
    return user;
};

const User = mongoose.model('User', userSchema);

export default User;