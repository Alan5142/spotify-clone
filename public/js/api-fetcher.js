
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

export async function editUser({name, password}) {
    console.log(name, password);
    return await fetchDosWithAuth('/api/user', {
        method: "PUT",
        body: {
            name,
            password,
        }
    });
}