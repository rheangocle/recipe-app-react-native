import axios from 'axios';

// const BASE_API_URL = 'http://localhost:8000/api';
const BASE_API_URL = 'http://127.0.0.1:8000'; // For Android emulator

export async function registerUser(
    username: string,
    email: string,
    password1: string,
    password2: string
): Promise<any> {
    const response = await axios.post(`${BASE_API_URL}/auth/registration/`, {
        username,
        email,
        password1,
        password2
    });
    return response.data;
}

export async function handleGoogleSignInCallback(
    token: string
): Promise<any> {
    try {
        const response = await axios.post(`${BASE_API_URL}/auth/google/login/`, {
            access_token: token
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}