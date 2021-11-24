
const template = document.createElement('template');
template.innerHTML = `
<div class="playing-container ms-2">
    <div class="row w-100">
        <div class="col-md-3 col-lg-2 col-sm-12">
            <div class="playing-song-info d-flex align-items-center h-100">
                <div class="playing-song-info-image pe-3">
                    <img alt="">
                </div>
                <div class="playing-song-info-text w-100">
                    <h2 class="playing-song-info-title mb-0"></h2>
                    <p class="playing-song-info-artist mb-0"></p>
                </div>
            </div>

        </div>
        <div class="col-md col-sm-12 d-fex flex-column w-100 justify-content-center">
            <div class="play-controls w-100">
                <div class="play-controls-buttons w-100 d-flex justify-content-center pb-2">
                    <button id="back-button" class="btn btn-outline-secondary btn-sm audio-button">
                        <i class="fas fa-backward"></i>
                    </button>
                    <button id="play-button" class="btn btn-outline-secondary btn-sm audio-button">
                        <i id="play-button-icon" class="fas fa-play"></i>
                    </button>
                    <button id="forward-button" class="btn btn-outline-secondary btn-sm audio-button">
                        <i class="fas fa-forward"></i>
                    </button>
                </div>
            </div>
            <div class="d-flex w-100 justify-content-center pb-2">
                <p id="current-minutes" class="time-text mb-0 align-self-center me-2">00:00</p>
                <div id="audio-progress-container" class="progress playing-progress align-self-center">
                    <div id="audio-progress" class="progress-bar d-flex align-items-center justify-content-right" role="progressbar" style="width: 0%" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100">
                    </div>
                </div>
                <p id="total-minutes" class="time-text mb-0 align-self-center ms-2">3:50</p>
            </div>
        </div>
        <div class="col-md-2 col-sm-12 volume-container">
            <div class="d-flex h-100 w-100 align-items-center justify-content-center">
                <i id="volume-icon" class="fas fa-volume-up"></i>
                <input id="volume-input" type="range" value="100" class="form-range ms-2" min="0" max="100" step="1" id="customRange3">
            </div>
        </div>
    </div>
</div>
<link rel="stylesheet" href="/public/css/components/now-playing.css">
`;

class NowPlaying extends HTMLElement {
    constructor() {
        super();
        this.volume = 100;
        this.audio = null;
        this.appendChild(template.content.cloneNode(true));
    }

    static get observedAttributes() {
        return ['music-data'];
    }

    update() {
        const container = this.querySelector('.playing-container');
        if (this.data === null) {
            container.style.display = 'none';
            return;
        }
        container.style.display = '';
        this.querySelector('.playing-song-info-image img').src = this.data.image;
        this.querySelector('.playing-song-info-title').innerText = this.data.title;
        this.querySelector('.playing-song-info-artist').innerText = this.data.artist;

        if (this.data.audio !== null) {
            this.audio = new Audio(this.data.audio);
            if (this.data.autoplay) {
                this.play();
            }
            this.audio.volume = this.volume / 100;

            this.audio.onloadedmetadata = () => {
                const totalMinutes = this.querySelector('#total-minutes');
                const totalSeconds = new Date(Math.ceil(this.audio.duration) * 1000).toISOString().substr(14, 5);
                totalMinutes.innerText = totalSeconds;
            }

            const currentMinutes = this.querySelector('#current-minutes');
            currentMinutes.innerText = '00:00';
            const audioProgress = this.querySelector('#audio-progress');
            audioProgress.style.width = '0%';
            
            this.audio.ontimeupdate = () => {
                const audioProgressWidth = (this.audio.currentTime / this.audio.duration) * 100;
                audioProgress.style.width = audioProgressWidth + '%';

                const currentSeconds = new Date(Math.ceil(this.audio.currentTime) * 1000).toISOString().substr(14, 5);
                currentMinutes.innerText = currentSeconds;
            };

            this.audio.onended = () => {
                console.log('ended');
                // TODO : play next song
                const playEventDetail = {
                    trackId: this.data.id,
                };
                const playEvent = new CustomEvent('track-pause', {
                    detail: playEventDetail,
                });
                this.dispatchEvent(playEvent);
            }
        }
    }

    connectedCallback() {
        const audioIcon = this.querySelector('#volume-icon');
        const audioInput = this.querySelector('#volume-input');

        audioInput.addEventListener('input', (e) => {
            this.volumeChange(audioIcon, e.target.value);
        });

        const playButton = this.querySelector('#play-button');
        playButton.addEventListener('click', (e) => {
            this.play();
        });
        
        const audioProgressContainer = this.querySelector('#audio-progress-container');
        audioProgressContainer.addEventListener('click', (e) => {
            const audioProgress = this.querySelector('#audio-progress');
            const audioProgressWidth = (e.offsetX / audioProgressContainer.offsetWidth) * 100;
            audioProgress.style.width = audioProgressWidth + '%';
            this.audio.currentTime = (audioProgressWidth / 100) * this.audio.duration;
        });

        this.data = JSON.parse(this.getAttribute('music-data')) || null;
        this.update();
    }

    disconnectedCallback() {
        this.audio.pause();
        this.audio.remove();
    }

    volumeChange(audioIcon, volume) {
        this.volume = volume;
        audioIcon.classList.remove('fa-volume-up');
        audioIcon.classList.remove('fa-volume-down');
        audioIcon.classList.remove('fa-volume-mute');
        if (volume > 50) {
            audioIcon.classList.add('fa-volume-up');
        } else if (volume > 0) {
            audioIcon.classList.add('fa-volume-down');
        } else {
            audioIcon.classList.add('fa-volume-mute');
        }

        if (this.audio !== null) {
            this.audio.volume = volume / 100;
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'music-data') {
            const newData = JSON.parse(newValue);
            if (newData !== null) {
                if (newData !== this.data && this.audio !== null) {
                    this.audio.pause();
                    this.audio.remove();
                }
                this.data = newData;
                this.update();
            }
        }
    }

    play() {
        if (this.audio !== null) {
            const playAudioIcon = this.querySelector('#play-button-icon');
            if (this.audio.paused) {
                this.audio.play();
                playAudioIcon.classList.remove('fa-play');
                playAudioIcon.classList.add('fa-pause');

                const playEventDetail = {
                    trackId: this.data.trackId,
                };
                const playEvent = new CustomEvent('track-play', {
                    detail: playEventDetail,
                    bubbles: true,
                    composed: true
                });
                this.dispatchEvent(playEvent);

            } else {
                this.audio.pause();
                playAudioIcon.classList.remove('fa-pause');
                playAudioIcon.classList.add('fa-play');

                const playEventDetail = {
                    trackId: this.data.id,
                };
                const playEvent = new CustomEvent('track-pause', {
                    detail: playEventDetail,
                });
                this.dispatchEvent(playEvent);
            }
        }
    }

    get currentPlayingTrack() {
        return this.data.trackId;
    }
}

window.customElements.define('now-playing', NowPlaying);
export default NowPlaying;