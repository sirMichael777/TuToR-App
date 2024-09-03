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

const TutorSearchScreen = ({ navigation }) => {
    const [tutors, setTutors] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true); // State to manage loading status

    useEffect(() => {
        fetchTutors();
    }, []);

    const fetchTutors = async () => {
        try {
            const querySnapshot = await getDocs(collection(firestoreDB, 'Tutors'));
            const tutorList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTutors(tutorList);
        } catch (error) {
            console.error('Error fetching tutors:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTutors = tutors.filter(tutor =>
        tutor.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutor.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const TutorCard = ({ tutor }) => (
        <TouchableOpacity style={styles.tutorCard} onPress={() => navigation.navigate('ChatScreen', { tutorId: tutor.id })}>
            {tutor.imageUrl && tutor.imageUrl !== '' ? (
                <Image
                    source={{ uri: tutor.imageUrl }}
                    style={styles.tutorImage}
                />
            ) : (
                <Ionicons name="person-circle" size={50} color="#ccc" style={styles.tutorIcon} />
            )}
            <View style={styles.tutorContent}>
                <Text style={styles.tutorName}>{`${tutor.firstName} ${tutor.lastName}`}</Text>
                <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>{`${tutor.rating} (${tutor.ratingCount} ratings)`}</Text>
                </View>
            </View>
            <Text style={styles.tutorRate}>{`R${tutor.rate}/hr`}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
                <View style={styles.headerContainer}>
                    <Ionicons name="arrow-back-outline" size={28} color="#00243a" onPress={() => navigation.goBack()} />
                    <Text style={styles.headerTitle}>Chat</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
                        <Ionicons name="person-circle-outline" size={30} color="#00243a" />
                    </TouchableOpacity>
                </View>

                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={20} color="#00243a" />
                    <TextInput
                        placeholder="Search for Tutor"
                        placeholderTextColor="#a9a9a9"
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={text => setSearchQuery(text)}
                    />
                </View>

                    {loading ? (
                        // Display ActivityIndicator while loading
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#00243a" />
                            <Text style={styles.loadingText}>Fetching tutors...</Text>
                        </View>
                    ) : (
                        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                            {filteredTutors.map(tutor => (
                                <TutorCard key={tutor.id} tutor={tutor} />
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
        marginTop: 10,
    },

    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingHorizontal: 15,
        paddingVertical: 15,
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
    tutorCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f8ff',
        padding: 10,
        marginHorizontal: 15,
        marginBottom: 10,
        borderRadius: 10,
    },
    tutorImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    tutorIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    tutorContent: {
        flex: 1,
    },
    tutorName: {
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
    tutorRate: {
        fontSize: 14,
        color: '#00243a',
    },
});

export default TutorSearchScreen;
