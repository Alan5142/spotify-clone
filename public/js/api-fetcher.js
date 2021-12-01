
function isOk(status) {
    return status >= 200 && status < 300;
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
        throw new Error(JSON.stringify(jsonResponse));
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