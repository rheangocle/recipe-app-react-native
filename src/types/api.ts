
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

export interface DietType {
    id: number;
    name: string;
    description: string;
}

export interface DietaryRestriction {
    id: number;
    name: string;
    description: string;
}

export interface Category {
    id: number;
    name: string;
    description?: string;
}

export interface Unit {
    id: number;
    name: string;
    unit_type: 'weight' | 'volume' | 'count';
}

export interface FodmapCategory {
    id: number;
    name: string;
    description?: string;
}

export interface FoodPreference {
    id: number;
    ingredient: Ingredient;
    ingredient_id?: number;
    preference: 'like' | 'dislike' | 'neutral' | 'allergic';
}

export interface ProfileRequest {
    diet_type_ids: number[];
    dietary_restriction_ids: number[];
}

export interface ProfileResponse {
    id: number;
    user: number;
    diet_types: DietType[];
    dietary_restrictions: DietaryRestriction[];
    food_preferences: FoodPreference[];
    created_at: string;
    updated_at: string;
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
    total_time: number;
    servings: number;
    cuisine?: string;
    image?: string;
    fodmap_friendly: boolean;
    fodmap_notes?: string;
    created_by?: number;
    created_at: string;
    updated_at: string;
    ingredients_detail: RecipeIngredient[];
    tags: Tag[];
    tag_ids?: number[];
}

export interface RecipeIngredient {
    id: number;
    ingredient: Ingredient;
    quantity: string;
    unit: Unit | null;
    notes?: string;
}

export interface Ingredient {
    id: number;
    name: string;
    category: Category | null;
    default_unit: Unit | null;
    fodmap_category: FodmapCategory | null;
    nutritional_info?: any;
}

export interface Tag {
    id: number;
    name: string;
    description?: string;
}

export interface UserProfile {
    id: number;
    user: number;
    diet_types: DietType[];
    dietary_restrictions: DietaryRestriction[];
    food_preferences: FoodPreference[];
    created_at: string;
    updated_at: string;
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