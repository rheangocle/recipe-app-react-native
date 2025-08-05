import axios from 'axios';
// @ts-ignore
// import {AsyncStorage} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    RegisterResponse,
    RegisterRequest,
    ProfileRequest,
    ProfileResponse,
    GoogleSSOResponse,
    Recipe,
    RecipeGenerationRequest,
    RecipeGenerationResponse,
    UserProfile,
    ShoppingList,
    Ingredient,
    ApiResponse,
} from '../types/api';

// const BASE_API_URL = 'http://10.0.2.2:8000';
const BASE_API_URL = 'http://127.0.0.1:8000'; // For Android emulator

// Create axios instance with default config
const api = axios.create({
    baseURL: BASE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const AUTH_TOKEN_KEY = 'authToken';
// Auth token management
const getAuthToken = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem('authToken');
    } catch (error) {
        console.error('Error getting auth token:', error);
        return null;
    }
};

const setAuthToken = async (token: string): Promise<void> => {
    try {
        await AsyncStorage.setItem('authToken', token);
        console.log('Auth token stored successfully');
    } catch (error) {
        console.error('Error setting auth token:', error);
    }
};

const removeAuthToken = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem('authToken');
    } catch (error) {
        console.error('Error removing auth token:', error);
    }
};

// Helper function to create authenticated request config
const createAuthConfig = async () => {
    const token = await getAuthToken();
    console.log('Auth token:', token ? 'Present' : 'Missing');
    return {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    };
};

// Authentication endpoints
export async function registerUser(
    registerData: RegisterRequest
): Promise<RegisterResponse> {
    try {
        const response = await api.post<RegisterResponse>('/auth/registration/', registerData);
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
        const response = await api.post<GoogleSSOResponse>('/auth/google/login/callback/', {
            access_token: token
        });
        
        // Store the token
        if (response.data.token) {
            await setAuthToken(response.data.token);
        }
        
        return response.data;
    } catch (error) {
        console.error("Error occurred during Google SSO callback:", error);
        throw error;
    }
}

export async function loginUser(
    email: string,
    password: string
): Promise<GoogleSSOResponse> {
    try {
        const response = await api.post<GoogleSSOResponse>('/auth/login/', {
            email,
            password
        });
        
        if (response.data.token) {
            await setAuthToken(response.data.token);
        }
        
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
}

export async function logoutUser(): Promise<void> {
    try {
        const config = await createAuthConfig();
        await api.post('/auth/logout/', {}, config);
        await removeAuthToken();
    } catch (error) {
        console.error('Error logging out:', error);
        await removeAuthToken(); // Remove token even if logout fails
        throw error;
    }
}

// Profile endpoints
export async function updateUserProfile(
    profileData: ProfileRequest
): Promise<ProfileResponse> {
    try {
        const config = await createAuthConfig();
        const response = await api.post<ProfileResponse>('/api/user-profile/', profileData, config);
        return response.data;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
}

export async function getUserProfile(): Promise<UserProfile> {
    try {
        const config = await createAuthConfig();
        const response = await api.get<UserProfile>('/api/user-profile/', config);
        return response.data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
}

// Recipe endpoints
export async function getRecipes(): Promise<Recipe[]> {
    try {
        const config = await createAuthConfig();
        const response = await api.get<Recipe[]>('/api/recipes/', config);
        return response.data;
    } catch (error) {
        console.error('Error fetching recipes:', error);
        throw error;
    }
}

export async function getRecipe(id: number): Promise<Recipe> {
    try {
        const config = await createAuthConfig();
        const response = await api.get<Recipe>(`/api/recipes/${id}/`, config);
        return response.data;
    } catch (error) {
        console.error('Error fetching recipe:', error);
        throw error;
    }
}

export async function createRecipe(recipeData: Partial<Recipe>): Promise<Recipe> {
    try {
        const config = await createAuthConfig();
        const response = await api.post<Recipe>('/api/recipes/', recipeData, config);
        return response.data;
    } catch (error) {
        console.error('Error creating recipe:', error);
        throw error;
    }
}

export async function updateRecipe(id: number, recipeData: Partial<Recipe>): Promise<Recipe> {
    try {
        const config = await createAuthConfig();
        const response = await api.put<Recipe>(`/api/recipes/${id}/`, recipeData, config);
        return response.data;
    } catch (error) {
        console.error('Error updating recipe:', error);
        throw error;
    }
}

export async function deleteRecipe(id: number): Promise<void> {
    try {
        const config = await createAuthConfig();
        await api.delete(`/api/recipes/${id}/`, config);
    } catch (error) {
        console.error('Error deleting recipe:', error);
        throw error;
    }
}

// AI Recipe Generation
export async function generateRecipe(
    request: RecipeGenerationRequest
): Promise<RecipeGenerationResponse> {
    try {
        const config = await createAuthConfig();
        const response = await api.post<RecipeGenerationResponse>('/api/recipes/generate/', request, config);
        return response.data;
    } catch (error) {
        console.error('Error generating recipe:', error);
        throw error;
    }
}

export async function updateRecipeForFodmap(id: number): Promise<Recipe> {
    try {
        const config = await createAuthConfig();
        const response = await api.post<Recipe>(`/api/recipes/${id}/update-fodmap/`, {}, config);
        return response.data;
    } catch (error) {
        console.error('Error updating recipe for FODMAP:', error);
        throw error;
    }
}

// Ingredients endpoints
export async function getIngredients(): Promise<Ingredient[]> {
    try {
        const config = await createAuthConfig();
        const response = await api.get<Ingredient[]>('/api/ingredients/', config);
        return response.data;
    } catch (error) {
        console.error('Error fetching ingredients:', error);
        throw error;
    }
}

export async function searchIngredients(query: string): Promise<Ingredient[]> {
    try {
        const config = await createAuthConfig();
        const response = await api.get<Ingredient[]>(`/api/ingredients/search/?q=${encodeURIComponent(query)}`, config);
        return response.data;
    } catch (error) {
        console.error('Error searching ingredients:', error);
        throw error;
    }
}

// Shopping List endpoints
export async function getShoppingLists(): Promise<ShoppingList[]> {
    try {
        const config = await createAuthConfig();
        const response = await api.get<ShoppingList[]>('/api/shopping-lists/', config);
        return response.data;
    } catch (error) {
        console.error('Error fetching shopping lists:', error);
        throw error;
    }
}

export async function createShoppingListFromRecipe(recipeId: number): Promise<ShoppingList> {
    try {
        const config = await createAuthConfig();
        const response = await api.post<ShoppingList>(`/api/shopping-lists/create-from-recipe/${recipeId}/`, {}, config);
        return response.data;
    } catch (error) {
        console.error('Error creating shopping list:', error);
        throw error;
    }
}

// Utility functions
export const isAuthenticated = async (): Promise<boolean> => {
    try {
        const token = await getAuthToken();
        return !!token;
    } catch (error) {
        console.error('Error checking authentication status:', error);
        return false;
    }
};

export const getAuthHeaders = async () => {
    try {
        const token = await getAuthToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    } catch (error) {
        console.error('Error getting auth headers:', error);
        return {};
    }
};

