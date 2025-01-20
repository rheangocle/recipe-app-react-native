import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { registerUser } from '../src/services/api';
import { useRouter } from 'expo-router';

export default function CreateAccountScreen() {
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSignup = async () => {
        try {
            setError(null);

            await registerUser(username, email, password);
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
                value={username}
                onChangeText={setUsername}
                style={{ borderColor: '#ccc', borderWidth: 1, marginBottom: 8 }}
            />
            <TextInput
                placeholder='Email'
                value={email}
                onChangeText={setEmail}
                style={{ borderColor: '#ccc', borderWidth: 1, marginBottom: 8 }}
            />
            <TextInput
                placeholder='Password'
                value={password}
                onChangeText={setPassword}
                style={{ borderColor: '#ccc', borderWidth: 1, marginBottom: 8 }}
            />

            <Button title='Sign Up' onPress={handleSignup} />
        </View>
    )
}