export function getPathForImage(imageName) {
    return `./public/${imageName}`;
}

export function getPathForGame(gameName) {
    if (!gameName) return '';
    return `/games/${gameName}`;
}