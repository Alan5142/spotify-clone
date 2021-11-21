import '../data/mongo.js';
import Artist from '../models/artist.js';
import { validateEmail } from '../utils/validate.js';
import { encryptPassword } from "../utils/encrypt.js";
import Album from '../models/album.js';


function validateArtist(name, email, password, type) {
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

    if (type === undefined) {
        throw new Error('Type must be defined');
    }

    if (type.toLowerCase() !== 'band' && type !== 'solo') {
        throw new Error('Type must be band or solo');
    }
}

export async function createArtist(name, email, password, description, type) {
    validateArtist(name, email, password, type);
    const hashedPassword = await encryptPassword(password);
    const user = new Artist({
        name,
        email,
        password: hashedPassword,
        description,
        artistType: type.toLowerCase()
    });
    await user.save();
}

export async function getArtistById(id) {
    return await Artist.findById(id);
}

export async function getArtistByName(name) {
    const artist = await Artist.findOne({ name });
    return artist;
}

export async function modifyArtist(id, name, email, password, description, type) {
    const artist = await Artist.findById(id);
    artist.name = name || artist.name;
    artist.email = email || artist.email;
    artist.description = description || artist.description;
    artist.artistType = type || artist.artistType;
    if (password) {
        const hashedPassword = await encryptPassword(password);
        artist.password = hashedPassword;
    }
    await artist.save();
}

export async function createAlbum(artistId, name, releaseDate) {
    const artist = await Artist.findById(artistId);
    if (!artist) {
        throw new Error('Artist not found');
    }
    const album = new Album({
        title: name,
        releaseDate,
        artist: artist._id,
    });
    artist.albums.push(album);
    await artist.save();
}