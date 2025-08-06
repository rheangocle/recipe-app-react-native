
export interface RegisterRequest {
    email: string;
    password: string;
}

export interface RegisterResponse {
    access: string;
    refresh: string;
    id: number;
    email: string
}

export interface LoginResponse {
    access: string;
    refresh: string;
    id: number;
    email: string;
}

export interface ProfileRequest {
    diet_type: string;
    dietary_restrictions: string;
    preferences: string
}

export interface ProfileResponse {
    id: number;
    user: number;
    diet_type: string;
    dietary_restrictions: string;
    preferences: string
}

export interface GoogleSSOResponse {
    token: string;
    user: {
        id: number;
        username: string;
        email: string;
    };
}

// Recipe-related types
export interface Recipe {
    id: number;
    title: string;
    description: string;
    instructions: string;
    prep_time: number;
    cook_time: number;
    servings: number;
    difficulty: 'easy' | 'medium' | 'hard';
    image_url?: string;
    is_fodmap_friendly: boolean;
    fodmap_notes?: string;
    created_by: number;
    created_at: string;
    updated_at: string;
    ingredients: RecipeIngredient[];
    tags: string[];
}

export interface RecipeIngredient {
    id: number;
    ingredient: Ingredient;
    quantity: number;
    unit: string;
    notes?: string;
}

export interface Ingredient {
    id: number;
    name: string;
    category: string;
    fodmap_level: 'low' | 'medium' | 'high';
    fodmap_notes?: string;
}

export interface UserProfile {
    id: number;
    user: number;
    diet_type: string;
    dietary_restrictions: string[];
    preferences: string[];
    liked_ingredients: number[];
    disliked_ingredients: number[];
    allergic_ingredients: number[];
}

export interface RecipeGenerationRequest {
    ingredients?: string[];
    dietary_restrictions?: string[];
    preferences?: string[];
    max_prep_time?: number;
    servings?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
}

export interface RecipeGenerationResponse {
    recipe: Recipe;
    message: string;
}

export interface ShoppingList {
    id: number;
    name: string;
    items: ShoppingListItem[];
    created_at: string;
}

export interface ShoppingListItem {
    id: number;
    ingredient: Ingredient;
    quantity: number;
    unit: string;
    is_checked: boolean;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    error?: string;
}