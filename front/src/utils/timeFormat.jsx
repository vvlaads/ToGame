export function dateTimeToDate(datetime) {
    if (!datetime) return new Date();
    const iso = datetime.replace(" ", "T");
    const date = new Date(iso);
    return date;
}

export function formatMessageTime(datetime) {
    if (!datetime) return "";

    const date = dateTimeToDate(datetime);
    const now = new Date();

    if (isToday(date, now)) {
        return formatTime(date);
    }

    if (isYesterday(date, now)) {
        return `вчера ${formatTime(date)}`;
    }

    if (isSameYear(date, now)) {
        return `${date.getDate()} ${MonthsString[date.getMonth()]}`;
    }

    return `${date.getDate()} ${MonthsString[date.getMonth()]} ${date.getFullYear()}`;
}


function isToday(date, now = new Date()) {
    return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate()
    );
}

function isYesterday(date, now = new Date()) {
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    return (
        date.getFullYear() === yesterday.getFullYear() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getDate() === yesterday.getDate()
    );
}

function isSameYear(date, now = new Date()) {
    return date.getFullYear() === now.getFullYear();
}

function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
}

const MonthsString = {
    0: 'января',
    1: 'февраля',
    2: 'марта',
    3: 'апреля',
    4: 'мая',
    5: 'июня',
    6: 'июля',
    7: 'августа',
    8: 'сентября',
    9: 'октября',
    10: 'ноября',
    11: 'декабря'
};

