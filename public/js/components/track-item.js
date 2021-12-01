const template = document.createElement('template');

template.innerHTML = `
    <th class="track-number" scope="row">1</th>
    <td class="track-title">Future Nostalgia</td>
    <td class="track-duration">3:04</td>
`;

class TrackItem extends HTMLTableRowElement {
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
            if (!this.isPlaying) {
                const trackNumber = this.querySelector('.track-number');
                this.style.backgroundColor = '#f5f5f510';
                trackNumber.innerHTML = `<i class="fas fa-play"></i>`;
            }
        };

        this.onmouseleave = () => {
            if (!this.isPlaying) {
                this.style.backgroundColor = '';
                const trackNumber = this.querySelector('.track-number');
                trackNumber.innerHTML = this.data.trackNumber;
            }
        };

        const nowPlaying = document.querySelector('now-playing');
        if (nowPlaying.currentPlayingTrack === this.data.id) {
            this.setAsPlaying();
        }

        this.onclick = () => {
            nowPlaying.setSongs(this.data.albumTracks, this.data.trackNumber - 1);
            nowPlaying.setAttribute('music-data', JSON.stringify({
                title: this.data.title,
                artist: this.data.artist,
                image: this.data.albumImage,
                audio: this.data.music,
                autoplay: true,
                trackId: this.data.id,
            }));
        };

        nowPlaying.addEventListener('track-play', e => this.onSongPlayed(e));
        nowPlaying.addEventListener('track-pause', e => this.onSongPaused(e));
    }

    render() {
        this.querySelector('.track-number').textContent = this.data.trackNumber;
        this.querySelector('.track-title').textContent = this.data.title;
        const music = new Audio(this.data.music);
        music.preload = 'metadata';
        this.querySelector('.track-duration').textContent = 'Loading...';
        music.addEventListener('loadedmetadata', () => {
            const totalSeconds = new Date(Math.ceil(music.duration) * 1000).toISOString().substr(14, 5);
            this.querySelector('.track-duration').textContent = totalSeconds;
            music.removeEventListener('loadedmetadata', () => {});
            music.pause();
            music.remove();
        });


        const nowPlaying = document.querySelector('now-playing');
    }

    onSongPlayed(e) {
        if (e.detail.trackId === this.data.id) {
            this.setAsPlaying();
        } else if (this.isPlaying) {
            this.onSongPaused(e);
        }
    }

    onSongPaused(e) {
        if (this.isPlaying) {
            this.isPlaying = false;
            this.querySelector('.track-number').innerHTML = this.data.trackNumber;
            this.style.backgroundColor = '';
        }
    }

    setAsPlaying() {
        this.isPlaying = true;
        this.querySelector('.track-number').innerHTML = `<i class="fas fa-pause"></i>`;
        this.style.backgroundColor = '#19875440';
    }

    disconnectedCallback() {
        this.onmouseenter = null;
        this.onmouseleave = null;
        this.onclick = null;
        const nowPlaying = document.querySelector('now-playing');
        nowPlaying.removeEventListener('track-play', e => this.onSongPlayed(e));
        nowPlaying.removeEventListener('track-pause', e => this.onSongPaused(e));
    }
}

export default TrackItem;
window.customElements.define('track-item', TrackItem, { extends: 'tr' });
