# Recipe App - React Native Mobile Frontend

A React Native mobile application designed to help users with IBS and digestive sensitivities find, create, and manage low-FODMAP recipes. This app serves as the mobile frontend for the [FODMAP Recipe App Backend](https://github.com/rheangocle/recipes_app).

## 🍽️ Features

### Core Functionality

- **AI-Powered Recipe Generation**: Generate FODMAP-friendly recipes using LLM integration
- **Recipe Management**: Browse, create, edit, and delete recipes
- **FODMAP Compliance**: Automatic FODMAP-friendly recipe filtering and categorization
- **User Authentication**: Secure login with email/password and Google SSO
- **Personalized Profiles**: Set dietary preferences, restrictions, and food allergies
- **Shopping Lists**: Generate shopping lists from recipes

### Mobile-Specific Features

- **Cross-Platform**: Works on both iOS and Android
- **Offline Support**: Cached data for offline recipe viewing

## 🏗️ Project Structure

```
recipe-app/
├── app/                    # Expo Router app directory
│   ├── (auth)/            # Authentication screens
│   │   ├── login.tsx      # Login screen
│   │   ├── profile-setup.tsx # User profile setup
│   │   └── index.tsx      # Auth landing
│   ├── (tabs)/            # Main app tabs
│   │   ├── default.tsx    # Home/Recipes tab
│   │   ├── explore.tsx    # Recipe discovery
│   │   ├── generate.tsx   # AI recipe generation
│   │   └── settings.tsx   # App settings
│   └── recipe/            # Recipe detail screens
│       └── [id].tsx       # Individual recipe view
├── src/
│   ├── components/        # Reusable UI components
│   ├── contexts/          # React contexts (Auth)
│   ├── services/          # API service layer
│   │   └── api.ts         # Backend API integration
│   └── types/             # TypeScript type definitions
├── components/            # Legacy components
└── assets/               # Images, fonts, and static assets
```

## 🔧 Backend Integration

This app is designed to work with the [FODMAP Recipe App Backend](https://github.com/rheangocle/recipes_app). Ensure your backend is running and accessible at the configured API URL.


### Tech Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **TypeScript**: Type-safe JavaScript
- **React Navigation**: Navigation between screens

---

**Note**: This application is designed specifically for users with IBS and digestive sensitivities. Always consult with healthcare professionals regarding dietary changes.
