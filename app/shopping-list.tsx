import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { 
    Card, 
    Title, 
    Paragraph, 
    Button, 
    Text,
    List,
    Checkbox,
    FAB,
    ActivityIndicator,
    Snackbar,
    Divider
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { ShoppingList, getShoppingLists } from '../src/services/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ShoppingListScreen() {
    const router = useRouter();
    const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        loadShoppingLists();
    }, []);

    const loadShoppingLists = async () => {
        try {
            setLoading(true);
            const lists = await getShoppingLists();
            setShoppingLists(lists);
        } catch (error) {
            console.error('Error loading shopping lists:', error);
            setSnackbarMessage('Error loading shopping lists');
            setSnackbarVisible(true);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadShoppingLists();
        setRefreshing(false);
    };

    const toggleItemChecked = (listId: number, itemId: number) => {
        setShoppingLists(prev => 
            prev.map(list => 
                list.id === listId 
                    ? {
                        ...list,
                        items: list.items.map(item =>
                            item.id === itemId
                                ? { ...item, is_checked: !item.is_checked }
                                : item
                        )
                    }
                    : list
            )
        );
    };

    const getCheckedCount = (list: ShoppingList) => {
        return list.items.filter(item => item.is_checked).length;
    };

    const getTotalCount = (list: ShoppingList) => {
        return list.items.length;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Loading shopping lists...</Text>
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
                        <Title style={styles.headerTitle}>🛒 Shopping Lists</Title>
                        <Paragraph style={styles.headerSubtitle}>
                            Manage your grocery shopping lists
                        </Paragraph>
                    </Card.Content>
                </Card>

                {shoppingLists.length === 0 ? (
                    <Card style={styles.emptyCard}>
                        <Card.Content style={styles.emptyContent}>
                            <MaterialCommunityIcons 
                                name="cart-outline" 
                                size={64} 
                                color="#ccc" 
                            />
                            <Title style={styles.emptyTitle}>No Shopping Lists</Title>
                            <Paragraph style={styles.emptySubtitle}>
                                Create a shopping list from a recipe to get started
                            </Paragraph>
                            <Button 
                                mode="contained" 
                                onPress={() => router.push('/explore')}
                                style={styles.browseButton}
                                icon="book"
                            >
                                Browse Recipes
                            </Button>
                        </Card.Content>
                    </Card>
                ) : (
                    shoppingLists.map((list) => (
                        <Card key={list.id} style={styles.listCard}>
                            <Card.Content>
                                <View style={styles.listHeader}>
                                    <View style={styles.listInfo}>
                                        <Title style={styles.listTitle}>{list.name}</Title>
                                        <Text style={styles.listDate}>
                                            Created {formatDate(list.created_at)}
                                        </Text>
                                    </View>
                                    <View style={styles.listStats}>
                                        <Text style={styles.statsText}>
                                            {getCheckedCount(list)}/{getTotalCount(list)} items
                                        </Text>
                                        <Text style={styles.progressText}>
                                            {Math.round((getCheckedCount(list) / getTotalCount(list)) * 100)}% complete
                                        </Text>
                                    </View>
                                </View>

                                <Divider style={styles.divider} />

                                {list.items.length === 0 ? (
                                    <View style={styles.emptyList}>
                                        <Text style={styles.emptyListText}>No items in this list</Text>
                                    </View>
                                ) : (
                                    <View style={styles.itemsContainer}>
                                        {list.items.map((item) => (
                                            <List.Item
                                                key={item.id}
                                                title={`${item.quantity} ${item.unit} ${item.ingredient.name}`}
                                                left={(props) => (
                                                    <Checkbox
                                                        status={item.is_checked ? 'checked' : 'unchecked'}
                                                        onPress={() => toggleItemChecked(list.id, item.id)}
                                                    />
                                                )}
                                                style={[
                                                    styles.item,
                                                    item.is_checked && styles.checkedItem
                                                ]}
                                                titleStyle={[
                                                    styles.itemTitle,
                                                    item.is_checked && styles.checkedItemTitle
                                                ]}
                                            />
                                        ))}
                                    </View>
                                )}

                                <View style={styles.listActions}>
                                    <Button 
                                        mode="outlined" 
                                        onPress={() => {
                                            // TODO: Implement share functionality
                                            setSnackbarMessage('Share functionality coming soon!');
                                            setSnackbarVisible(true);
                                        }}
                                        icon="share"
                                        style={styles.actionButton}
                                    >
                                        Share List
                                    </Button>
                                    <Button 
                                        mode="outlined" 
                                        onPress={() => {
                                            // TODO: Implement delete functionality
                                            setSnackbarMessage('Delete functionality coming soon!');
                                            setSnackbarVisible(true);
                                        }}
                                        icon="delete"
                                        style={styles.actionButton}
                                    >
                                        Delete List
                                    </Button>
                                </View>
                            </Card.Content>
                        </Card>
                    ))
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
    emptyCard: {
        margin: 16,
        marginTop: 0,
    },
    emptyContent: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#666',
        marginTop: 16,
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 24,
    },
    browseButton: {
        backgroundColor: '#4CAF50',
    },
    listCard: {
        margin: 16,
        marginTop: 0,
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    listInfo: {
        flex: 1,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    listDate: {
        fontSize: 14,
        color: '#666',
    },
    listStats: {
        alignItems: 'flex-end',
    },
    statsText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    progressText: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    divider: {
        marginVertical: 12,
    },
    emptyList: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    emptyListText: {
        fontSize: 16,
        color: '#999',
    },
    itemsContainer: {
        marginBottom: 16,
    },
    item: {
        paddingVertical: 4,
    },
    checkedItem: {
        opacity: 0.6,
    },
    itemTitle: {
        fontSize: 16,
    },
    checkedItemTitle: {
        textDecorationLine: 'line-through',
        color: '#666',
    },
    listActions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
    },
}); 