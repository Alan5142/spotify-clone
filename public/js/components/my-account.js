import { editUser } from "../api-fetcher.js";

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
</style>
<div class="container">
    <div class="w-100 d-flex justify-content-center">
        <form id="change-account" class="d-flex flex-column my-account-container">
            <h1>My Account</h1>
            <label for="name">Name</label>
            <input type="text" id="name" minlength="1">
            <label for="email">Email: </label>
            <input type="email" disabled id="email">
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
    </div>
</div>
`;

class MyAccount extends HTMLElement {
    constructor({ name, email }) {
        super();
        this.appendChild(template.content.cloneNode(true));
        this.name = name;
        this.email = email;
    }

    connectedCallback() {
        this.render();

        this.querySelector('#save-changes').addEventListener('click', async (e) => {
            e.preventDefault();
            const name = this.querySelector('#name').value;
            const newPassword = this.querySelector('#new-password').value;
            const confirmPassword = this.querySelector('#confirm-password').value;

            const changePassword = this.querySelector('#change-password').checked;
            await this._saveChanges({ name, newPassword, confirmPassword, changePassword });
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
    }

    async _saveChanges({ name, newPassword, confirmPassword, changePassword }) {
        if (changePassword && newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        } else if (!changePassword) {
            console.log('PasswordAA');
            newPassword = undefined;
            confirmPassword = undefined;
        }
        try {
            await editUser({ name, password: newPassword });
            alert('Changes saved');
        } catch (e) {
            console.log(e.errors);
            alert('Cannot update user, error(s): ' + JSON.stringify(e.errors));
        }
    }

    render() {
        this.querySelector('#name').value = this.name;
        this.querySelector('#email').value = this.email;
    }

    disconnectedCallback() {
    }
}

window.customElements.define('my-account', MyAccount);

export default MyAccount;