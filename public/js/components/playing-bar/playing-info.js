const template = document.createElement('template');

template.innerHTML = `
<style>

    .playing-song-info-image img {
        width: 64px;
        height: 64px;
    }

    .playing-song-info-title {
        font-size: 0.9rem;
    }

    .playing-song-info-artist {
        font-size: 0.8rem;
    }

</style>
<div class="playing-song-info d-flex align-items-center h-100">
    <div class="playing-song-info-image pe-3">
        <img alt="">
    </div>
    <div class="playing-song-info-text">
        <h2 class="playing-song-info-title mb-0"></h2>
        <p class="playing-song-info-artist mb-0"></p>
    </div>
</div>
`;

class PlayingInfo extends HTMLElement {
    constructor() {
        super();
        // this.attachShadow({ mode: 'open' });
        this.appendChild(template.content.cloneNode(true));
    }

    static get observedAttributes() {
        return ['title', 'artist', 'image'];
    }

    update(title, artist, image) {
        this.querySelector('.playing-song-info-image img').src = image;
        this.querySelector('.playing-song-info-title').innerText = title;
        this.querySelector('.playing-song-info-artist').innerText = artist;
    }

    connectedCallback() {
        this.update(this.getAttribute('title'), this.getAttribute('artist'), this.getAttribute('image'));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log('hey');
        if (name === 'title') {
            this.querySelector('h2').innerText = newValue;
        } else if (name === 'artist') {
            this.querySelector('p').innerText = newValue;
        } else if (name === 'image') {
            this.querySelector('img').src = newValue;
        }
    }
}

window.customElements.define('playing-info', PlayingInfo);

export default PlayingInfo;