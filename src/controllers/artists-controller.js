import '../data/mongo.js';
import Artist from '../models/artist.js';
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
    return user;
}

export async function getArtistById(id) {
    return await Artist.findById(id);
}

export async function getArtistByName(name) {
    const artist = await Artist.findOne({ name });
    return artist;
}

export async function modifyArtist(id, name, password, description, type) {
    const artist = await Artist.findById(id);
    if (!artist) {
        throw new Error(`Artist not found: ${albumId}`);
    }
    artist.name = name || artist.name;
    artist.description = description || artist.description;
    artist.artistType = type || artist.artistType;
    if (password) {
        const hashedPassword = await encryptPassword(password);
        artist.password = hashedPassword;
    }
    await artist.save();
    return artist;
}

export async function createAlbum(artistId, name, releaseDate, tracks, image, description, genres) {
    const artist = await Artist.findById(artistId);
    if (!artist) {
        throw new Error(`Artist not found: ${artistId}`);
    }
    const album = new Album({
        title: name,
        releaseDate,
        tracks,
        artist: artist._id,
        image,
        description,
        genres
    });
    artist.albums.push(album);
    await artist.save();
}

export async function getAlbumById(id){
    return await Album.findById(id);
}

export async function modifyAlbum(albumId, name, releaseDate, tracks, description, genres) {
    const album = await Album.findById(albumId);
    if (!album) {
        throw new Error(`Album not found: ${albumId}`);
    }
    album.title = name || album.name;
    album.releaseDate = releaseDate || album.releaseDate;
    album.tracks = tracks || album.tracks;
    album.description = description || album.description;
    album.genres = genres || album.genres;
    await album.save();
    return album;
}