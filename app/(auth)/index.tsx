// app/index.tsx
import React, { useEffect, useState } from 'react';
import { Provider as PaperProvider, Text, Button } from 'react-native-paper';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { registerUser, handleGoogleSignInCallback } from '../../src/services/api';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
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

    const redirectUri = AuthSession.makeRedirectUri({
        useProxy: true,
    } as any);

    console.log('Redirect URI:', redirectUri);

    const {
        androidGoogleClientId,
        iosGoogleClientId,
        webGoogleClientId,
    } = Constants.expoConfig?.extra || {};

    const [request, response, promptAsync] = Google.useAuthRequest(
        {
            androidClientId: androidGoogleClientId,
            iosClientId: iosGoogleClientId,
            webClientId: webGoogleClientId,
            redirectUri: AuthSession.makeRedirectUri({
                scheme: 'myapp'
            }),
            scopes: ['profile', 'email']
        }
    );

    useEffect(() => {
        async function handleGoogleSignIn() {
            if (!response) return;

            if (response.type !== 'success') {
                console.error('Google sign-in not successful:', error);
                return;
            }

            const token = response.authentication?.accessToken;
            if (!token) {
                console.error('Google sign-in issue with token:', error);
                return;
            }

            try {
                const userData = await handleGoogleSignInCallback(token);
                console.log("Google sso success", userData);
                router.replace('/(auth)/profile-setup');
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
                router.replace('/(auth)/profile-setup');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data || 'Error creating account');
        }
    };

    return (
        <PaperProvider>
            <View style={styles.container}>
                <Text
                    variant="headlineMedium"
                    style={styles.title}
                >
                    Create Account
                </Text>
                {error && (
                    <Text style={styles.error}>
                        {typeof error === 'string' ? error : JSON.stringify(error)}
                    </Text>
                )}
                <TextInput
                    placeholder='Username'
                    value={formData.username}
                    onChangeText={(text) =>
                        setFormData((prev) => ({ ...prev, username: text }))
                    }
                    style={styles.input}
                />
                <TextInput
                    placeholder='Email'
                    value={formData.email}
                    onChangeText={(text) =>
                        setFormData((prev) => ({ ...prev, email: text }))
                    }
                    style={styles.input}
                />
                <TextInput
                    placeholder='Password'
                    value={formData.password1}
                    onChangeText={(text) =>
                        setFormData((prev) => ({ ...prev, password1: text }))
                    }
                    secureTextEntry
                    style={styles.input}
                />
                <TextInput
                    placeholder='Re-enter your password'
                    value={formData.password2}
                    onChangeText={(text) =>
                        setFormData((prev) => ({ ...prev, password2: text }))
                    }
                    secureTextEntry
                    style={styles.input}
                />

                <Button 
                mode='contained' 
                onPress={handleSignup}
                style={styles.button}
                >
                    Sign Up
                </Button>

                <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>OR</Text>
                    <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity
                    style={styles.googleButton}
                    onPress={() => promptAsync()}
                    disabled={!request}
                >
                    <Text style={styles.googleButtonText}>
                        Sign in with Google
                    </Text>
                </TouchableOpacity>

                <Button
                    mode="text"
                    onPress={() => router.push('/(auth)/login')}
                    style={styles.linkButton}
                >
                    Already have an account? Login
                </Button>
            </View>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    title: {
        textAlign: 'center',
        marginBottom: 24,
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 16,
        padding: 8,
        backgroundColor: '#ffebee',
        borderRadius: 4,
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 12,
        padding: 12,
        borderRadius: 4,
    },
    button: {
        marginBottom: 16,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#ccc',
    },
    dividerText: {
        marginHorizontal: 10,
        color: '#666',
    },
    googleButton: {
        backgroundColor: '#4285F4',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    googleButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    linkButton: {
        marginTop: 8,
    },
});