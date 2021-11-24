import TrackItem from "./track-item.js";

const template = document.createElement('template');

template.innerHTML = `
<div class="album-item">
    <div class="album-header d-flex">
        <div class="album-header-image">
            <img class="album-cover no-select" src="">
            <button class="album-play-button d-flex justify-content-center align-items-center no-select btn btn-success rounded-circle">
                <span class="fa fa-play"></span>
            </button>
        </div>
        <div class="album-info ms-2 d-flex flex-column justify-content-center">
            <span>
                <a class="album-name-link">
                    <h2 class="album-title mb-0 no-select"></h2>
                </a>
                <h3 class="album-artist mb-0 no-select"></h3>
                <p class="album-year mb-0 mt-0 no-select"></p>
            </span>
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
                </tbody>
            </table>
        </div>
    </div>
</div>
<hr class="artist-separator">
`;

class AlbumItem extends HTMLElement {
    constructor() {
        super();
        this.data = null;
        this.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        const data = this.getAttribute('data');
        if (data) {
            this.data = JSON.parse(data);
        }

        const albumHeader = this.querySelector('.album-header') || this.querySelector('.album-header-mobile');

        albumHeader.onmouseenter = () => {
            albumHeader.style.backgroundColor = '#f5f5f510';
        };

        albumHeader.onmouseleave = () => {
            albumHeader.style.backgroundColor = '';
        };
        this.render();
    }

    render() {
        this.querySelector('.album-cover').src = this.data.cover;
        this.querySelector('.album-title').textContent = this.data.name;
        this.querySelector('.album-artist').textContent = this.data.artist;
        const releaseDate = new Date(this.data.releaseDate);
        this.querySelector('.album-year').textContent = releaseDate.getFullYear();

        const albumTracks = this.querySelector('.album-tracks-list-body');
        albumTracks.innerHTML = '';
        const tracks = this.data.tracks;
        tracks.forEach((track, i) => {
            const albumItem = new TrackItem();
            albumItem.setAttribute('data', JSON.stringify({
                ...track,
                trackNumber: i + 1,
                albumImage: this.data.cover,
                artist: this.data.artist,
            }))
            albumTracks.appendChild(albumItem);
        });

        const goToAlbum = () => {
            window.history.pushState({}, '', `/singstereo/artist/${this.data.artistId}/album/${this.data.id}`);
        };

        this.querySelector('.album-header').onclick = goToAlbum;

        this.querySelector('.album-name-link').onclick = (e) => {
            e.preventDefault();
            goToAlbum();
        };
    }
}

window.customElements.define('album-item', AlbumItem);

export default AlbumItem;