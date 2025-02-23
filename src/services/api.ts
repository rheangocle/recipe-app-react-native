import axios from 'axios';
import {
    RegisterResponse,
    RegisterRequest,
    ProfileRequest,
    ProfileResponse,
    GoogleSSOResponse,
} from '../types/api';

// const BASE_API_URL = 'http://localhost:8000/api';
const BASE_API_URL = 'http://127.0.0.1:8000'; // For Android emulator

export async function registerUser(
    registerData: RegisterRequest
): Promise<RegisterResponse> {
    try {
        const response = await axios.post<RegisterResponse>(`${BASE_API_URL}/auth/registration/`, registerData);
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
}

export async function handleGoogleSignInCallback(
    token: string
): Promise<GoogleSSOResponse> {
    try {
        const response = await axios.post<GoogleSSOResponse>(`${BASE_API_URL}/auth/google/login/`, {
            access_token: token
        });
        return response.data;
    } catch (error) {
        console.error("Error occurred during Google SSO callback:", error);
        throw error;
    }
}

export async function updateUserProfile(
    profileData: ProfileRequest
): Promise<ProfileResponse> {
    try {
        const response = await axios.post<ProfileResponse>(`${BASE_API_URL}/api/profile/`, profileData);
        return response.data;
      } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
}

