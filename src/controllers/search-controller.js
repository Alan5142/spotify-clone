import '../data/mongo.js';
import Artist from '../models/artist.js';
import Track from '../models/track.js';
import Album from '../models/album.js';

export async function search(searchString) {
    const artist = await Artist.find(
        {$text: {$search: searchString}},
        {score: {$meta: "textScore"}})
        .limit(30);
    const tracks = await Track.find(
        {$text: {$search: searchString}},
        {score: {$meta: "textScore"}})
        .limit(30);
    const albums = await Album.find(
        {$text: {$search: searchString}},
        {score: {$meta: "textScore"}})
        .limit(30);

    const objects = [...artist, ...tracks, ...albums].sort((a, b) => a.score - b.score);
    console.log(objects);
    return objects;
}