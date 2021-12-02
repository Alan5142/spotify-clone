import ArtistPage from './components/artist-page.js';
import Album from './components/album.js';
import MyAccount from './components/my-account.js';
import AddAlbum from './components/add-album.js';
import { getArtistById, getAlbumById, getMyInfo, getMyArtistInfo } from './api-fetcher.js';
import { getUserType } from './auth-utils.js';

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
    } else if (splitUrl.length === 3 && splitUrl[2] === 'my-account') {
        const userType = getUserType();
        if (userType === 'user') {
            const { name, email } = await getMyInfo();
            const myAccount = new MyAccount({ name, email, type: 'user' });
            main.appendChild(myAccount);
        } else {
            const { name, email, description, artistType } = await getMyArtistInfo();
            const myArtistAccount = new MyAccount({
                name,
                email,
                type: 'artist',
                artistDescription: description,
                artistType,
            });
            main.appendChild(myArtistAccount);
        }
    } else if (splitUrl.length === 3 && splitUrl[2] === 'new-album') {
        const addAlbum = new AddAlbum();
        main.innerHTML = '';
        main.appendChild(addAlbum);
    }
    main.scrollTo(0, 0);
}


onUrlChange(window.location.pathname);

const myAccount = document.getElementById('my-account-btn');

myAccount.addEventListener('click', () => {
    history.pushState(null, null, '/singstereo/my-account');
});

const logout = document.getElementById('logout-btn');

logout.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
});