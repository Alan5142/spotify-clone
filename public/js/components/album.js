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
            <h5 class="album-artist no-select">
                <a class="album-artist no-select">
                
                </a>
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
        <p>lorem ipsum</p>
        <p>lorem ipsum</p>
        <p>lorem ipsum</p>
        <p>lorem ipsum</p>
        <p>lorem ipsum</p>
        <p>lorem ipsum</p>
        <p>lorem ipsum</p>
        <p>lorem ipsum</p>
        <p>lorem ipsum</p>
        <p>lorem ipsum</p>
        <p>lorem ipsum</p>
        <p>lorem ipsum</p>
        <p>lorem ipsum</p>
        <p>lorem ipsum</p>
        <p>lorem ipsum</p>
        <p>lorem ipsum</p>
        <p>lorem ipsum</p>
        <p>lorem ipsum</p>
        <p>lorem ipsum</p>
        <p>lorem ipsum</p>
        <p>lorem ipsum</p>
        <p>lorem ipsum</p>
        <p>lorem ipsum</p>
        <p>lorem ipsum</p>
        <p>lorem ipsum</p>
        <p>lorem ipsum</p>
        </div>
    </div>
</div>
<link rel="stylesheet" href="/public/css/components/album-page.css">
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
        this.querySelector('.album-artist').innerText = `By ${this.data.artist}`;
        this.querySelector('.album-cover').src = this.data.cover;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'data') {
            this.data = JSON.parse(newValue);
            this.render();
        }
    }
}

window.customElements.define('album-page-component', Album);

export default Album;