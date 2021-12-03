document.getElementById('search-bar').onsubmit = search;

export function search(e){
    e.preventDefault();
    const search = document.getElementById('search-input').value;
    const queryParam = encodeURIComponent(search);
        
    window.history.pushState({}, '', `/singstereo/search?search=${queryParam}`);
}