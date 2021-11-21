import ArtistPage from './components/artist-page.js';
import Album from './components/album.js';

const pushState = window.history.pushState;
const main = document.querySelector('main');

window.history.pushState = function(state, title, url) {
    pushState.call(window.history, state, title, url);
    
    const event = new Event('pushstate');
    event.state = state;
    event.title = title;
    event.url = url;
    window.dispatchEvent(event);
};

window.addEventListener('pushstate', async function (event) {
    onUrlChange(event.url);
});


async function onUrlChange(url) {
    const splitUrl = url.split('/');
    if (splitUrl.length === 4 && splitUrl[2] === 'artist') {
        const artistId = splitUrl[3];
        const artistPage = new ArtistPage();
        artistPage.setAttribute('data', '{"image": "https://i.scdn.co/image/ab67618600001016214132735765d2353974e233", "name": "Dua Lipa", "description": "desc"}');
        main.innerHTML = '';
        main.appendChild(artistPage);
    } else if (splitUrl.length === 6 && splitUrl[2] === 'artist' && splitUrl[4] === 'album') {
        const artistId = splitUrl[3];
        const albumId = splitUrl[5];

        const albumPage = new Album();

        albumPage.setAttribute('data', '{"cover": "https://www.sanborns.com.mx/imagenes-sanborns-ii/1200/190295286101.jpg", "title": "Future Nostalgia", "artist": "Dua Lipa"}');
        main.innerHTML = '';
        main.appendChild(albumPage);
    }
}

onUrlChange(window.location.pathname);