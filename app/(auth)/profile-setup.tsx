import React, { useState, useEffect } from 'react';
import { Text, Button, Chip, TextInput, Card } from 'react-native-paper';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { updateUserProfile, getDietTypes, getDietaryRestrictions } from '../../src/services/api';
import { ProfileRequest, DietType, DietaryRestriction } from '@/src/types/api';
import { useAuth } from '../../src/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileSetupScreen() {
    const router = useRouter();
    const { login } = useAuth();

    const [step, setStep] = useState(1);
    const [profileData, setProfileData] = useState<ProfileRequest>({
        diet_type_ids: [],
        dietary_restriction_ids: []
    });

    const [dietTypes, setDietTypes] = useState<DietType[]>([]);
    const [dietaryRestrictions, setDietaryRestrictions] = useState<DietaryRestriction[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [dataLoading, setDataLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setDataLoading(true);
                const [dietTypesData, dietaryRestrictionsData] = await Promise.all([
                    getDietTypes(),
                    getDietaryRestrictions()
                ]);
                setDietTypes(dietTypesData);
                setDietaryRestrictions(dietaryRestrictionsData);
            } catch (error) {
                console.error('Error fetching profile setup data:', error);
                setError('There was an error getting diet options. Please try again.');
            } finally {
                setDataLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDietTypeToggle = (dietTypeId: number) => {
        setProfileData(prev => {
            const currentIds = prev.diet_type_ids;
            if (currentIds.includes(dietTypeId)) {
                return {
                    ...prev,
                    diet_type_ids: currentIds.filter(id => id !== dietTypeId)
                };
            } else {
                if (currentIds.length >= 3) {
                    Alert.alert('You can only select up to 3 diet types');
                    return prev;
                }
                return {
                    ...prev,
                    diet_type_ids: [...currentIds, dietTypeId]
                };
            }
        });
    };

    const handleDietaryRestrictionToggle = (dietaryRestrictionId: number) => {
        setProfileData(prev => {
            const currentIds = prev.dietary_restriction_ids;
            if (currentIds.includes(dietaryRestrictionId)) {
                return {
                    ...prev,
                    dietary_restriction_ids: currentIds.filter(id => id !== dietaryRestrictionId)
                };
            } else {
                if (currentIds.length >= 4) {
                    Alert.alert('You can only select up to 4 dietary restrictions');
                    return prev;
                }
                return {
                    ...prev,
                    dietary_restriction_ids: [...currentIds, dietaryRestrictionId]
                };
            }
        });
    };

    const handleNext = async () => {
        if (step < 2) {
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

    const canProceed = () => {
        switch (step) {
            case 1:
                return profileData.diet_type_ids.length > 0;
            case 2:
                return true;
            default:
                return false;
        }
    }

    if (dataLoading) {
        return (
            <View style={styles.container}>
                <Text variant="headlineSmall">Loading diet options...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {step === 1 && (
                <View style={styles.stepContainer}>
                    <Text variant='headlineSmall' style={styles.title}>
                        1. Select Your Diet Type(s)
                    </Text>
                    <Text variant='bodyMedium' style={styles.subtitle}>
                        Choose up to 3 diet types that best describe your eating habits.
                    </Text>
                    <View style={styles.chipContainer}>
                        {dietTypes.map((dietType) => (
                            <Chip
                                key={dietType.id}
                                selected={profileData.diet_type_ids.includes(dietType.id)}
                                onPress={() => handleDietTypeToggle(dietType.id)}
                                style={styles.chip}
                                mode='outlined'
                            >
                                {dietType.name}
                            </Chip>
                        ))}
                    </View>

                    {profileData.diet_type_ids.length > 0 && (
                        <Card style={styles.selectedCard}>
                            <Card.Content>
                                <Text variant='titleMedium'>
                                    Selected Diet Types:
                                </Text>
                                {profileData.diet_type_ids.map(id => {
                                    const dietType = dietTypes.find(type => type.id === id);
                                    return (
                                        <Text
                                            key={id}
                                            variant='bodyMedium'
                                            style={styles.selectedItem}
                                        >
                                            • {dietType?.name}: {dietType?.description}
                                        </Text>
                                    )
                                })}
                            </Card.Content>
                        </Card>
                    )}
                </View>
            )}

            {step === 2 && (
                <View style={styles.stepContainer}>
                    <Text variant='headlineSmall' style={styles.title}>
                        2. Select Your Dietary Restrictions
                    </Text>
                    <Text variant='bodyMedium' style={styles.subtitle}>
                        Choose any dietary restrictions or allergies (optional, up to 4).
                    </Text>
                    <View style={styles.chipContainer}>
                        {dietaryRestrictions.map((dietaryRestriction) => (
                            <Chip
                                key={dietaryRestriction.id}
                                selected={profileData.dietary_restriction_ids.includes(dietaryRestriction.id)}
                                onPress={() => handleDietaryRestrictionToggle(dietaryRestriction.id)}
                                style={styles.chip}
                                mode='outlined'
                            >
                                {dietaryRestriction.name}
                            </Chip>
                        ))}
                    </View>

                    {profileData.dietary_restriction_ids.length > 0 && (
                        <Card style={styles.selectedCard}>
                            <Card.Content>
                                <Text variant='titleMedium'>
                                    Selected Dietary Restrictions:
                                </Text>
                                {profileData.dietary_restriction_ids.map(id => {
                                    const dietaryRestriction = dietaryRestrictions.find(r => r.id === id);
                                    return (
                                        <Text
                                            key={id}
                                            variant='bodyMedium'
                                            style={styles.selectedItem}
                                        >
                                            • {dietaryRestriction?.name}: {dietaryRestriction?.description}
                                        </Text>
                                    )
                                })}
                            </Card.Content>
                        </Card>
                    )}
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
                    disabled={loading || !canProceed()}
                    style={styles.button}
                >
                    {step === 2 ? 'Submit' : 'Next'}
                </Button>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    stepContainer: {
        marginBottom: 30,
    },
    title: {
        marginBottom: 10,
    },
    input: {
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        marginBottom: 20,
        textAlign: 'center',
        opacity: 0.7,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 20,
    },
    chip: {
        margin: 5,
    },
    selectedCard: {
        marginTop: 10,
        backgroundColor: '#f0f8ff',
    },
    selectedItem: {
        marginTop: 5,
        marginLeft: 10,
    },
    error: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        flex: 1,
    },
});