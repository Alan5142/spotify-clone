import AlbumItem from "./album-item.js";

const template = document.createElement('template');

template.innerHTML = `
<div class="artist-page">
    <div class="artist-page-header mt-0">
        <div class="artist-page-header-info h-100 d-flex align-items-end">
            <div class="artist-page-header-info-name">
                <h1 class="artist-page-header-info-name-text ps-3 pb-4 no-select">
                </h1>
                <div class="pb-2"> </div>
            </div>
        </div>
    </div>
    <div class="artist-page-content ms-3 me-3">
        <div class="artist-page-content-albums">
            <div class="artist-page-content-albums-header">
                <h2 class="artist-page-content-albums-header-text">Albums</h2>
            </div>
            <hr>
            <div class="artist-page-content-albums-list">

            </div>
        </div>
    </div>
</div>
<link rel="stylesheet" href="/public/css/components/artist-page.css">
<link rel="stylesheet" href="/public/css/components/album-item.css">
`;

class ArtistPage extends HTMLElement {
    constructor() {
        super();
        this.appendChild(template.content.cloneNode(true));
    }

    static get observedAttributes() {
        return ['data'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'data') {
            this.data = JSON.parse(newValue);
            this.render();
        }
    }

    render() {
        const artistPageHeaderImage = this.querySelector('.artist-page-header');
        const artistPageHeaderInfoNameTextName = this.querySelector('.artist-page-header-info-name-text');

        artistPageHeaderImage.style.backgroundImage = `url(${this.data.image})`;
        artistPageHeaderInfoNameTextName.innerText = this.data.name;

        const albumListElement = this.querySelector('.artist-page-content-albums-list');

        const albumItems = this.data.albums.map(album => {
            const albumItem = new AlbumItem();
            albumItem.setAttribute('data', JSON.stringify(album));
            return albumItem;
        });

        albumListElement.innerHTML = '';
        albumItems.forEach(albumItem => {
            albumListElement.appendChild(albumItem);
        });
    }
}

window.customElements.define('artist-page', ArtistPage);

export default ArtistPage;