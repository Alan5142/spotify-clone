import User from '../models/user.js';
import Artist from '../models/artist.js';
import '../data/mongo.js';
import { encryptPassword } from '../utils/encrypt.js';

export async function createUser(name, email, password) {
    // check if user already exists
    const currentUser = await User.findOne({ email });
    if (currentUser) {
        return null;
    }
    // check if artist with same email already exists
    const artist = await Artist.findOne({ email: email });
    if (artist) {
        return null;
    }
    
    const hashedPassword = await encryptPassword(password);
    const user = new User({
        name,
        email,
        password: hashedPassword,
    });
    await user.save();
    return user;
}

// Get a user by id
export async function getUserById(id) {
    const user = await User.findById(id)
        .select('-password')
        .select('-__v').exec();
    return user;
}

export async function modifyUser(id, name, password) {
    const user = await User.findById(id);
    user.name = name || user.name;
    if (password !== undefined) {
        user.password = await encryptPassword(password);
    }
    await user.save();
    return user;
}