export const names = {
    user: 'user',
    token: 'access_token'
}

export const getAuthCredentials = () => {
    return isSignedIn ? JSON.parse(localStorage.getItem('user')) : { uid: null };
};

export const setAuthCredentials = (data) => {
    if (data && Object.keys(data).length) {
        localStorage.setItem('user', JSON.stringify(data));
    }
};

export const getStorage = (name) => {
    return localStorage.getItem(name) ?? null;
}

export const setStorage = (name, value) => {
    localStorage.setItem(name, value);
}

export const isSignedIn = Boolean(getStorage('user')) && Boolean(getStorage('access_token'));

export const credentials = isSignedIn ? JSON.parse(getStorage('user')) : {};

export const logout = () => {
    localStorage.removeItem(names.user);
    localStorage.removeItem(names.token);
    window.location.reload();
}

export const showMessage = (message, type = "info", duration = 12000) => {
    const messageContainer = document.querySelector(".message-container") || document.createElement('div');
    messageContainer.classList.add("message-container");
    document.body.appendChild(messageContainer);

    const messageBlock = document.createElement('div');
    messageBlock.classList.add("message-block", type);

    const messageField = document.createElement('p');
    messageField.textContent = message;

    const closeMessage = document.createElement('button');
    closeMessage.classList.add('btn-small');
    closeMessage.textContent = "×";
    closeMessage.addEventListener('click', () => messageBlock.remove());

    messageBlock.appendChild(messageField);
    messageBlock.appendChild(closeMessage);
    messageContainer.appendChild(messageBlock);

    setTimeout(() => messageBlock.remove(), duration);
};

export const colors = [
    "black", "white", "red", "green", "blue", "yellow", "orange", "purple", "pink", "brown",
    "cyan", "gray", "skyblue", "lime", "teal", "navy", "olive", "silver", "maroon", "gold",
    "turquoise", "lavender", "peach"
];

export const categories = [
    "abstract", "vibrant", "aesthetic", "realism", "surrealism", "food", "minimal", "modern",
    "art", "digitalart", "streetart", "meme", "handwork", "sketches", "photography", "painting",
    "illustration", "portrait", "substance", "people", "crowd", "cinema", "fiction", "fantasy",
    "designing", "collage", "3d", "anime", "nature", "landscapes", "technology"
];
