import TrackItem from "./track-item.js";

const template = document.createElement('template');

template.innerHTML = `
<div class="album ps-4 pt-4 pe-4">
    <div class="album-header row">
        <div class="col-sm-12 col-md-3 d-flex justify-content-center">
            <img class="album-cover no-select" src="">
        </div>

        <div class="col-sm-12 col-md-8 d-flex justify-content-end flex-column">
            <h5 class="album-text no-select">Album</h5>
            <h1 class="album-title no-select"></h1>
            <h5 class="no-select">
                By <a class="album-artist"></a>
            </h5>
        </div>
    </div>

    <hr>

    <div class="album-controls ps-4">
        <div class="album-controls-buttons">
            <button class="play-button btn btn-success rounded-circle">
                <i class="fas fa-play"></i>
            </button>
        </div>
    </div>

    <hr>

    <div class="album-tracks">
        <h2 class="no-select">Tracks</h2>
        <div class="album-tracks-list">
            <table class="table track-table table-borderless">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Title</th>
                        <th scope="col">
                            <i class="fas fa-clock"></i>
                        </th>
                    </tr>
                </thead>
                <tbody class="album-tracks-list-body no-select">
                    <tr>
                        <th scope="row">1</th>
                        <td>Future Nostalgia</td>
                        <td>3:04</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
`;


class Album extends HTMLElement {
    constructor() {
        super();
        this.data = null;
        this.appendChild(template.content.cloneNode(true));
    }

    static get observedAttributes() {
        return ['data'];
    }

    connectedCallback() {
        if (this.hasAttribute('data')) {
            this.data = JSON.parse(this.getAttribute('data'));
        }
        this.render();
    }

    render() {
        if (this.data === null) return;
        this.querySelector('.album-title').innerText = this.data.title;
        const artistNameElement = this.querySelector('.album-artist');
        artistNameElement.innerText = this.data.artist;
        artistNameElement.addEventListener('click', () => {
            const currentUrl = window.location.pathname;
            const splittedUrl = currentUrl.split('/');
            const artistId = splittedUrl[3];
            
            window.history.pushState({}, '', `/singstereo/artist/${artistId}`);
        });
        this.querySelector('.album-cover').src = this.data.cover;

        const albumTracks = this.querySelector('.album-tracks-list-body');
        albumTracks.innerHTML = '';
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
        tracks.forEach((e, i) => {
            const albumItem = new TrackItem();
            albumItem.setAttribute('data', JSON.stringify({
                ...e,
                trackNumber: i + 1,
                albumImage: this.data.cover,
                artist: this.data.artist,
            }))
            albumTracks.appendChild(albumItem);
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'data' && JSON.parse(newValue) !== this.data) {
            this.data = JSON.parse(newValue);
            this.render();
        }
    }
}

window.customElements.define('album-page-component', Album);

export default Album;