import ArtistPage from './components/artist-page.js';
import Album from './components/album.js';
import { getArtistById, getAlbumById } from './api-fetcher.js';

if (localStorage.getItem('token') === null) {
    window.location.href = '/login';
}

const pushState = window.history.pushState;
const main = document.querySelector('main');

window.history.pushState = function (state, title, url) {
    pushState.call(window.history, state, title, url);

    const event = new Event('pushstate');
    event.state = state;
    event.title = title;
    event.url = url;
    window.dispatchEvent(event);
};

window.addEventListener('pushstate', async (event) => {
    await onUrlChange(event.url);
});

window.addEventListener('popstate', async (event) => {
    await onUrlChange(window.location.pathname);
})


async function onUrlChange(url) {
    if (url.endsWith('/')) {
        url = url.substring(0, url.length - 1);
    }
    const splitUrl = url.split('/');
    if (splitUrl.length === 4 && splitUrl[2] === 'artist') {
        const artistId = splitUrl[3];
        const artist = await getArtistById(artistId);
        
        artist.albums.forEach(album => {
            album.artist = artist.name;
            album.artistId = artist.id;
        });

        const artistPage = new ArtistPage();
        artistPage.setAttribute('data', JSON.stringify(artist));
        main.innerHTML = '';
        main.appendChild(artistPage);
    } else if (splitUrl.length === 6 && splitUrl[2] === 'artist' && splitUrl[4] === 'album') {
        const artistId = splitUrl[3];
        const albumId = splitUrl[5];

        const album = await getAlbumById(artistId, albumId);
        const albumPage = new Album();
        albumPage.setAttribute('data', JSON.stringify(album));
        main.innerHTML = '';
        main.appendChild(albumPage);
    }
    main.scrollTo(0, 0);
}


onUrlChange(window.location.pathname);