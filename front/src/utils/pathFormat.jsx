export function getPathForImage(imageName) {
    return `/${imageName}`;
}

export function getPathForGame(gameName) {
    if (!gameName) return '';
    return `/games/${gameName}`;
}

export function getPathForAvatar(avatarName) {
    if (!avatarName) {
        return '/avatars/avatar.jpg';
    }
    return `/avatars/${avatarName}`;
}