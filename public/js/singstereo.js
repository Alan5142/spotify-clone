import ArtistPage from './components/artist-page.js';
import Album from './components/album.js';

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
        const artistPage = new ArtistPage();

        const tracks = [
            {
                title: 'Future Nostalgia',
                duration: '3:04',
                id: '1',
            },
            {
                title: 'Don\'t Start Now',
                duration: '3:03',
                id: '2',
            },
            {
                title: 'Cool',
                duration: '3:29',
                id: '3',
            },
            {
                title: 'Physical',
                duration: '3:13',
                id: '4',
            },
            {
                title: 'Levitating',
                duration: '3:32',
                id: '5',
            },
            {
                title: 'Pretty Please',
                duration: '3:14',
                id: '6',
            },
            {
                title: 'Hallucinate',
                duration: '3:28',
                id: '7',
            },
            {
                title: 'Love Again',
                duration: '4:18',
                id: '8',
            },
            {
                title: 'Break My Heart',
                duration: '3:41',
                id: '9',
            },
            {
                title: 'Good In Bed',
                duration: '3:38',
                id: '10',
            },
            {
                title: 'Boys Will Be Boys',
                duration: '2:46',
                id: '11',
            },
        ];
        const artistPageData = {
            id: 1,
            image: "https://i.scdn.co/image/ab67618600001016214132735765d2353974e233",
            name: "Dua Lipa",
            description: "desc",
            genres: ["pop", "dance", "electronic"],
            albums: [
                {
                    id: "1",
                    name: "Future Nostalgia",
                    releaseDate: Date.parse("2020-03-27"),
                    artist: "Dua Lipa",
                    artistId: "1",
                    cover: "https://www.sanborns.com.mx/imagenes-sanborns-ii/1200/190295286101.jpg",
                    tracks: tracks,
                },
                {
                    id: "2",
                    name: 'Dua Lipa',
                    releaseDate: Date.parse("2020-03-27"),
                    artist: "Dua Lipa",
                    artistId: "1",
                    cover: "https://i.scdn.co/image/ab67616d00001e021764e1a1b94e887206782640",
                    tracks: [
                        {
                            title: "Genesis",
                            duration: "3:25",
                            id: "30",
                        }
                    ]
                }
            ],
        };
        artistPage.setAttribute('data', JSON.stringify(artistPageData));
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
    main.scrollTo(0, 0);
}


onUrlChange(window.location.pathname);