import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Button, TextInput} from 'react-native-paper';
import {useRouter} from 'expo-router';
import {loginUser} from '../../src/services/api';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        try {
            setLoading(true);
            setError('');
            const response = await loginUser(email, password);
            router.replace('/(tabs)/default');
        } catch (err: any) {
            console.error('Login error:', err);
            // Try to extract error message from different possible locations
            const errorMessage = err.response?.data?.detail || 
                               err.response?.data?.message || 
                               err.response?.data?.error ||
                               err.message || 
                               'Login failed';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text variant="headlineMedium" style={styles.title}>Login</Text>

            {error && (
                <Text style={styles.error}>{error}</Text>
            )}

            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                style={styles.input}
                secureTextEntry
            />
            <Button
                mode="contained"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                style={styles.button}
            >
                Login
            </Button>

            <Button
                mode="text"
                onPress={()=> router.push('/(auth)')}
                style={styles.linkButton}
            >
                Don't have an account? Sign up
            </Button>
        </View>       
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 8,
        marginBottom: 16,
    },
    linkButton: {
        marginTop: 8,
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 16,
    },
});