type Endpoint = `/${string}`;

export default async function fetchData<T>(endpoint: Endpoint, token?: string | null): Promise<T> {
    const headers = new Headers();
    if (token) {
        headers.append('Authorization', `Bearer ${token}`);
    }
    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        headers,
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error(response.statusText)
    }
    return await response.json() as T;
}