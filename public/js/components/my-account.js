import { editArtist, editUser, uploadArtistCover, uploadArtistPicture } from "../api-fetcher.js";

const template = document.createElement('template');

template.innerHTML = `
<style>
    .my-account-container {
        width: 50%;
    }

    @media screen and (max-width: 768px) {
        .my-account-container {
            width: 100%;
        }
    }

    .add-album-button {
        position: absolute;
        bottom: 8px;
        right: 8px;
        border-radius: 50%; 
        width: 4rem;
        height: 4rem;
        font-size: 2rem;
    }
</style>
<div class="container">
    <div class="w-100 d-flex justify-content-center">
        <form id="change-account" class="d-flex flex-column my-account-container">
            <h1 id="my-account-header">My Account</h1>
            <div id="artist-pictures" class="d-none">
                <div class="d-flex flex-column">
                    <div class="d-flex flex-column justify-content-center align-content-center w-100">
                        <h4>Artist Picture</h4>
                        <a id="artist-picture-clickable" class="d-block">
                            <img width="128" height="128" id="artist-picture" src="">
                        </a>
                        <input type="file" id="artist-picture-input" accept="image/*" hidden>

                        <h4>Artist Cover (used for artist page)</h4>
                        <a id="artist-cover-clickable" class="d-block">
                            <img width="100%" height="128" id="artist-cover" src="">
                        </a>
                        <input type="file" id="artist-cover-input" accept="image/*" hidden>
                    </div>
                </div>
            </div>
            <label for="name">Name</label>
            <input type="text" id="name" minlength="1">
            <label for="email">Email: </label>
            <input type="email" disabled id="email">
            
            <div id="artist-description-container" style="display: none">
                <div class="d-flex flex-column artist-info">
                    <label for="artist-description">Artist description</label>
                    <textarea id="artist-description" rows="5" cols="50"></textarea>
                    <label for="artist-type">Artist type</label>
                    <select id="artist-type">
                        <option value="soloist">Solo</option>
                        <option value="band">Band/Group</option>
                    </select>
                </div>
            </div>

            <div class="d-flex flex-column">
                <label for="change-password">Change password</label>
                <input type="checkbox" class="align-self-start" id="change-password">
                <label class="change-password-input" style="display: none" for="new-password">New Password: </label>
                <input class="change-password-input" style="display: none" type="password" id="new-password">
                <label class="change-password-input" style="display: none" for="confirm-password">Confirm Password: </label>
                <input class="change-password-input" style="display: none" type="password" id="confirm-password">
            </div>

            <button type="submit" id="save-changes" class="mt-2 btn btn-success" >Save changes</button>
        </form>

        <button style="display: none" id="add-album-button" class="btn btn-success add-album-button">
            <i class="fas fa-compact-disc"></i>
        </button>
    </div>
</div>
`;

class MyAccount extends HTMLElement {
    constructor({ name, email, type, artistDescription, artistType, artistPicture, artistCover }) {
        super();
        this.appendChild(template.content.cloneNode(true));
        this.name = name;
        this.email = email;
        this.type = type;
        this.artistDescription = artistDescription;
        this.artistType = artistType;
        this.artistPicture = artistPicture || '/public/images/cover-alt.png';
        this.artistCover = artistCover || '/public/images/cover-2-alt.png';
    }

    connectedCallback() {
        this.querySelector('#save-changes').addEventListener('click', async (e) => {
            e.preventDefault();
            const name = this.querySelector('#name').value;
            const newPassword = this.querySelector('#new-password').value;
            const confirmPassword = this.querySelector('#confirm-password').value;

            const changePassword = this.querySelector('#change-password').checked;
            if (this.type === 'user') {
                await this._saveChanges({ name, newPassword, confirmPassword, changePassword });
            } else {
                const description = this.querySelector('#artist-description').value;
                const artistType = this.querySelector('#artist-type').value;
                await this._artistSaveChanges({ name, description, artistType, newPassword, confirmPassword, changePassword });
            }
        });

        this.querySelector('#change-password').addEventListener('change', (e) => {
            const inputElements = this.querySelectorAll('.change-password-input');

            const changePassword = e.target.checked;

            if (changePassword) {
                inputElements.forEach(element => element.style.display = '');

            } else {
                inputElements.forEach(element => element.style.display = 'none');
            }
        });
        this.querySelector('#add-album-button').addEventListener('click', (e) => {
           window.history.pushState({}, '', '/singstereo/new-album'); 
        });


        this.querySelector('#artist-picture-clickable').addEventListener('click', (e) => {
            this.querySelector('#artist-picture-input').click();
        });

        this.querySelector('#artist-cover-clickable').addEventListener('click', (e) => {
            this.querySelector('#artist-cover-input').click();
        });

        this.querySelector('#artist-picture-input').addEventListener('change', (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = async (e) => {
                this.querySelector('#artist-picture').src = e.target.result;
                
                try {
                    await uploadArtistPicture(file);
                } catch (e) {
                    alert('Cannot upload picture');
                }
            };
            reader.readAsDataURL(file);
        });

        this.querySelector('#artist-cover-input').addEventListener('change', (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = async (e) => {
                this.querySelector('#artist-cover').src = e.target.result;

                try {
                    await uploadArtistCover(file);
                } catch (e) {
                    alert('Cannot upload picture');
                }
            };
            reader.readAsDataURL(file);
        });


        this.render();
    }

    async _saveChanges({ name, newPassword, confirmPassword, changePassword }) {
        if (changePassword && newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        } else if (!changePassword) {
            newPassword = undefined;
            confirmPassword = undefined;
        }
        try {
            await editUser({ name, password: newPassword });
            alert('Changes saved');
        } catch (e) {
            alert('Cannot update user, error(s): ' + JSON.stringify(e.errors));
        }
    }

    async _artistSaveChanges({ name, description, artistType, newPassword, confirmPassword, changePassword }) {
        if (changePassword && newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        } else if (!changePassword) {
            newPassword = undefined;
            confirmPassword = undefined;
        }
        try {
            await editArtist({ name, description, artistType, password: newPassword });
            alert('Changes saved');
        } catch (e) {
            alert('Cannot update user, error(s): ' + JSON.stringify(e.errors));
        }
    }

    render() {
        this.querySelector('#name').value = this.name;
        this.querySelector('#email').value = this.email;
        if (this.type === 'artist') {
            this.querySelector('#artist-description-container').style.display = '';
            this.querySelector('#my-account-header').innerText = 'My Account (Artist)';
            this.querySelector('#artist-description').value = this.artistDescription;
            this.querySelector('#artist-type').value = this.artistType;
            this.querySelector('#add-album-button').style.display = '';
            this.querySelector('#artist-pictures').classList.remove('d-none');
            this.querySelector('#artist-picture').src = this.artistPicture;
            this.querySelector('#artist-cover').src = this.artistCover;
        }
    }

    disconnectedCallback() {
    }
}

window.customElements.define('my-account', MyAccount);

export default MyAccount;