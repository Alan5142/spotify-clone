import '../data/mongo.js';
import Artist from '../models/artist.js';
import { validateEmail } from '../utils/validate.js';
import { encryptPassword } from "../utils/encrypt.js";


function validateArtist(name, email, password) {
    if (name === undefined || email === undefined || password === undefined) {
        throw new Error('Missing parameters');
    }
    if (name.length < 3) {
        throw new Error('Name must be at least 3 characters long');
    }
    if (email.length < 3) {
        throw new Error('Email must be at least 3 characters long');
    }

    if (!validateEmail(email)) {
        throw new Error('Email is not valid');
    }

    if (password.length <= 5) {
        throw new Error('Password must be at least 6 characters long');
    }
}

export async function createArtist(name, email, password) {
    validateArtist(name, email, password);
    const hashedPassword = await encryptPassword(password);
    const user = new Artist({
        name,
        email,
        password: hashedPassword,
    });
    await user.save();
}
