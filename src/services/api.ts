import axios from 'axios';

// const BASE_API_URL = 'http://localhost:8000/api';
const BASE_API_URL = 'http://127.0.0.1:8000/api'; // For Android emulator

export async function registerUser(
    username: string,
    email: string,
    password: string,
): Promise<any> {
    const response = await axios.post(`${BASE_API_URL}/register/`, {
        username,
        email,
        password
    });
    return response.data;
}