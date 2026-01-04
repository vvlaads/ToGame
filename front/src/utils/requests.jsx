// Отправка GET запроса
export async function getRequest(url) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include' // Для cookie
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('GET request failed:', error);
        throw error;
    }
}

// Отправка POST запроса
export async function postRequest(url, body = null) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            credentials: 'include' // Для cookie
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Проверяем, есть ли тело ответа
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            return null; // Пустой ответ
        }
    } catch (error) {
        console.error('POST request failed:', error);
        throw error;
    }
}

// Отправка DELETE запроса
export async function deleteRequest(url, body = null) {
    try {
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include' // Для cookie
        };

        // Если есть тело запроса, добавляем его
        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Проверяем, есть ли тело ответа
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            return null; // Пустой ответ
        }
    } catch (error) {
        console.error('DELETE request failed:', error);
        throw error;
    }
}

// Отправка PATCH запроса
export async function patchRequest(url, body = null) {
    try {
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Для cookie
        };

        // Если есть тело запроса, добавляем его
        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Проверяем, есть ли тело ответа
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            return null; // Пустой ответ
        }
    } catch (error) {
        console.error('PATCH request failed:', error);
        throw error;
    }
}

