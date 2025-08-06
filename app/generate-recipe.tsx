import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { 
    Card, 
    Title, 
    Paragraph, 
    Button, 
    TextInput,
    Chip,
    Text,
    ActivityIndicator,
    Snackbar,
    List,
    Divider,
    Switch
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { 
    generateRecipe, 
    getIngredients, 
    searchIngredients,
    RecipeGenerationRequest,
    Ingredient 
} from '../src/services/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function GenerateRecipeScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    
    // Form state
    const [formData, setFormData] = useState<RecipeGenerationRequest>({
        ingredients: [],
        dietary_restrictions: ['low-fodmap'],
        preferences: [],
        max_prep_time: 30,
        servings: 4,
        difficulty: 'easy'
    });
    
    // Available options
    const [availableIngredients, setAvailableIngredients] = useState<Ingredient[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Ingredient[]>([]);
    const [showSearchResults, setShowSearchResults] = useState(false);

    const dietaryRestrictions = [
        'low-fodmap', 'gluten-free', 'dairy-free', 'vegetarian', 'vegan', 'nut-free'
    ];

    const preferences = [
        'quick-meals', 'budget-friendly', 'high-protein', 'low-carb', 'kid-friendly', 'meal-prep'
    ];

    const difficulties = ['easy', 'medium', 'hard'];
    const prepTimes = [15, 30, 45, 60, 90];
    const servingSizes = [1, 2, 4, 6, 8];

    useEffect(() => {
        loadIngredients();
    }, []);

    useEffect(() => {
        if (searchQuery.length > 2) {
            searchIngredientsHandler();
        } else {
            setSearchResults([]);
            setShowSearchResults(false);
        }
    }, [searchQuery]);

    const loadIngredients = async () => {
        try {
            const ingredients = await getIngredients();
            setAvailableIngredients(ingredients);
        } catch (error) {
            console.error('Error loading ingredients:', error);
        }
    };

    const searchIngredientsHandler = async () => {
        try {
            const results = await searchIngredients(searchQuery);
            setSearchResults(results);
            setShowSearchResults(true);
        } catch (error) {
            console.error('Error searching ingredients:', error);
        }
    };

    const addIngredient = (ingredient: Ingredient) => {
        if (!formData.ingredients?.includes(ingredient.name)) {
            setFormData(prev => ({
                ...prev,
                ingredients: [...(prev.ingredients || []), ingredient.name]
            }));
        }
        setSearchQuery('');
        setShowSearchResults(false);
    };

    const removeIngredient = (ingredientName: string) => {
        setFormData(prev => ({
            ...prev,
            ingredients: prev.ingredients?.filter(name => name !== ingredientName) || []
        }));
    };

    const toggleDietaryRestriction = (restriction: string) => {
        setFormData(prev => ({
            ...prev,
            dietary_restrictions: prev.dietary_restrictions?.includes(restriction)
                ? prev.dietary_restrictions.filter(r => r !== restriction)
                : [...(prev.dietary_restrictions || []), restriction]
        }));
    };

    const togglePreference = (preference: string) => {
        setFormData(prev => ({
            ...prev,
            preferences: prev.preferences?.includes(preference)
                ? prev.preferences.filter(p => p !== preference)
                : [...(prev.preferences || []), preference]
        }));
    };

    const handleGenerateRecipe = async () => {
        try {
            setGenerating(true);
            const response = await generateRecipe(formData);
            
            setSnackbarMessage('Recipe generated successfully!');
            setSnackbarVisible(true);
            
            // Navigate to the generated recipe
            router.push(`/recipe/${response.recipe.id}`);
        } catch (error) {
            console.error('Error generating recipe:', error);
            setSnackbarMessage('Error generating recipe. Please try again.');
            setSnackbarVisible(true);
        } finally {
            setGenerating(false);
        }
    };

    const getFodmapColor = (level: string) => {
        switch (level) {
            case 'low': return '#4CAF50';
            case 'medium': return '#FF9800';
            case 'high': return '#F44336';
            default: return '#757575';
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <Card style={styles.headerCard}>
                    <Card.Content>
                        <Title style={styles.headerTitle}>🤖 AI Recipe Generator</Title>
                        <Paragraph style={styles.headerSubtitle}>
                            Generate personalized FODMAP-friendly recipes based on your preferences
                        </Paragraph>
                    </Card.Content>
                </Card>

                {/* Ingredients Section */}
                <Card style={styles.sectionCard}>
                    <Card.Content>
                        <Title style={styles.sectionTitle}>Available Ingredients</Title>
                        <Paragraph style={styles.sectionSubtitle}>
                            Add ingredients you have on hand (optional)
                        </Paragraph>
                        
                        <TextInput
                            label="Search ingredients"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            style={styles.searchInput}
                            right={<TextInput.Icon icon="magnify" />}
                        />

                        {showSearchResults && searchResults.length > 0 && (
                            <Card style={styles.searchResultsCard}>
                                <Card.Content>
                                    {searchResults.map((ingredient) => (
                                        <List.Item
                                            key={ingredient.id}
                                            title={ingredient.name}
                                            description={ingredient.category}
                                            left={(props) => (
                                                <List.Icon 
                                                    {...props} 
                                                    icon="circle-small" 
                                                    color={getFodmapColor(ingredient.fodmap_level)}
                                                />
                                            )}
                                            right={(props) => (
                                                <Chip 
                                                    mode="outlined" 
                                                    textStyle={{ fontSize: 10 }}
                                                    style={[
                                                        styles.fodmapChip,
                                                        { borderColor: getFodmapColor(ingredient.fodmap_level) }
                                                    ]}
                                                >
                                                    {ingredient.fodmap_level}
                                                </Chip>
                                            )}
                                            onPress={() => addIngredient(ingredient)}
                                            style={styles.searchResultItem}
                                        />
                                    ))}
                                </Card.Content>
                            </Card>
                        )}

                        {formData.ingredients && formData.ingredients.length > 0 && (
                            <View style={styles.selectedIngredients}>
                                <Text style={styles.selectedTitle}>Selected Ingredients:</Text>
                                <View style={styles.chipContainer}>
                                    {formData.ingredients.map((ingredient, index) => (
                                        <Chip
                                            key={index}
                                            onClose={() => removeIngredient(ingredient)}
                                            style={styles.selectedChip}
                                        >
                                            {ingredient}
                                        </Chip>
                                    ))}
                                </View>
                            </View>
                        )}
                    </Card.Content>
                </Card>

                {/* Dietary Restrictions */}
                <Card style={styles.sectionCard}>
                    <Card.Content>
                        <Title style={styles.sectionTitle}>Dietary Restrictions</Title>
                        <View style={styles.chipContainer}>
                            {dietaryRestrictions.map((restriction) => (
                                <Chip
                                    key={restriction}
                                    selected={formData.dietary_restrictions?.includes(restriction)}
                                    onPress={() => toggleDietaryRestriction(restriction)}
                                    style={styles.optionChip}
                                    mode="outlined"
                                >
                                    {restriction.replace('-', ' ')}
                                </Chip>
                            ))}
                        </View>
                    </Card.Content>
                </Card>

                {/* Preferences */}
                <Card style={styles.sectionCard}>
                    <Card.Content>
                        <Title style={styles.sectionTitle}>Preferences</Title>
                        <View style={styles.chipContainer}>
                            {preferences.map((preference) => (
                                <Chip
                                    key={preference}
                                    selected={formData.preferences?.includes(preference)}
                                    onPress={() => togglePreference(preference)}
                                    style={styles.optionChip}
                                    mode="outlined"
                                >
                                    {preference.replace('-', ' ')}
                                </Chip>
                            ))}
                        </View>
                    </Card.Content>
                </Card>

                {/* Recipe Settings */}
                <Card style={styles.sectionCard}>
                    <Card.Content>
                        <Title style={styles.sectionTitle}>Recipe Settings</Title>
                        
                        <View style={styles.settingRow}>
                            <Text style={styles.settingLabel}>Maximum Prep Time:</Text>
                            <View style={styles.chipContainer}>
                                {prepTimes.map((time) => (
                                    <Chip
                                        key={time}
                                        selected={formData.max_prep_time === time}
                                        onPress={() => setFormData(prev => ({ ...prev, max_prep_time: time }))}
                                        style={styles.optionChip}
                                        mode="outlined"
                                    >
                                        {time}m
                                    </Chip>
                                ))}
                            </View>
                        </View>

                        <Divider style={styles.divider} />

                        <View style={styles.settingRow}>
                            <Text style={styles.settingLabel}>Servings:</Text>
                            <View style={styles.chipContainer}>
                                {servingSizes.map((servings) => (
                                    <Chip
                                        key={servings}
                                        selected={formData.servings === servings}
                                        onPress={() => setFormData(prev => ({ ...prev, servings }))}
                                        style={styles.optionChip}
                                        mode="outlined"
                                    >
                                        {servings}
                                    </Chip>
                                ))}
                            </View>
                        </View>

                        <Divider style={styles.divider} />

                        <View style={styles.settingRow}>
                            <Text style={styles.settingLabel}>Difficulty:</Text>
                            <View style={styles.chipContainer}>
                                {difficulties.map((difficulty) => (
                                    <Chip
                                        key={difficulty}
                                        selected={formData.difficulty === difficulty}
                                        onPress={() => setFormData(prev => ({ ...prev, difficulty }))}
                                        style={styles.optionChip}
                                        mode="outlined"
                                    >
                                        {difficulty}
                                    </Chip>
                                ))}
                            </View>
                        </View>
                    </Card.Content>
                </Card>

                {/* Generate Button */}
                <Card style={styles.generateCard}>
                    <Card.Content>
                        <Button
                            mode="contained"
                            onPress={handleGenerateRecipe}
                            loading={generating}
                            disabled={generating}
                            style={styles.generateButton}
                            icon="magic"
                        >
                            {generating ? 'Generating Recipe...' : 'Generate Recipe'}
                        </Button>
                        <Paragraph style={styles.generateNote}>
                            Our AI will create a personalized recipe based on your preferences
                        </Paragraph>
                    </Card.Content>
                </Card>
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
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    searchInput: {
        marginBottom: 16,
    },
    searchResultsCard: {
        marginBottom: 16,
        maxHeight: 200,
    },
    searchResultItem: {
        paddingVertical: 4,
    },
    fodmapChip: {
        alignSelf: 'center',
    },
    selectedIngredients: {
        marginTop: 16,
    },
    selectedTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    selectedChip: {
        marginBottom: 4,
    },
    optionChip: {
        marginBottom: 4,
    },
    settingRow: {
        marginBottom: 16,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    divider: {
        marginVertical: 16,
    },
    generateCard: {
        margin: 16,
        marginTop: 0,
        backgroundColor: '#E8F5E8',
    },
    generateButton: {
        marginBottom: 12,
        backgroundColor: '#4CAF50',
    },
    generateNote: {
        fontSize: 14,
        color: '#388E3C',
        textAlign: 'center',
    },
}); 