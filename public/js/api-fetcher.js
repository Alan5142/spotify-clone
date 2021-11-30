
function isOk(status) {
    return status >= 200 && status < 300;
}


/*
    Fetch era tan bueno hasta que llego fetch 2
*/
async function fetchDOS(url, params) {
    const res = await fetch(url, 
    {
        ...params,
        body: JSON.stringify(params.body),
        headers: new Headers({'Content-Type': 'application/json'})
    });
    const jsonResponse = await res.json();
    if (!isOk(res.status)) {
        throw new Error(JSON.stringify(jsonResponse));
    }
    return jsonResponse;
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