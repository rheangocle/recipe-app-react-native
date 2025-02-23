import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { registerUser, handleGoogleSignInCallback } from '../../src/services/api';
import { useRouter } from 'expo-router';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';


export default function ProfileSetupScreen() {
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [profileData, setProfileData] = useState([
        diet_type: '',
        dietary_restrictions: '',
        preferences: ''
    ]);
}