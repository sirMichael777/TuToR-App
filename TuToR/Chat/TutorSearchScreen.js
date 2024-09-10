import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Text,
    Image,
    TextInput,
    ActivityIndicator,
    SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs } from 'firebase/firestore';
import { firestoreDB } from '../Config/firebaseConfig';
import {useSelector} from "react-redux";

const TutorSearchScreen = ({ navigation }) => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All'); // Filter state for Tutors or Students
    const currentUser = useSelector((state) => state.user.user);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const querySnapshot = await getDocs(collection(firestoreDB, 'users'));
            const userList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(userList);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user => {

        const matchesSearchQuery =
            (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchQuery.toLowerCase())) && (user._id !== currentUser._id);

        // If filter is 'All', show all users
        if (filter === 'All') {
            return matchesSearchQuery;
        }

        // Otherwise, filter based on the selected role
        return matchesSearchQuery && user.role === filter;
    });

    const handleFilterToggle = (selectedFilter) => {
        if (filter === selectedFilter) {
            // If the same filter is clicked again, reset to 'All'
            setFilter('All');
        } else {
            // Otherwise, set the filter to the selected one
            setFilter(selectedFilter);
        }
    };

    const UserCard = ({ user }) => (
        <TouchableOpacity style={styles.userCard} onPress={() => navigation.replace('ChatScreen', { user: user})}>
            {user.imageUrl && user.imageUrl !== '' ? (
                <Image
                    source={{ uri: user.imageUrl }}
                    style={styles.userImage}
                />
            ) : (
                <Ionicons name="person-circle" size={50} color="#ccc" style={styles.userIcon} />
            )}
            <View style={styles.userContent}>
                <Text style={styles.userName}>{`${user.name} ${user.lastName}`}</Text>
                {user.role === 'Tutor' && (
                    <>
                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={16} color="#FFD700" />
                            <Text style={styles.ratingText}>{`${user.rating || 0} (${user.ratingCount || 0} ratings)`}</Text>
                        </View>
                        <Text style={styles.userRate}>{`R${user.rate || 0}/hr`}</Text>
                    </>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Ionicons name="arrow-back-outline" size={28} color="#00243a" onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Chat</Text>
                <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
                    {currentUser?.imageUrl ? (
                        <Image
                            source={{ uri: currentUser.imageUrl }}
                            style={styles.profileImage} // Add the style for the profile image
                        />
                    ) : (
                        <Ionicons name="person-outline" size={30} color="black" style={styles.profileIcon} />
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color="#00243a" />
                <TextInput
                    placeholder="Search for User"
                    placeholderTextColor="#a9a9a9"
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={text => setSearchQuery(text)}
                />
            </View>

            {/* Filter buttons for Tutors and Students */}
            <View style={styles.filterContainer}>
                <TouchableOpacity
                    style={[styles.filterButton,filter === 'Student' && styles.activeFilterButton]}
                    onPress={() => handleFilterToggle('Student')}
                >
                    <Text style={[styles.filterButtonText, filter === 'Student' && styles.activeFilterButtonText]}>Students</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterButton, filter === 'Tutor' && styles.activeFilterButton]}
                    onPress={() => handleFilterToggle('Tutor')}
                >
                    <Text style={[styles.filterButtonText, filter === 'Tutor' && styles.activeFilterButtonText]}>Tutors</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#00243a" />
                    <Text style={styles.loadingText}>Fetching users...</Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                    {filteredUsers.map(user => (
                        <UserCard key={user.id} user={user} />
                    ))}
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingHorizontal: 15,
        paddingVertical: 15,
    },
    profileImage: {
        width: 30,
        height: 30,
        borderRadius: 15, // Make it circular
        marginLeft: 15,
    },
    headerTitle: {
        fontSize: 18,
        color: '#00243a',
        fontWeight: 'bold',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f8ff',
        margin: 15,
        padding: 10,
        borderRadius: 25,
    },
    searchInput: {
        flex: 1,
        paddingLeft: 10,
        fontSize: 16,
        color: '#00243a',
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    filterButton: {
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 20,
        marginHorizontal: 5,
    },
    activeFilterButton: {
        backgroundColor: '#00243a',
    },
    filterButtonText: {
        color: '#00243a',
    },
    activeFilterButtonText: {
        color: '#ffffff',
    },
    scrollViewContainer: {
        paddingVertical: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#00243a',
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f8ff',
        padding: 10,
        marginHorizontal: 15,
        marginBottom: 10,
        borderRadius: 10,
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    userIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    userContent: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#00243a',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    ratingText: {
        marginLeft: 5,
        fontSize: 14,
        color: '#4a4a4a',
    },
    userRate: {
        fontSize: 14,
        color: '#00243a',
    },
});

export default TutorSearchScreen;
