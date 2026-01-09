export function getPathForBanner(bannerFilepath) {
    if (!bannerFilepath) {
        return '/banners/banner.jpg';
    }
    return `/banners/${bannerFilepath}`;
}

export function getPathForGame(gameFilepath) {
    if (!gameFilepath) {
        return '/games/no_game.jpg';
    }
    return `/games/${gameFilepath}`;
}

export function getPathForAvatar(avatarFilepath) {
    if (!avatarFilepath) {
        return '/avatars/avatar.jpg';
    }
    return `/avatars/${avatarFilepath}`;
}

export function getPathForChat(chatFilepath) {
    if (!chatFilepath) {
        return 'vite.svg'
    };
    return `/chats/${chatFilepath}`;
}