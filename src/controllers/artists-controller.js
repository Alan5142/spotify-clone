import '../data/mongo.js';
import { upload } from '../data/files.js';
import Artist from '../models/artist.js';
import Track from '../models/track.js';
import { encryptPassword } from "../utils/encrypt.js";
import Album from '../models/album.js';

export async function createArtist(name, email, password, description, type) {
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

export async function createAlbum(artistId, name, releaseDate, tracks, image, description, genres) {
    const artist = await Artist.findById(artistId);
    if (!artist) {
        throw new Error(`Artist not found: ${artistId}`);
    }

    const album = new Album({
        title: name,
        releaseDate,
        artist: artist._id,
        description,
        genres
    });
    const uploadedImage = await upload(image, album.title, album._id);
    album.image = uploadedImage;
    artist.albums.push(album);

    const tracksObject = [];

    for (const track of tracks) {
        const trackObject = new Track({
            name: track.name,
            artist: artist._id,
            album: album._id,
        });
        tracksObject.push(trackObject);
    }

    await album.save();
    await artist.save();
    return album;
}