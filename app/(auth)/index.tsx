// app/index.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { registerUser, handleGoogleSignInCallback } from '../../src/services/api';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

export default function CreateAccountScreen() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password1: '',
        password2: '',
    });
    const [error, setError] = useState<string | null>(null);

    const {
        androidGoogleClientId,
        iosGoogleClientId,
        webGoogleClientId,
    } = Constants.expoConfig?.extra || {};

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: androidGoogleClientId,
        iosClientId: iosGoogleClientId,
        webClientId: webGoogleClientId,
        clientId: webGoogleClientId,
    });

    useEffect(() => {
        async function handleGoogleSignIn() {
            if (!response) return;

            if (response.type !== 'success') {
                console.error('Google sign-in not successful:', error);
                return;
            }

            const token = response.authentication?.accessToken;
            if (!token) {
                return;
            }

            try {
                const userData = await handleGoogleSignInCallback(token);
                console.log("Google sso success");
                router.replace('/(tabs)');
            } catch (error) {
                setError('Google Sign-in failed. Please try again.');
            }
        }
        handleGoogleSignIn();
    }, [response]);

    const handleSignup = async () => {
        try {
            setError(null);

            const response = await registerUser(formData);
            if (response) {
                router.replace('/(tabs)');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data || 'Error creating account');
        }
    };

    return (
        <View style={{ padding: 16 }}>
            <Text>Create Account</Text>
            {error && <Text style={{ color: 'red' }}>{JSON.stringify(error)}</Text>}
            <TextInput
                placeholder='Username'
                value={formData.username}
                onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, username: text }))
                }
                style={{ borderColor: '#ccc', borderWidth: 1, marginBottom: 8 }}
            />
            <TextInput
                placeholder='Email'
                value={formData.email}
                onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, email: text }))
                }
                style={{ borderColor: '#ccc', borderWidth: 1, marginBottom: 8 }}
            />
            <TextInput
                placeholder='Password'
                value={formData.password1}
                onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, password1: text }))
                }
                secureTextEntry
                style={{ borderColor: '#ccc', borderWidth: 1, marginBottom: 8 }}
            />
            <TextInput
                placeholder='Re-enter your password'
                value={formData.password2}
                onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, password2: text }))
                }
                secureTextEntry
                style={{ borderColor: '#ccc', borderWidth: 1, marginBottom: 8 }}
            />

            <Button title='Sign Up' onPress={handleSignup} />

            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
                <View style={{ flex: 1, height: 1, backgroundColor: '#ccc' }} />
                <Text style={{ marginHorizontal: 10 }}>OR</Text>
                <View style={{ flex: 1, height: 1, backgroundColor: '#ccc' }} />
            </View>

            <TouchableOpacity
                style={{
                    backgroundColor: '#4285F4',
                    padding: 14,
                    borderRadius: 8,
                    alignItems: 'center',
                }}
                onPress={() => promptAsync()}
                disabled={!request}
            >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                    Sign in with Google
                </Text>
            </TouchableOpacity>
        </View>
    );
}
