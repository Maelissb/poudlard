

export const fetchMe = async () => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`);



    const response = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
        method: 'GET',
        headers: headers
    });
    if (!response.ok) {

        throw new Error('Failed to fetch nav links');
    }
    const data = await response.json();
    return data;
};
