import { requestSignUp, requestArtistSignUp } from "./api-fetcher.js";

document.getElementById('sign-up-form').onsubmit = signUp;
document.getElementById('artist-sign-up-form').onsubmit = signUp;

export async function signUp(e){
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const repPassword = document.getElementById('rep-password').value;
    if(password !== repPassword){
        alert('Las contraseñas deben ser iguales');
        return;
    }
    try{
        await requestSignUp({name, email, password});
        alert('Se ha registrado el usuario');
    } catch(e){
        e = JSON.parse(e.message);
        if (e.errors) {
            alert(JSON.stringify(e.errors));
        } else {
            alert(e.error);
        }
    }
}

export async function artistSignUp(e){
    e.preventDefault();
    const artistName = document.getElementById('artist-name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const repPassword = document.getElementById('rep-password').value;
    const typeOf = document.getElementById('typeOf').value;
    if(password !== repPassword){
        alert('Las contraseñas deben ser iguales');
        return;
    }
    try{
        await requestArtistSignUp({artistName, email, password, typeOf});
        alert('Se ha registrado el artista');
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