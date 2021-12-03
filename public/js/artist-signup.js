import { requestArtistSignUp } from "./api-fetcher.js";

document.getElementById('artist-sign-up-form').onsubmit = artistSignUp;

export async function artistSignUp(e){
    e.preventDefault();
    const name = document.getElementById('artist-name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const repPassword = document.getElementById('rep-password').value;
    const typeOf = document.getElementById('artist-type').value;
    if(password !== repPassword){
        alert('Las contraseñas deben ser iguales');
        return;
    }
    try{
        await requestArtistSignUp({name, email, password, typeOf});
        alert('Se ha registrado el artista');
        window.location.href = '/login';
    } catch(e){
        e = JSON.parse(e.message);
        if (e.errors) {
            alert(JSON.stringify(e.errors));
        } else {
            alert(e.error);
        }
    }
}

if (localStorage.getItem("token") !== null) {
    window.location.href = "/singstereo";
}