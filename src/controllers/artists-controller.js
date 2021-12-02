import '../data/mongo.js';
import { uploadCover, uploadTrack } from '../data/files.js';
import Artist from '../models/artist.js';
import Track from '../models/track.js';
import { encryptPassword } from "../utils/encrypt.js";
import Album from '../models/album.js';

export async function createArtist(name, email, password, description, type) {
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
    return await Artist.findById(id, undefined, {
        populate: {
            path: 'albums',
            populate: {
                path: 'tracks',
            },
        },
    });
}

export async function getArtistByName(name) {
    const artist = await Artist.findOne({ name }).populate('albums').populate('tracks');
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

export async function createAlbum({artistId, name, releaseDate, trackNames, tracks, image, description, genres}) {
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
    const uploadedImage = await uploadCover(image, album.title, album._id);
    album.image = uploadedImage;
    artist.albums.push(album);

    const tracksObject = [];
    for (let i = 0; i < trackNames.length; i++) {
        const trackName = trackNames[i];
        const trackFile = tracks[i];
        const uploadedTrack = await uploadTrack(trackFile, trackName, album._id);
        const track = new Track({
            title: trackName,
            file: uploadedTrack,
            album: album._id,
            artist: artist._id
        });
        tracksObject.push(track);
    }
    album.tracks = tracksObject;

    await Track.insertMany(tracksObject);

    await album.save();
    await artist.save();
    return album;
}

export async function getAlbumById(id){
    return await Album.findById(id, undefined, {
        populate: {
            path: 'tracks artist',
        },
    });
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
