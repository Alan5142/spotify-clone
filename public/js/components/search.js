const template = document.createElement('template');

template.innerHTML = `
<style>
    .search-title {
        font-size: 1.2rem;
        font-weight: bold;
        user-select: none;
    }

    .search-artist {
        font-size: 0.7rem;
        font-weight: normal;
        user-select: none;
    }

    .item-type {
        font-size: 1.3rem;
        font-weight: bold;
        user-select: none;
        margin-bottom: 0rem;
    }

    .click-hover:hover {
        cursor: pointer;
    }
</style>
<div class="container">
    <h2 id ="search-results">Search results for: </h2>

    <div id="search-results-container d-flex flex-column">
        <div id="search-results-list" class="d-flex flex-column w-100">
            
        </div>
    </div>
</div>
`;

function getElementType(object) {
    if (object.name !== undefined) {
        return 'artist';
    } else if (object.album !== undefined) {
        return 'track';
    }
    return 'album';
}

function createListElement(object) {
    const element = document.createElement('div');
    element.innerHTML = `
<div id="search-results-list-item" class="d-flex flex-row w-100 pb-2 click-hover">
    <div id="search-image-container">
        <img id="search-image" width="80" height="80" src="https://upload.wikimedia.org/wikipedia/en/9/95/All_Things_Will_Unwind.jpg" id="search-image">
    </div>
    <div id="search-title-container" class="ms-2">
        <h1 class="item-type">
            Album
        </h1>
        <h2 id="search-title" class="search-title mb-0">
            All Things Will Unwind
        </h2>
        <h3 id="search-author" class="search-artist">
            My Brightest Diamond
        </h3>
    </div>
</div>
    `;

    element.onmouseenter = function () {
        element.style.backgroundColor = '#f5f5f510';
    };

    element.onmouseleave = function () {
        element.style.backgroundColor = '';
    };

    const type = getElementType(object);
    const image = element.querySelector('#search-image');
    const title = element.querySelector('#search-title');
    const author = element.querySelector('#search-author');
    const itemType = element.querySelector('.item-type');
    
    const nowPlaying = document.querySelector('now-playing');

    switch (type) {
        case 'artist':
            image.src = object.image || 'https://images.squarespace-cdn.com/content/v1/52d6a652e4b07924afb11fc3/1516126900073-UJW8F6I2X2KCJ6TG9GL5/MBD+Promo+Splice+2.jpg?format=1500w';
            title.innerText = object.name;
            author.innerText = '';
            itemType.innerText = 'Artist';
            element.onclick = function () {
                window.history.pushState({}, '', `/singstero/artist/${object.id}`);
            };
            break;
        case 'album':
            image.src = object.cover;
            title.innerText = object.title;
            author.innerText = object.artistName;
            itemType.innerText = 'Album';

            element.onclick = function () {
                console.log(object.artistId);
                window.history.pushState({}, '', `/singstero/artist/${object.artistId}/album/${object.id}`);
            };
            break;
        case 'track':
            image.src = object.album.cover;
            title.innerText = object.title;
            author.innerText = object.artistName;
            itemType.innerText = 'Track';

            element.onclick = function () {
                nowPlaying.setSongs([], 0);
                console.log(object);
                nowPlaying.setAttribute('music-data', JSON.stringify({
                    title: object.title,
                    artist: object.artistName,
                    image: object.album.cover,
                    audio: object.music,
                    autoplay: true,
                    trackId: object.id,
                }));
            };
            break;
    }

    return element;
}

class Search extends HTMLElement {
    constructor({ query, searchResults }) {
        super();
        this.appendChild(template.content.cloneNode(true));
        this.query = query;
        this.searchResults = searchResults;
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const results = document.querySelector('#search-results');
        results.innerHTML = `Search results for: ${this.query}`;

        const list = document.querySelector('#search-results-list');
        console.log(this.searchResults);

        this.searchResults.forEach(element => {
            list.appendChild(createListElement(element));
        });
    }
}

window.customElements.define('search-component', Search);
export default Search;