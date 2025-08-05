import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { 
    Card, 
    Title, 
    Paragraph, 
    Button, 
    Text,
    Chip
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function GenerateTabScreen() {
    const router = useRouter();

    const quickOptions = [
        {
            title: 'Quick & Easy',
            description: 'Generate a simple recipe under 30 minutes',
            icon: 'clock-fast',
            color: '#4CAF50',
            params: {
                max_prep_time: 30,
                difficulty: 'easy',
                preferences: ['quick-meals']
            }
        },
        {
            title: 'FODMAP Safe',
            description: 'Create a gut-friendly low-FODMAP recipe',
            icon: 'leaf',
            color: '#8BC34A',
            params: {
                dietary_restrictions: ['low-fodmap'],
                difficulty: 'easy'
            }
        },
        {
            title: 'Budget Friendly',
            description: 'Generate an affordable recipe',
            icon: 'wallet',
            color: '#FF9800',
            params: {
                preferences: ['budget-friendly'],
                difficulty: 'easy'
            }
        },
        {
            title: 'High Protein',
            description: 'Create a protein-rich meal',
            icon: 'dumbbell',
            color: '#2196F3',
            params: {
                preferences: ['high-protein']
            }
        }
    ];

    const handleQuickGenerate = (params: any) => {
        // Navigate to generate screen with pre-filled parameters
        router.push({
            pathname: '/generate-recipe',
            params: params
        });
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Header */}
                <Card style={styles.headerCard}>
                    <Card.Content>
                        <Title style={styles.headerTitle}>🤖 AI Recipe Generator</Title>
                        <Paragraph style={styles.headerSubtitle}>
                            Create personalized recipes with our AI assistant
                        </Paragraph>
                    </Card.Content>
                </Card>

                {/* Quick Options */}
                <Card style={styles.sectionCard}>
                    <Card.Content>
                        <Title style={styles.sectionTitle}>Quick Generate</Title>
                        <Paragraph style={styles.sectionSubtitle}>
                            Choose a preset to quickly generate a recipe
                        </Paragraph>
                        
                        <View style={styles.quickOptions}>
                            {quickOptions.map((option, index) => (
                                <Card 
                                    key={index} 
                                    style={styles.quickOptionCard}
                                    onPress={() => handleQuickGenerate(option.params)}
                                >
                                    <Card.Content style={styles.quickOptionContent}>
                                        <View style={styles.quickOptionHeader}>
                                            <MaterialCommunityIcons 
                                                name={option.icon as any} 
                                                size={32} 
                                                color={option.color} 
                                            />
                                            <Title style={styles.quickOptionTitle}>
                                                {option.title}
                                            </Title>
                                        </View>
                                        <Paragraph style={styles.quickOptionDescription}>
                                            {option.description}
                                        </Paragraph>
                                    </Card.Content>
                                </Card>
                            ))}
                        </View>
                    </Card.Content>
                </Card>

                {/* Custom Generate */}
                <Card style={styles.sectionCard}>
                    <Card.Content>
                        <Title style={styles.sectionTitle}>Custom Recipe</Title>
                        <Paragraph style={styles.sectionSubtitle}>
                            Create a fully customized recipe with your preferences
                        </Paragraph>
                        
                        <Button 
                            mode="contained" 
                            onPress={() => router.push('/generate-recipe')}
                            style={styles.customButton}
                            icon="tune"
                        >
                            Customize Recipe
                        </Button>
                    </Card.Content>
                </Card>

                {/* Features */}
                <Card style={styles.sectionCard}>
                    <Card.Content>
                        <Title style={styles.sectionTitle}>What Our AI Can Do</Title>
                        
                        <View style={styles.featuresList}>
                            <View style={styles.featureItem}>
                                <MaterialCommunityIcons name="brain" size={24} color="#4CAF50" />
                                <View style={styles.featureText}>
                                    <Text style={styles.featureTitle}>Smart Suggestions</Text>
                                    <Text style={styles.featureDescription}>
                                        AI analyzes your preferences and dietary needs
                                    </Text>
                                </View>
                            </View>
                            
                            <View style={styles.featureItem}>
                                <MaterialCommunityIcons name="food-apple" size={24} color="#4CAF50" />
                                <View style={styles.featureText}>
                                    <Text style={styles.featureTitle}>FODMAP Aware</Text>
                                    <Text style={styles.featureDescription}>
                                        Automatically considers FODMAP levels in ingredients
                                    </Text>
                                </View>
                            </View>
                            
                            <View style={styles.featureItem}>
                                <MaterialCommunityIcons name="clock-outline" size={24} color="#4CAF50" />
                                <View style={styles.featureText}>
                                    <Text style={styles.featureTitle}>Time Conscious</Text>
                                    <Text style={styles.featureDescription}>
                                        Generates recipes that fit your schedule
                                    </Text>
                                </View>
                            </View>
                            
                            <View style={styles.featureItem}>
                                <MaterialCommunityIcons name="account-group" size={24} color="#4CAF50" />
                                <View style={styles.featureText}>
                                    <Text style={styles.featureTitle}>Personalized</Text>
                                    <Text style={styles.featureDescription}>
                                        Adapts to your taste preferences and restrictions
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flex: 1,
    },
    headerCard: {
        margin: 16,
        backgroundColor: '#E3F2FD',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1976D2',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#1565C0',
        marginTop: 8,
    },
    sectionCard: {
        margin: 16,
        marginTop: 0,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    quickOptions: {
        gap: 12,
    },
    quickOptionCard: {
        marginBottom: 8,
        elevation: 2,
    },
    quickOptionContent: {
        paddingVertical: 8,
    },
    quickOptionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    quickOptionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 12,
        flex: 1,
    },
    quickOptionDescription: {
        fontSize: 14,
        color: '#666',
        marginLeft: 44,
    },
    customButton: {
        backgroundColor: '#4CAF50',
        marginTop: 8,
    },
    featuresList: {
        gap: 16,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    featureText: {
        flex: 1,
        marginLeft: 12,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    featureDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
}); 