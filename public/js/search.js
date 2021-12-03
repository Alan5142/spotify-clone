import { searchRequest } from "./api-fetcher.js";

document.getElementById('search-bar').onsubmit = search;

export async function search(e){
    e.preventDefault();
    const search = document.getElementById('search-input').value;
    try{
        await searchRequest(search);
    } catch(e){
        e = JSON.parse(e.message);
        if (e.errors) {
            alert(JSON.stringify(e.errors));
        } else {
            alert(e.error);
        }
    }
}