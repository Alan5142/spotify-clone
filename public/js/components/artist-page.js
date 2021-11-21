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
    <div class="artist-page-content ms-2">
        <div class="artist-page-content-albums">
            <div class="artist-page-content-albums-header">
                <h2 class="artist-page-content-albums-header-text">Albums</h2>
            </div>
            <div class="artist-page-content-albums-list">
                <div class="artist-page-content-albums-list-item">
                    <div class="artist-page-content-albums-list-item-image">
                        <img alt="">
                    </div>
                    <div class="artist-page-content-albums-list-item-info">
                        <h2 class="artist-page-content-albums-list-item-info-title">
                            <span class="artist-page-content-albums-list-item-info-title-text"></span>
                        </h2>
                        <p class="artist-page-content-albums-list-item-info-artist">
                            <span class="artist-page-content-albums-list-item-info-artist-text"></span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<link rel="stylesheet" href="/public/css/components/artist-page.css">
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
    }

    attachedCallback() {

    }
}

window.customElements.define('artist-page', ArtistPage);

export default ArtistPage;