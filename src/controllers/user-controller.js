import User from '../models/user.js';
import '../data/mongo.js';
import { encryptPassword } from '../utils/encrypt.js';

export async function createUser(name, email, password) {
    const hashedPassword = await encryptPassword(password);
    const user = new User({
        name,
        email,
        password: hashedPassword,
    });
    await user.save();
}

// Get a user by id
export async function getUserById(id) {
    const user = await User.findById(id)
        .select('-password')
        .select('-__v').exec();
    return user;
}

export async function modifyUser(id, name, email, password) {
    const user = await User.findById(id);
    user.name = name || user.name;
    user.email = email || user.email;
    if (password !== undefined) {
        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }
        user.password = await encryptPassword(password);
    }
    await user.save();
}