import { requestLogin } from "./api-fetcher.js";

document.getElementById('form-login').onsubmit = login;

export async function login(e){
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    try{
        const token = await requestLogin({email, password});
        localStorage.setItem('token', token.token);
        window.location.href = '/singstereo';
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