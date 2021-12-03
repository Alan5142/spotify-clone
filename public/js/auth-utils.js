
export function getUserType() {
    const token = localStorage.getItem('token');
    if (token) {
        const splitted = token.split('.');
        const payload = JSON.parse(window.atob(splitted[1]));
        return payload.userType;
    }
    return 'none';
}

export function getUserId() {
    const token = localStorage.getItem('token');
    if (token) {
        const splitted = token.split('.');
        const payload = JSON.parse(window.atob(splitted[1]));
        return payload.id;
    }
    return 'none';
}

export function getUserName() {
    const token = localStorage.getItem('token');
    if (token) {
        const splitted = token.split('.');
        const payload = JSON.parse(window.atob(splitted[1]));
        return payload.name;
    }
    return '{No Name}';
}
