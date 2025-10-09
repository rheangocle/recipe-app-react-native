import axios from 'axios';
// @ts-ignore
// import {AsyncStorage} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    RegisterResponse,
    RegisterRequest,
    LoginResponse,
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
    DietType,
    DietaryRestriction,
    Category,
    Unit,
    FodmapCategory,
    FoodPreference,
    Tag,
} from '../types/api';

// Re-export types for convenience
export type {
    RegisterResponse,
    RegisterRequest,
    LoginResponse,
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
    DietType,
    DietaryRestriction,
    Category,
    Unit,
    FodmapCategory,
    FoodPreference,
    Tag,
};

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
    if (token) {
        console.log('Token length:', token.length);
        console.log('Token preview:', token.substring(0, 20) + '...');
    }
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return { headers };
};

// Authentication endpoints
export async function registerUser(
    registerData: RegisterRequest
): Promise<RegisterResponse> {
    try {
        const response = await api.post<RegisterResponse>('/auth/registration/', registerData);
        console.log("Register response:", response.data);

        if (response.data && response.data.access) {
            await setAuthToken(response.data.access);
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
        }

        if ('refresh' in response.data && response.data.refresh) {
            await AsyncStorage.setItem('refreshToken', response.data.refresh);
        }

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
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
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
): Promise<LoginResponse> {
    try {
        console.log("Attempting to login with email:", email);
        const response = await api.post<LoginResponse>('/auth/login/', {
            email,
            password
        });
        console.log("Login response:", response.data);
        
        if (response.data.access) {
            await setAuthToken(response.data.access);
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
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
        // Clear axios default headers
        delete api.defaults.headers.common['Authorization'];
    } catch (error) {
        console.error('Error logging out:', error);
        await removeAuthToken(); // Remove token even if logout fails
        // Clear axios default headers even if logout fails
        delete api.defaults.headers.common['Authorization'];
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

export async function getDietTypes(): Promise<DietType[]> {
    try {
        const response = await api.get<{ results: DietType[] }>('/api/diet-types/');
        return response.data.results || response.data as any;
    } catch (error) {
        console.error('Error fetching diet types:', error);
        throw error;
    }
}

export async function getDietaryRestrictions(): Promise<DietaryRestriction[]> {
    try {
        const response = await api.get<{ results: DietaryRestriction[] }>('/api/dietary-restrictions/');
        return response.data.results || response.data as any;
    } catch (error) {
        console.error('Error fetching dietary restrictions:', error);
        throw error;
    }
}

// Category endpoints
export async function getCategories(): Promise<Category[]> {
    try {
        const response = await api.get<Category[]>('/api/categories/');
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}

// Unit endpoints
export async function getUnits(): Promise<Unit[]> {
    try {
        const response = await api.get<Unit[]>('/api/units/');
        return response.data;
    } catch (error) {
        console.error('Error fetching units:', error);
        throw error;
    }
}

// FODMAP Category endpoints
export async function getFodmapCategories(): Promise<FodmapCategory[]> {
    try {
        const response = await api.get<FodmapCategory[]>('/api/fodmap-categories/');
        return response.data;
    } catch (error) {
        console.error('Error fetching FODMAP categories:', error);
        throw error;
    }
}

// Food Preference endpoints
export async function getFoodPreferences(): Promise<FoodPreference[]> {
    try {
        const config = await createAuthConfig();
        const response = await api.get<FoodPreference[]>('/api/food-preferences/', config);
        return response.data;
    } catch (error) {
        console.error('Error fetching food preferences:', error);
        throw error;
    }
}

export async function createFoodPreference(data: { ingredient_id: number; preference: string }): Promise<FoodPreference> {
    try {
        const config = await createAuthConfig();
        const response = await api.post<FoodPreference>('/api/food-preferences/', data, config);
        return response.data;
    } catch (error) {
        console.error('Error creating food preference:', error);
        throw error;
    }
}

// Initialize axios with stored token
export const initializeAuth = async (): Promise<void> => {
    try {
        const token = await getAuthToken();
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    } catch (error) {
        console.error('Error initializing auth:', error);
    }
};

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

