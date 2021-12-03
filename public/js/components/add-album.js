import { createAlbum } from '../api-fetcher.js';
import { getUserName, getUserId } from "../auth-utils.js";

const template = document.createElement('template');

template.innerHTML = `
<style>
  .new-album-container {
    width: 50%;
  }

  @media screen and (max-width: 800px) {
    .new-album-container {
        width: 100%;
    }
  }

  .delete-genre {
    cursor: pointer;
    left: 95%;
    top: 2px;
    width: 1rem;
    height: 1rem;
    font-size: 0.5rem;
    border-radius: 50%;
  }

  #artist-name {
    font-size: 0.7rem;
    padding-top: 4px;
  }

  #cover-button {
    display: block;
  }

</style>
<div class="container">
    <div class="w-100 d-flex justify-content-center">
      <form id="add-album-form" class="d-flex flex-column new-album-container">
        <h1>Add Album</h1>
        <div class="row">
          <div class="col-12 col-md-5">
            <a id="cover-button">
              <img id="preview-image" width="100%" height="100%" src="/public/images/cover-alt.png" alt="track-icon">
            </a>
            <input accept="image/*"  type="file" id="album-image" hidden required>
          </div>
          <div class="col-12 col-md-7">
            <div class="d-flex flex-column w-100">
              <input type="text" id="album-name" name="album-name" required placeholder="Album name">
              <h6 id="artist-name" class="fw-light">By: Epica</h6>
              <label for="release-date">Release Date</label>
              <input type="date" id="release-date" name="release-date" required>
              
              <label for="genres">Genres</label>
              <input type="text" id="genres" name="genres" placeholder="Insert name and press enter">
              
              <div id="genres-list"></div>
              
            </div>
          </div>
        </div>
        <div id="upload-progress" class="progress mt-2 d-none">
            <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
              25%
            </div>
          </div>
        <hr>

        <div id="track-list" class="d-flex flex-column">
          <label for="track-name">Track Name</label>
          <input class="mt-1" type="text" id="track-name" name="track-name" placeholder="Track name">
          <label for="track-number">Track Number</label>
          <input class="mt-1" min="1" type="number" id="track-number" name="track-number" placeholder="Track number">
          <input accept=".mp3" class="mt-1" type="file" id="track-file" name="track-file">
          <input type="text" id="track-duration" name="track-duration" hidden>
          <button type="button" id="add-track" class="btn btn-success mt-2">
            <i class="fas fa-plus"></i>Add track
          </button>
        </div>
        
        <hr>

        <div id="added-tracks">
        </div>

        <button type="submit" id="submit-album" class="btn btn-success mt-2">
          Create album
        </button>
      </form>
    </div>
</div>
`;

function createGenreBadge(genre, onDelete) {
  const badge = document.createElement('span');
  const colors = ['bg-primary', 'bg-secondary', 'bg-success', 'bg-warning', 'bg-info'];
  badge.classList.add('badge',
    'rounded-pill',
    'position-relative',
    colors[Math.floor(Math.random() * colors.length)],
    'ms-2',
  );
  badge.innerText = genre;
  badge.setAttribute('data-genre', genre);

  const deleteGenre = document.createElement('span');
  deleteGenre.classList.add('position-absolute', 'translate-middle', 'p-1', 'bg-danger', 'delete-genre');
  deleteGenre.innerText = 'x';
  deleteGenre.addEventListener('click', (e) => {
    onDelete(e.target.parentElement);
  });
  badge.appendChild(deleteGenre);
  return badge;
}

function createTrackItem(name, trackNumber, onDelete) {
  const trackItem = document.createElement('div');
  trackItem.classList.add('d-flex', 'flex-row', 'ms-2');
  trackItem.innerHTML = `
    <button type="button" class="btn btn-danger mt-2">
      <i class="fas fa-trash-alt"></i>
    </button>
    <span class="mr-2 align-self-center">${trackNumber}</span>
    <span class="ms-2 align-self-center">${name}</span>
  `;
  trackItem.querySelector('button').addEventListener('click', (e) => {
    onDelete(e.target.parentElement, trackNumber);
  });
  return trackItem;
}

class AddAlbum extends HTMLElement {
  constructor() {
    super();
    this.appendChild(template.content.cloneNode(true));
    this.genres = new Set();
    this.tracks = [];
  }

  connectedCallback() {
    const form = this.querySelector('#add-album-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.submit();
    });

    const genresInput = this.querySelector('#genres');
    const genresList = this.querySelector('#genres-list');
    genresInput.addEventListener('keydown', (e) => {
      if (e.keyCode === 13) {
        e.preventDefault();
        const genres = e.target.value.split(',');
        genres.map(genre => genre.trim()).forEach((genre) => {
          if (this.genres.has(genre)) {
            return;
          }
          this.genres.add(genre.toLowerCase());
          const genreBadge = createGenreBadge(genre, (badge) => {
            const genre = badge.getAttribute('data-genre');
            const genres = e.target.value.split(',');
            genres.splice(genres.indexOf(genre), 1);
            e.target.value = genres.join(',');
            badge.remove();
            this.genres.delete(genre.toLowerCase());
          });
          genresList.appendChild(genreBadge);
        });
        e.target.value = '';
      }
    });

