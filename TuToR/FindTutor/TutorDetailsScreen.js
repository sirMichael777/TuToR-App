import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, SafeAreaView} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { firestoreDB } from "../Config/firebaseConfig";
import {collection, setDoc, doc, getDoc, updateDoc, addDoc} from 'firebase/firestore';
import { useSelector } from "react-redux";

const { width, height } = Dimensions.get('window');

const TutorDetailsScreen = ({ route, navigation }) => {
  const [studentBalance, setStudentBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const currentUser = useSelector((state) => state.user.user);

  const {
    tutor,
    studentName,
    startTime,
    endTime,
    tutoringDate,
    course,
    requestTime,
    customRequest,
    selectedMode,
  } = route.params;

  // Function to fetch student balance from Firestore
  const fetchStudentBalance = async () => {
    try {
      const studentRef = doc(firestoreDB, 'users', currentUser._id);
      const studentDoc = await getDoc(studentRef);

      if (studentDoc.exists()) {
        const studentData = studentDoc.data();
        setStudentBalance(studentData.Balance);
      } else {
        console.error('Student document not found');
      }
    } catch (error) {
      console.error('Error fetching student balance:', error);
    }
  };

  useEffect(() => {
    fetchStudentBalance();
  }, []);

  const calculateSessionCost = () => {
    const hours = (endTime - startTime) / (1000 * 60 * 60);
    return tutor.rate * hours;
  };



  const handleBooking = async (bookingDetails) => {
    const sessionCost = parseFloat(calculateSessionCost().toFixed(2)); // Ensure session cost has 2 decimal places

    if (studentBalance === null) {
      alert('Could not retrieve your balance. Please try again later.');
      return;
    }

    if (studentBalance < sessionCost) {
      alert(`Insufficient balance. Your balance is R${studentBalance.toFixed(2)}, but the session costs R${sessionCost}.`);
      return;
    }

    try {
      setLoading(true);

      const bookingRef = doc(collection(firestoreDB, 'Bookings'));

      // Save the booking to Firestore
      await setDoc(bookingRef, {
        tutor: bookingDetails.tutor,
        studentName: bookingDetails.studentName,
        course: bookingDetails.course,
        tutoringDate: bookingDetails.tutoringDate,
        startTime: bookingDetails.startTime,
        endTime: bookingDetails.endTime,
        requestTime: bookingDetails.requestTime,
        customRequest: bookingDetails.customRequest,
        selectedMode: bookingDetails.selectedMode,
        readByTutor:false,
        readByStudent:false,
        status: 'pending',
        reviewedBy : [],
        bookingRef: bookingRef.id,
        student: currentUser,
        cost: sessionCost,
        studentAck: false,
        tutorAck: false,
      });

      // Update the student's balance by subtracting the session cost
      const newStudentBalance = parseFloat((studentBalance - sessionCost).toFixed(2));
      const studentDocRef = doc(firestoreDB, 'users', currentUser._id);
      const studentRefInStudents = doc(firestoreDB, 'Students', currentUser._id);

      await updateDoc(studentDocRef, {
        Balance: newStudentBalance,
      });

      // Also update the Students collection
      await updateDoc(studentRefInStudents, {
        Balance: newStudentBalance,
      });

      // Record the payment in the 'payments' collection, including both student and tutor
      await addDoc(collection(firestoreDB, 'payments'), {
        payerName: currentUser.name,
        payerId: currentUser._id,
        recipientName: `${bookingDetails.tutor.name} ${bookingDetails.tutor.lastName}`,
        amount: -sessionCost,
        method: 'sessionPayment',
        mobile: currentUser.phoneNumber,
        timestamp: new Date(),
      });



      alert(`Booking request sent successfully! Your new balance is R${newStudentBalance}. \nBooking Reference: ${bookingRef.id}`);

      navigation.goBack();
    } catch (error) {
      console.error('Error sending booking request:', error);
      alert('Failed to send booking request, please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
      <SafeAreaView style={styles.containerwider}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back-outline" size={width * 0.07} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Tutor Details</Text>
          </View>

          <View style={styles.profileContainer}>
            <Image
                source={tutor.imageUrl ? { uri: tutor.imageUrl } : require('../assets/images/defaultImage.jpeg')}
                style={styles.tutorImage}
            />
            <Text style={styles.tutorName}>
              {tutor.name} {tutor.lastName}
            </Text>
            <Text style={styles.tutorRating}>⭐ {tutor.rating || 'No rating yet'}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.detailsHeader}>Experience</Text>
            <Text style={styles.detailsText}>
              {tutor.experience ? `${tutor.experience} years` : "No experience provided"}
            </Text>

            <Text style={styles.detailsHeader}>Languages</Text>
            <Text style={styles.detailsText}>{tutor.languages?.join(', ') || "Languages not provided"}</Text>

            <Text style={styles.detailsHeader}>Courses Taught</Text>
            {tutor.courses?.map((course, index) => (
                <Text key={index} style={styles.detailsText}>{course}</Text>
            ))}

            <Text style={styles.detailsHeader}>Reviews</Text>
            {tutor.reviews?.length > 0 ? (
                tutor.reviews.map((review, index) => (
                    <View key={index} style={styles.reviewContainer}>
                      {/* Review Header */}
                      <View style={styles.reviewHeader}>
                        <Text style={styles.reviewerName}>
                          {review.studentName} {review.reviewerName}
                        </Text>

                        {/* Display star ratings */}
                        <View style={styles.ratingStars}>
                          {[1, 2, 3, 4, 5].map((star) => (
                              <Ionicons
                                  key={star}
                                  name={star <= review.rating ? 'star' : 'star-outline'}
                                  size={16}
                                  color="yellow"
                              />
                          ))}
                        </View>
                      </View>

                      {/* Review Text */}
                      <Text style={styles.reviewText}>
                        {review.review}
                      </Text>

                      {/* Review Timestamp */}
                      <Text style={styles.reviewDate}>
                        {new Date(review.timestamp?.seconds * 1000).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </Text>
                    </View>
                ))
            ) : (
                <Text style={styles.detailsText}>No reviews available</Text>
            )}
          </View>

          <TouchableOpacity style={styles.bookButton} onPress={() => {
            handleBooking({
              studentName,
              startTime,
              endTime,
              tutoringDate,
              course,
              requestTime,
              customRequest,
              selectedMode,
              tutor: tutor,
            });
          }}>
            <Text style={styles.bookButtonText}>
              {loading ? 'Processing...' : 'Book a Session'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerwider: {
    flex: 1,
  },
  container: {
    padding: width * 0.05,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: width * 0.05,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  tutorImage: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    marginBottom: height * 0.02,
  },
  tutorName: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
  },
  tutorRating: {
    fontSize: width * 0.045,
    color: '#888',
    marginBottom: height * 0.02,
  },
  detailsContainer: {
    marginVertical: height * 0.02,
  },
  detailsHeader: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: height * 0.01,
  },
  detailsText: {
    fontSize: width * 0.04,
    color: '#555',
    marginBottom: height * 0.01,
  },
  reviewContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: width * 0.03,
    marginBottom: height * 0.01,
  },
  reviewText: {
    fontSize: width * 0.04,
    color: '#555',
  },
  bookButton: {
    backgroundColor: '#007BFF',
    borderRadius: 10,
    paddingVertical: height * 0.02,
    alignItems: 'center',
    marginTop: height * 0.03,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingStars: {
    flexDirection: 'row',
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
});

export default TutorDetailsScreen;
