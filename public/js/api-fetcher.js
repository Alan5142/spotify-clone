
function isOk(status) {
    return status >= 200 && status < 300;
}

class ApiError extends Error {
    constructor(object) {
        super(JSON.stringify(object));
        this.errors = object.errors || [object.error];
    }
}

/**
    Fetch era tan bueno hasta que llego fetch 2

    @param {RequestInfo} url
    @param {RequestInit} params
*/
async function fetchDOS(url, params) {
    const res = await fetch(url, 
    {
        ...params,
        body: JSON.stringify(params.body),
        headers: {
            ...params.headers,
            'Content-Type': 'application/json',
        }
    });
    const jsonResponse = await res.json();
    if (!isOk(res.status)) {
        throw new ApiError(jsonResponse);
    }
    return jsonResponse;
}

/**
    Tan bueno como fetch2 pero con autenticación
    @param {RequestInfo} url
    @param {RequestInit} params
*/
async function fetchDosWithAuth(url, params) {
    return await fetchDOS(url, {
        ...params,
        headers: {
            ...params.headers,
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
}

export async function requestLogin({email, password}) {
    return await fetchDOS('/api/login', 
    {
        method: "POST",
        body: {
            email,
            password
        }
    });
}

export async function requestSignUp({name, email, password}) {
    return await fetchDOS('/api/user', 
    {
        method: "POST",
        body: {
            name: name,
            email: email,
            password: password
        }
    });
}

export async function getArtistById(id) {
    return await fetchDosWithAuth(`/api/artist/${id}`, {
        method: "GET",
    });
}

export async function getAlbumById(artistId, albumId) {
    return await fetchDosWithAuth(`/api/artist/${artistId}/album/${albumId}`, {
        method: "GET",
    });
}

export async function getMyInfo() {
    return await fetchDosWithAuth('/api/user', {
        method: "GET",
    });
}

export async function getMyArtistInfo() {
    return await fetchDosWithAuth('/api/artist', {
        method: "GET",
    });
}

export async function editUser({name, password}) {
    return await fetchDosWithAuth('/api/user', {
        method: "PUT",
        body: {
            name,
            password,
        }
    });
}

export async function editArtist({name, description, password, artistType}) {
    return await fetchDosWithAuth('/api/artist', {
        method: "PUT",
        body: {
            name,
            description,
            password,
            artistType,
        }
    });
}

export function createAlbum({name, releaseDate, artistId, genres, cover, tracks, trackList}, progressCallback) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('releaseDate', releaseDate);
    formData.append('cover', cover);
    formData.append('tracks', tracks);

    for (const track of trackList) {
        formData.append('trackFiles', track);
    }
    
    genres.forEach(genre => {
        formData.append('genres', genre);
    });

    const request = new XMLHttpRequest();
    request.open('POST', `/api/artist/${artistId}/album`);
    request.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);
    request.upload.onprogress = progressCallback;
    request.send(formData);
    request.onreadystatechange = function() {
        if (request.readyState === 4) {
            if (!isOk(request.status)) {
                throw new ApiError(JSON.parse(request.responseText));
            }
        }
    }

    return new Promise((resolve, reject) => {
        request.onload = resolve;
        request.onerror = reject;
    });
}

