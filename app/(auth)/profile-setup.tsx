import React, { useState, useEffect } from 'react';
import { Text, Button, TextInput } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { updateUserProfile } from '../../src/services/api';
import { ProfileRequest } from '@/src/types/api';
import { useAuth } from '../../src/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileSetupScreen() {
    const router = useRouter();
    const { login } = useAuth();

    const [step, setStep] = useState(1);
    const [profileData, setProfileData] = useState<ProfileRequest>({
        diet_type: 'Normal',
        dietary_restrictions: '',
        preferences: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleNext = async () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            setLoading(true);
            setError(null);

            try {
                const response = await updateUserProfile(profileData);
                console.log('profile data updated:', response);

                // Navigate to the main app
                router.replace('/(tabs)/default');
            } catch (error) {
                console.error('Error updating profile:', error);
                setError('There was an error updating your profile.');
            } finally {
                setLoading(false);
            }
        }
    }

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    }

    return (
        <View style={styles.container}>
            {step === 1 && (
                <View style={styles.stepContainer}>
                    <Text variant='headlineSmall' style={styles.title}>
                        1. Input your diet type
                    </Text>
                    <TextInput
                        label='Diet Type'
                        mode='outlined'
                        placeholder='Omnivore, Vegan, Normal, etc.'
                        value={profileData.diet_type}
                        onChangeText={(text) =>
                            setProfileData((prev) => ({ ...prev, diet_type: text }))
                        }
                        style={styles.input}
                    >
                    </TextInput>
                </View>
            )}

            {step === 2 && (
                <View style={styles.stepContainer}>
                    <Text variant='headlineSmall' style={styles.title}>
                        2. Add Any Dietary Restrictions
                    </Text>
                    <TextInput
                        label='Dietary Restrictions'
                        mode='outlined'
                        placeholder='Lactose intolerant, no gluten, etc.'
                        value={profileData.dietary_restrictions}
                        onChangeText={(text) =>
                            setProfileData((prev) => ({ ...prev, dietary_restrictions: text }))
                        }
                        style={styles.input}
                    >
                    </TextInput>
                </View>
            )}

            {step === 3 && (
                <View style={styles.stepContainer}>
                    <Text variant='headlineSmall' style={styles.title}>
                        3. Do you have any food preferences?
                    </Text>
                    <TextInput
                        label='Food Preferences'
                        mode='outlined'
                        placeholder='Spicy food, low-carb, etc.'
                        value={profileData.preferences}
                        onChangeText={(text) =>
                            setProfileData((prev) => ({ ...prev, preferences: text }))
                        }
                        style={styles.input}
                    >
                    </TextInput>
                </View>
            )}

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <View style={styles.buttonContainer}>
                {step > 1 && (
                    <Button mode="outlined" onPress={handleBack} style={styles.button}>
                        Back
                    </Button>
                )}
                <Button
                    mode="contained"
                    onPress={handleNext}
                    loading={loading}
                    disabled={loading}
                    style={styles.button}
                >
                    {step === 3 ? 'Submit' : 'Next'}
                </Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    stepContainer: {
        marginBottom: 20,
    },
    title: {
        marginBottom: 10,
    },
    input: {
        marginBottom: 10,
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        marginHorizontal: 5,
    },
    welcomeContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    welcomeText: {
        marginBottom: 5,
    },
    subtitleText: {
        textAlign: 'center',
    },
});