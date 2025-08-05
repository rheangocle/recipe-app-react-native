import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { 
    Card, 
    Title, 
    Paragraph, 
    Button, 
    Chip,
    Text,
    Avatar,
    Divider,
    ActivityIndicator,
    List,
    IconButton,
    Snackbar
} from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Recipe, getRecipe, createShoppingListFromRecipe } from '../../src/services/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function RecipeDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        if (id) {
            loadRecipe(Number(id));
        }
    }, [id]);

    const loadRecipe = async (recipeId: number) => {
        try {
            setLoading(true);
            const fetchedRecipe = await getRecipe(recipeId);
            setRecipe(fetchedRecipe);
        } catch (error) {
            console.error('Error loading recipe:', error);
            setSnackbarMessage('Error loading recipe');
            setSnackbarVisible(true);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        if (id) {
            setRefreshing(true);
            await loadRecipe(Number(id));
            setRefreshing(false);
        }
    };

    const handleCreateShoppingList = async () => {
        if (!recipe) return;
        
        try {
            await createShoppingListFromRecipe(recipe.id);
            setSnackbarMessage('Shopping list created successfully!');
            setSnackbarVisible(true);
            router.push('/shopping-list');
        } catch (error) {
            console.error('Error creating shopping list:', error);
            setSnackbarMessage('Error creating shopping list');
            setSnackbarVisible(true);
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
        if (minutes < 60) return `${minutes} minutes`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours} hours ${mins} minutes` : `${hours} hours`;
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Loading recipe...</Text>
            </View>
        );
    }

    if (!recipe) {
        return (
            <View style={styles.errorContainer}>
                <MaterialCommunityIcons name="food-off" size={64} color="#ccc" />
                <Text style={styles.errorText}>Recipe not found</Text>
                <Button mode="contained" onPress={() => router.back()}>
                    Go Back
                </Button>
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
                {/* Recipe Header */}
                <Card style={styles.headerCard}>
                    {recipe.image_url && (
                        <Card.Cover source={{ uri: recipe.image_url }} />
                    )}
                    <Card.Content style={styles.headerContent}>
                        <Title style={styles.recipeTitle}>{recipe.title}</Title>
                        <Paragraph style={styles.recipeDescription}>
                            {recipe.description}
                        </Paragraph>
                        
                        <View style={styles.recipeMeta}>
                            <Chip 
                                icon="clock-outline"
                                style={styles.metaChip}
                            >
                                Prep: {formatTime(recipe.prep_time)}
                            </Chip>
                            <Chip 
                                icon="fire"
                                style={styles.metaChip}
                            >
                                Cook: {formatTime(recipe.cook_time)}
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

                        {recipe.fodmap_notes && (
                            <Card style={styles.fodmapCard}>
                                <Card.Content>
                                    <Title style={styles.fodmapTitle}>🍃 FODMAP Notes</Title>
                                    <Paragraph style={styles.fodmapNotes}>
                                        {recipe.fodmap_notes}
                                    </Paragraph>
                                </Card.Content>
                            </Card>
                        )}
                    </Card.Content>
                </Card>

                {/* Action Buttons */}
                <Card style={styles.actionsCard}>
                    <Card.Content>
                        <View style={styles.actionButtons}>
                            <Button 
                                mode="contained" 
                                onPress={handleCreateShoppingList}
                                style={styles.actionButton}
                                icon="cart-plus"
                            >
                                Add to Shopping List
                            </Button>
                            <Button 
                                mode="outlined" 
                                onPress={() => router.push(`/edit-recipe/${recipe.id}`)}
                                style={styles.actionButton}
                                icon="pencil"
                            >
                                Edit Recipe
                            </Button>
                        </View>
                    </Card.Content>
                </Card>

                {/* Ingredients */}
                <Card style={styles.sectionCard}>
                    <Card.Content>
                        <Title style={styles.sectionTitle}>Ingredients</Title>
                        <Divider style={styles.divider} />
                        
                        {recipe.ingredients.map((recipeIngredient, index) => (
                            <List.Item
                                key={recipeIngredient.id}
                                title={`${recipeIngredient.quantity} ${recipeIngredient.unit} ${recipeIngredient.ingredient.name}`}
                                description={recipeIngredient.notes}
                                left={(props) => (
                                    <List.Icon 
                                        {...props} 
                                        icon="circle-small" 
                                        color={getFodmapColor(recipeIngredient.ingredient.fodmap_level)}
                                    />
                                )}
                                right={(props) => (
                                    <Chip 
                                        mode="outlined" 
                                        textStyle={{ fontSize: 10 }}
                                        style={[
                                            styles.fodmapChip,
                                            { borderColor: getFodmapColor(recipeIngredient.ingredient.fodmap_level) }
                                        ]}
                                    >
                                        {recipeIngredient.ingredient.fodmap_level}
                                    </Chip>
                                )}
                                style={styles.ingredientItem}
                            />
                        ))}
                    </Card.Content>
                </Card>

                {/* Instructions */}
                <Card style={styles.sectionCard}>
                    <Card.Content>
                        <Title style={styles.sectionTitle}>Instructions</Title>
                        <Divider style={styles.divider} />
                        
                        <Paragraph style={styles.instructions}>
                            {recipe.instructions}
                        </Paragraph>
                    </Card.Content>
                </Card>

                {/* Tags */}
                {recipe.tags && recipe.tags.length > 0 && (
                    <Card style={styles.sectionCard}>
                        <Card.Content>
                            <Title style={styles.sectionTitle}>Tags</Title>
                            <Divider style={styles.divider} />
                            
                            <View style={styles.tagsContainer}>
                                {recipe.tags.map((tag, index) => (
                                    <Chip 
                                        key={index} 
                                        style={styles.tagChip}
                                        mode="outlined"
                                    >
                                        {tag}
                                    </Chip>
                                ))}
                            </View>
                        </Card.Content>
                    </Card>
                )}
            </ScrollView>

            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
            >
                {snackbarMessage}
            </Snackbar>
        </View>
    );
}

const getFodmapColor = (level: string) => {
    switch (level) {
        case 'low': return '#4CAF50';
        case 'medium': return '#FF9800';
        case 'high': return '#F44336';
        default: return '#757575';
    }
};

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
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        color: '#666',
        marginVertical: 16,
    },
    headerCard: {
        margin: 16,
        marginBottom: 8,
    },
    headerContent: {
        paddingTop: 16,
    },
    recipeTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    recipeDescription: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
        marginBottom: 16,
    },
    recipeMeta: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    metaChip: {
        backgroundColor: '#f0f0f0',
    },
    fodmapCard: {
        backgroundColor: '#E8F5E8',
        marginTop: 8,
    },
    fodmapTitle: {
        fontSize: 18,
        color: '#2E7D32',
        marginBottom: 8,
    },
    fodmapNotes: {
        color: '#388E3C',
        lineHeight: 20,
    },
    actionsCard: {
        margin: 16,
        marginTop: 8,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
    },
    sectionCard: {
        margin: 16,
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    divider: {
        marginBottom: 16,
    },
    ingredientItem: {
        paddingVertical: 4,
    },
    fodmapChip: {
        alignSelf: 'center',
    },
    instructions: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tagChip: {
        marginBottom: 4,
    },
}); 