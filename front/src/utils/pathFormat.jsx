export function getPathForImage(imageName) {
    if (!imageName) return '';
    return `/${imageName}`;
}

export function getPathForGame(gameName) {
    if (!gameName) return '';
    return `/games/${gameName}`;
}