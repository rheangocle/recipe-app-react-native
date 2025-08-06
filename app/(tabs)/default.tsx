import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { 
    Card, 
    Title, 
    Paragraph, 
    Button, 
    FAB, 
    Chip,
    Text,
    Avatar,
    Divider,
    ActivityIndicator
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Recipe, getRecipes, generateRecipe } from '../../src/services/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen() {
    const router = useRouter();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        loadRecipes();
    }, []);

    const loadRecipes = async () => {
        try {
            setLoading(true);
            const fetchedRecipes = await getRecipes();
            setRecipes(fetchedRecipes.slice(0, 5)); // Show only 5 recent recipes
        } catch (error) {
            console.error('Error loading recipes:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadRecipes();
        setRefreshing(false);
    };

    const handleGenerateRecipe = async () => {
        try {
            setGenerating(true);
            const response = await generateRecipe({
                dietary_restrictions: ['low-fodmap'],
                max_prep_time: 30,
                difficulty: 'easy'
            });
            // Navigate to the generated recipe
            router.push(`/recipe/${response.recipe.id}`);
        } catch (error) {
            console.error('Error generating recipe:', error);
        } finally {
            setGenerating(false);
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return '#4CAF50';
            case 'medium': return '#FF9800';
            case 'hard': return '#F44336';
            default: return '#757575';
        }
    };

    const formatTime = (minutes: number) => {
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Loading your recipes...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView 
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Welcome Section */}
                <Card style={styles.welcomeCard}>
                    <Card.Content>
                        <Title style={styles.welcomeTitle}>🍽️ Welcome to FODMAP Recipes</Title>
                        <Paragraph style={styles.welcomeSubtitle}>
                            Discover delicious, gut-friendly recipes tailored to your dietary needs
                        </Paragraph>
                    </Card.Content>
                </Card>

                {/* Quick Actions */}
                <Card style={styles.actionsCard}>
                    <Card.Content>
                        <Title style={styles.sectionTitle}>Quick Actions</Title>
                        <View style={styles.actionButtons}>
                            <Button 
                                mode="contained" 
                                onPress={() => router.push('/generate-recipe')}
                                style={styles.actionButton}
                                icon="magic"
                            >
                                Generate Recipe
                            </Button>
                            <Button 
                                mode="outlined" 
                                onPress={() => router.push('/explore')}
                                style={styles.actionButton}
                                icon="magnify"
                            >
                                Browse Recipes
                            </Button>
                            <Button 
                                mode="outlined" 
                                onPress={() => router.push('/shopping-list')}
                                style={styles.actionButton}
                                icon="cart"
                            >
                                Shopping List
                            </Button>
                        </View>
                    </Card.Content>
                </Card>

                {/* Recent Recipes */}
                <Card style={styles.recipesCard}>
                    <Card.Content>
                        <View style={styles.sectionHeader}>
                            <Title style={styles.sectionTitle}>Recent Recipes</Title>
                            <Button 
                                mode="text" 
                                onPress={() => router.push('/recipes')}
                                compact
                            >
                                View All
                            </Button>
                        </View>
                        
                        {recipes.length === 0 ? (
                            <View style={styles.emptyState}>
                                <MaterialCommunityIcons 
                                    name="food-variant" 
                                    size={48} 
                                    color="#ccc" 
                                />
                                <Text style={styles.emptyText}>No recipes yet</Text>
                                <Text style={styles.emptySubtext}>
                                    Start by generating a recipe or browsing our collection
                                </Text>
                            </View>
                        ) : (
                            recipes.map((recipe) => (
                                <Card 
                                    key={recipe.id} 
                                    style={styles.recipeCard}
                                    onPress={() => router.push(`/recipe/${recipe.id}`)}
                                >
                                    <Card.Content>
                                        <View style={styles.recipeHeader}>
                                            <View style={styles.recipeInfo}>
                                                <Title style={styles.recipeTitle}>
                                                    {recipe.title}
                                                </Title>
                                                <Paragraph style={styles.recipeDescription}>
                                                    {recipe.description}
                                                </Paragraph>
                                            </View>
                                            {recipe.image_url && (
                                                <Avatar.Image 
                                                    size={60} 
                                                    source={{ uri: recipe.image_url }} 
                                                />
                                            )}
                                        </View>
                                        
                                        <View style={styles.recipeMeta}>
                                            <Chip 
                                                icon="clock-outline"
                                                style={styles.metaChip}
                                            >
                                                {formatTime(recipe.prep_time + recipe.cook_time)}
                                            </Chip>
                                            <Chip 
                                                icon="account-group"
                                                style={styles.metaChip}
                                            >
                                                {recipe.servings} servings
                                            </Chip>
                                            <Chip 
                                                icon="star"
                                                style={[
                                                    styles.metaChip,
                                                    { backgroundColor: getDifficultyColor(recipe.difficulty) }
                                                ]}
                                                textStyle={{ color: 'white' }}
                                            >
                                                {recipe.difficulty}
                                            </Chip>
                                            {recipe.is_fodmap_friendly && (
                                                <Chip 
                                                    icon="check-circle"
                                                    style={[styles.metaChip, { backgroundColor: '#4CAF50' }]}
                                                    textStyle={{ color: 'white' }}
                                                >
                                                    FODMAP Safe
                                                </Chip>
                                            )}
                                        </View>
                                    </Card.Content>
                                </Card>
                            ))
                        )}
                    </Card.Content>
                </Card>
            </ScrollView>

            {/* FAB for creating new recipe */}
            <FAB
                style={styles.fab}
                icon="plus"
                onPress={() => router.push('/create-recipe')}
                label="New Recipe"
            />
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    welcomeCard: {
        margin: 16,
        backgroundColor: '#E8F5E8',
    },
    welcomeTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2E7D32',
    },
    welcomeSubtitle: {
        fontSize: 16,
        color: '#388E3C',
        marginTop: 8,
    },
    actionsCard: {
        margin: 16,
        marginTop: 0,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    actionButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        minWidth: 120,
    },
    recipesCard: {
        margin: 16,
        marginTop: 0,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        marginTop: 8,
        paddingHorizontal: 20,
    },
    recipeCard: {
        marginBottom: 12,
        elevation: 2,
    },
    recipeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    recipeInfo: {
        flex: 1,
        marginRight: 12,
    },
    recipeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    recipeDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    recipeMeta: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 12,
    },
    metaChip: {
        backgroundColor: '#f0f0f0',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#4CAF50',
    },
});
