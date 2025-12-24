export function formatTimestamp(timestamp) {
    let formatedString = ``;
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    if (hours < 10) {
        formatedString += `0`;
    }
    formatedString += `${hours}:`;
    if (minutes < 10) {
        formatedString += `0`;
    }
    formatedString += `${minutes}`;

    return formatedString;
}