const template = document.createElement('template');

template.innerHTML = `
    <th class="track-number" scope="row">1</th>
    <td class="track-title">Future Nostalgia</td>
    <td class="track-duration">3:04</td>
`;

class AlbumItem extends HTMLTableRowElement {
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
        this.render();
        
        this.onmouseenter = () => {
            this.style.backgroundColor = '#f5f5f510';
            const trackNumber = this.querySelector('.track-number');
            trackNumber.innerHTML = `<i class="fas fa-play"></i>`;
        };

        this.onmouseleave = () => {
            this.style.backgroundColor = '';
            const trackNumber = this.querySelector('.track-number');
            trackNumber.innerHTML = this.data.trackNumber;
        };

        this.onclick = () => {
            const nowPlaying = document.querySelector('now-playing');

            if (this.data.title === 'Levitating') {
                console.log(this.data);
                nowPlaying.setAttribute('music-data', JSON.stringify({
                    title: this.data.title,
                    artist: this.data.artist,
                    image: this.data.albumImage,
                    audio: '/public/music/Levitating.mp3',
                    autoplay: true
                }));
            }

        }
    }

    render() {
        this.querySelector('.track-number').textContent = this.data.trackNumber;
        this.querySelector('.track-title').textContent = this.data.title;
        this.querySelector('.track-duration').textContent = this.data.duration;
    }
}

export default AlbumItem;
window.customElements.define('album-item', AlbumItem, { extends: 'tr' });
