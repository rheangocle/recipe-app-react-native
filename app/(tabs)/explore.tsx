import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { 
    Card, 
    Title, 
    Paragraph, 
    Button, 
    TextInput,
    Chip,
    Text,
    Avatar,
    ActivityIndicator,
    Searchbar,
    FAB
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Recipe, getRecipes } from '../../src/services/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ExploreScreen() {
    const router = useRouter();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

    const filters = [
        { key: 'fodmap-friendly', label: 'FODMAP Safe', icon: 'leaf' },
        { key: 'quick', label: 'Quick (<30min)', icon: 'clock-fast' },
        { key: 'easy', label: 'Easy', icon: 'star' },
        { key: 'vegetarian', label: 'Vegetarian', icon: 'food-apple' },
        { key: 'gluten-free', label: 'Gluten Free', icon: 'wheat-off' },
    ];

    useEffect(() => {
        loadRecipes();
    }, []);

    useEffect(() => {
        filterRecipes();
    }, [recipes, searchQuery, selectedFilters]);

    const loadRecipes = async () => {
        try {
            setLoading(true);
            const fetchedRecipes = await getRecipes();
            setRecipes(fetchedRecipes);
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

    const filterRecipes = () => {
        let filtered = recipes;

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(recipe =>
                recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // Apply selected filters
        selectedFilters.forEach(filter => {
            switch (filter) {
                case 'fodmap-friendly':
                    filtered = filtered.filter(recipe => recipe.is_fodmap_friendly);
                    break;
                case 'quick':
                    filtered = filtered.filter(recipe => recipe.prep_time + recipe.cook_time <= 30);
                    break;
                case 'easy':
                    filtered = filtered.filter(recipe => recipe.difficulty === 'easy');
                    break;
                case 'vegetarian':
                    filtered = filtered.filter(recipe => 
                        recipe.tags.includes('vegetarian') || 
                        recipe.description.toLowerCase().includes('vegetarian')
                    );
                    break;
                case 'gluten-free':
                    filtered = filtered.filter(recipe => 
                        recipe.tags.includes('gluten-free') || 
                        recipe.description.toLowerCase().includes('gluten-free')
                    );
                    break;
            }
        });

        setFilteredRecipes(filtered);
    };

    const toggleFilter = (filterKey: string) => {
        setSelectedFilters(prev =>
            prev.includes(filterKey)
                ? prev.filter(f => f !== filterKey)
                : [...prev, filterKey]
        );
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
                <Text style={styles.loadingText}>Loading recipes...</Text>
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
                {/* Header */}
                <Card style={styles.headerCard}>
                    <Card.Content>
                        <Title style={styles.headerTitle}>📚 Recipe Collection</Title>
                        <Paragraph style={styles.headerSubtitle}>
                            Discover delicious FODMAP-friendly recipes
                        </Paragraph>
                    </Card.Content>
                </Card>

                {/* Search */}
                <Card style={styles.searchCard}>
                    <Card.Content>
                        <Searchbar
                            placeholder="Search recipes..."
                            onChangeText={setSearchQuery}
                            value={searchQuery}
                            style={styles.searchBar}
                        />
                    </Card.Content>
                </Card>

                {/* Filters */}
                <Card style={styles.filtersCard}>
                    <Card.Content>
                        <Title style={styles.filtersTitle}>Filters</Title>
                        <View style={styles.filtersContainer}>
                            {filters.map((filter) => (
                                <Chip
                                    key={filter.key}
                                    selected={selectedFilters.includes(filter.key)}
                                    onPress={() => toggleFilter(filter.key)}
                                    style={styles.filterChip}
                                    mode="outlined"
                                    icon={filter.icon}
                                >
                                    {filter.label}
                                </Chip>
                            ))}
                        </View>
                    </Card.Content>
                </Card>

                {/* Results */}
                <Card style={styles.resultsCard}>
                    <Card.Content>
                        <View style={styles.resultsHeader}>
                            <Title style={styles.resultsTitle}>
                                {filteredRecipes.length} Recipe{filteredRecipes.length !== 1 ? 's' : ''}
                            </Title>
                            {selectedFilters.length > 0 && (
                                <Button 
                                    mode="text" 
                                    onPress={() => setSelectedFilters([])}
                                    compact
                                >
                                    Clear Filters
                                </Button>
                            )}
                        </View>

                        {filteredRecipes.length === 0 ? (
                            <View style={styles.emptyState}>
                                <MaterialCommunityIcons 
                                    name="food-variant-off" 
                                    size={64} 
                                    color="#ccc" 
                                />
                                <Text style={styles.emptyText}>No recipes found</Text>
                                <Text style={styles.emptySubtext}>
                                    Try adjusting your search or filters
                                </Text>
                                <Button 
                                    mode="contained" 
                                    onPress={() => {
                                        setSearchQuery('');
                                        setSelectedFilters([]);
                                    }}
                                    style={styles.clearButton}
                                >
                                    Clear All
                                </Button>
                            </View>
                        ) : (
                            <View style={styles.recipesGrid}>
                                {filteredRecipes.map((recipe) => (
                                    <Card 
                                        key={recipe.id} 
                                        style={styles.recipeCard}
                                        onPress={() => router.push(`/recipe/${recipe.id}`)}
                                    >
                                        {recipe.image_url && (
                                            <Card.Cover source={{ uri: recipe.image_url }} />
                                        )}
                                        <Card.Content style={styles.recipeContent}>
                                            <Title style={styles.recipeTitle} numberOfLines={2}>
                                                {recipe.title}
                                            </Title>
                                            <Paragraph style={styles.recipeDescription} numberOfLines={2}>
                                                {recipe.description}
                                            </Paragraph>
                                            
                                            <View style={styles.recipeMeta}>
                                                <Chip 
                                                    icon="clock-outline"
                                                    style={styles.metaChip}
                                                    textStyle={{ fontSize: 10 }}
                                                >
                                                    {formatTime(recipe.prep_time + recipe.cook_time)}
                                                </Chip>
                                                <Chip 
                                                    icon="star"
                                                    style={[
                                                        styles.metaChip,
                                                        { backgroundColor: getDifficultyColor(recipe.difficulty) }
                                                    ]}
                                                    textStyle={{ color: 'white', fontSize: 10 }}
                                                >
                                                    {recipe.difficulty}
                                                </Chip>
                                                {recipe.is_fodmap_friendly && (
                                                    <Chip 
                                                        icon="check-circle"
                                                        style={[styles.metaChip, { backgroundColor: '#4CAF50' }]}
                                                        textStyle={{ color: 'white', fontSize: 10 }}
                                                    >
                                                        FODMAP
                                                    </Chip>
                                                )}
                                            </View>
                                        </Card.Content>
                                    </Card>
                                ))}
                            </View>
                        )}
                    </Card.Content>
                </Card>
            </ScrollView>

            {/* FAB for generating new recipe */}
            <FAB
                style={styles.fab}
                icon="plus"
                onPress={() => router.push('/generate-recipe')}
                label="Generate Recipe"
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
    headerCard: {
        margin: 16,
        backgroundColor: '#E8F5E8',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2E7D32',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#388E3C',
        marginTop: 8,
    },
    searchCard: {
        margin: 16,
        marginTop: 0,
    },
    searchBar: {
        backgroundColor: '#f0f0f0',
    },
    filtersCard: {
        margin: 16,
        marginTop: 0,
    },
    filtersTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    filtersContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    filterChip: {
        marginBottom: 4,
    },
    resultsCard: {
        margin: 16,
        marginTop: 0,
    },
    resultsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    resultsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
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
        marginBottom: 16,
    },
    clearButton: {
        backgroundColor: '#4CAF50',
    },
    recipesGrid: {
        gap: 12,
    },
    recipeCard: {
        marginBottom: 12,
        elevation: 2,
    },
    recipeContent: {
        paddingTop: 12,
    },
    recipeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    recipeDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    recipeMeta: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
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