    const addTrack = this.querySelector('#add-track');
    addTrack.addEventListener('click', async (e) => {
      const trackName = this.querySelector('#track-name');
      const trackFile = this.querySelector('#track-file');
      const trackNumber = this.querySelector('#track-number');
      const trackDuration = this.querySelector('#track-duration');

      if (trackName.value === '' || trackFile.value === '' || trackNumber.value === '' || trackDuration.value === '') {
        return;
      }
      if (this.tracks.find(track => track.number === trackName.number)) {
        return;
      }

      const addedTracks = this.querySelector('#added-tracks');
      addedTracks.innerHTML = '';
      this.tracks.push({
        name: trackName.value,
        number: trackNumber.value,
        file: trackFile.files[0],
        duration: trackDuration.value,
      });

      this.tracks = this.tracks.sort((a, b) => a.number - b.number);

      this.tracks.forEach((track) => {
        addedTracks.appendChild(createTrackItem(track.name, track.number, (trackItem, trackNumber) => {
          const tracks = this.querySelector('#added-tracks');
          tracks.removeChild(trackItem);

          const trackIndex = this.tracks.findIndex((track) => track.number === trackNumber);
          this.tracks.splice(trackIndex, 1);
        }));
      });

      trackName.value = '';
      trackFile.value = '';
      trackNumber.value = '';
    });

    const trackFileInput = this.querySelector('#track-file');
    trackFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const dataView = new DataView(reader.result);

        // get duration
        const duration = dataView.getUint32(6, true);
        const minutes = Math.floor(duration / 60000);
        const seconds = Math.floor((duration % 60000) / 1000);

        // get title
        let titleString = '';
        for (let i = 3; i < 33; i += 1) {
          titleString += String.fromCharCode(dataView.getUint8(dataView.byteLength - 128 + i, true));
        }

        titleString = titleString.replace(/\0/g, '').replace('TAG', '').trim();

        // get track number
        const trackNumber = dataView.getUint8(dataView.byteLength - 128 + 126, true);

        this.querySelector('#track-name').value = titleString;
        this.querySelector('#track-number').value = trackNumber;
      };

      addTrack.disabled = true;
      addTrack.innerHTML = `<div class="spinner-border text-light" role="status">
      <span class="sr-only">Loading...</span>
    </div>`;

      reader.readAsArrayBuffer(file);

      const audioReader = new FileReader();
      audioReader.onload = async (e) => {
        const audio = new Audio(audioReader.result);
        const loadDuration = (audio) => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(audio.duration);
            }, 10000);
            audio.addEventListener('durationchange', () => {
              if (audio.duration !== Infinity) {
                resolve(audio.duration);
              }
            })
            audio.onerror = (e) => {
              reject(e);
            };
          });
        };
        const audioDuration = await loadDuration(audio);
        const duration = new Date(Math.ceil(audioDuration) * 1000).toISOString().substr(14, 5);
        this.querySelector('#track-duration').value = duration;
        addTrack.disabled = false;
        addTrack.innerHTML = '<i class="fas fa-plus"></i>Add track';

        audio.pause();
        audio.remove();
      };

      audioReader.readAsDataURL(file);
    });

    const previewImage = this.querySelector('#preview-image');
    const coverButton = this.querySelector('#cover-button');
    coverButton.addEventListener('click', (e) => {
      this.querySelector('#album-image').click();
    });

    const coverFileInput = this.querySelector('#album-image');
    coverFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });

    this.render();
  }

  async submit() {
    if (this.tracks.length === 0 || this.genres.size === 0) {
      return;
    }

    const albumName = this.querySelector('#album-name').value;
    const releaseDate = this.querySelector('#release-date').value;
    const cover = this.querySelector('#album-image').files[0];
    genres = [...this.genres];
    const tracks = this.tracks;
    const artistId = getUserId();

    const progressBarContainer = this.querySelector('#upload-progress');
    const progressBar = progressBarContainer.children[0];

    progressBarContainer.classList.remove('d-none');
    try {
      // disable all inputs
      const inputs = this.querySelectorAll('input');
      inputs.forEach((input) => {
        input.disabled = true;
      });
      await createAlbum({
        name: albumName,
        releaseDate,
        artistId,
        genres,
        cover,
        durations: tracks.map(track => track.duration),
        tracks: tracks.map(track => track.name),
        trackList: tracks.map(track => track.file),
      }, (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          progressBar.style.width = `${percent}%`;
          progressBar.innerHTML = `${percent}%`;
        }
      });

      alert('Album created successfully!');
    } catch (e) {
      alert('Cannot create album, error: ' + JSON.stringify(e.errors));
    }
    // disable all inputs
    const inputs = this.querySelectorAll('input');
    inputs.forEach((input) => {
      input.disabled = false;
    });
    progressBarContainer.classList.add('d-none');
  }

  render() {
    const userName = getUserName();
    const artistName = this.querySelector('#artist-name');
    artistName.innerText = `By: ${userName}`;
  }
}

window.customElements.define('add-album', AddAlbum);

export default AddAlbum;