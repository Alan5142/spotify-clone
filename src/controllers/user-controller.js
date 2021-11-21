import User from '../models/user.js';
import '../data/mongo.js';
import { encryptPassword } from '../utils/encrypt.js';
import { validateEmail } from '../utils/validate.js';

function validateUser(name, email, password) {
    if (name === undefined || email === undefined || password === undefined) {
        throw new Error('Missing parameters');
    }
    if (name.length < 3) {
        throw new Error('Name must be at least 3 characters long');
    }
    if (!validateEmail(email)) {
        throw new Error('Email is not valid');
    }
    if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
    }
}

export async function createUser(name, email, password) {
    validateUser(name, email, password);
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