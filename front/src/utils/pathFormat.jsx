const BASE_URL = `/ToGame-back-1.0-SNAPSHOT`

export function getPathForBanner(bannerFilepath) {
    if (!bannerFilepath) {
        return `${BASE_URL}/banners/banner.jpg`;
    }
    return `${BASE_URL}/banners/${bannerFilepath}`;
}

export function getPathForGame(gameFilepath) {
    if (!gameFilepath) {
        return `${BASE_URL}/games/no_game.jpg`;
    }
    return `${BASE_URL}/games/${gameFilepath}`;
}

export function getPathForAvatar(avatarFilepath) {
    if (!avatarFilepath) {
        return `${BASE_URL}/avatars/avatar.jpg`;
    }
    return `${BASE_URL}/avatars/${avatarFilepath}`;
}

export function getPathForChat(chatFilepath) {
    if (!chatFilepath) {
        return `${BASE_URL}/vite.svg`
    };
    return `${BASE_URL}/chats/${chatFilepath}`;
}