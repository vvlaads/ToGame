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