
export interface RegisterRequest {
    username: string;
    email: string;
    password1: string;
    password2: string
}


export interface RegisterResponse {
    id: number;
    username: string;
    email: string
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