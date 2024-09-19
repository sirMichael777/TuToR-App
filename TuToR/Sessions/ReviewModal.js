import { useState } from "react";
import {
    Modal,
    TextInput,
    TouchableOpacity,
    View,
    StyleSheet,
    Text,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { doc, updateDoc, getDoc } from "firebase/firestore";  // Ensure Firestore functions are imported
import { firestoreDB } from "../Config/firebaseConfig";  // Update with your actual path to Firebase config

const ReviewModal = ({
                         isVisible,
                         onClose,
                         tutorName,
                         onSubmitReview,
                         loading,
                         sessionId,
                     }) => {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const currentUser = useSelector((state) => state.user.user);
    const handleRatingPress = (value) => setRating(value);


    const handleSubmit = async () => {
        // Validate that both rating and review are provided
        if (rating === 0 || review.trim() === "") {
            alert("Please provide both a rating and a review.");
            return;  // Stop the submission if validation fails
        }

        // Ensure sessionId is valid
        if (!sessionId) {
            console.error("Error: sessionId is undefined or null.");
            alert("Invalid session. Please try again.");
            return;
        }

        try {



            try {
                console.log("Submitting review to parent callback.");
                onSubmitReview({ rating, review });
            } catch (callbackError) {
                console.error("Error in parent callback:", callbackError);
                alert("Failed to submit the review. Please try again.");
                return;
            }


            setRating(0);
            setReview("");

            console.log("Review submitted successfully.");
        } catch (error) {
            console.error("Unexpected error during review submission:", error);
            alert("An unexpected error occurred. Please try again.");
        }

        // Automatically close modal after submission
        onClose();
        console.log("Modal closed after submission.");
    };

    return (
        <Modal visible={isVisible} transparent={true} animationType="fade" onRequestClose={onClose}>
            <KeyboardAvoidingView
                style={styles.modalContainer}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                enabled
            >
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>
                        {currentUser.role === "Student"
                            ? `Please rate your tutor, ${tutorName || "N/A"}`
                            : `Please rate your student, ${tutorName || "N/A"}`}
                    </Text>
                    <View style={styles.ratingContainer}>
                        {[1, 2, 3, 4, 5].map((value) => (
                            <TouchableOpacity
                                key={value}
                                onPress={() => handleRatingPress(value)}
                                accessible
                                accessibilityLabel={`Rate ${value} stars`}
                            >
                                <Ionicons
                                    name={rating >= value ? "star" : "star-outline"}
                                    size={30}
                                    color="yellow"
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                    <TextInput
                        style={styles.reviewInput}
                        placeholder="Write your review"
                        value={review}
                        onChangeText={setReview}
                        multiline={true}
                        accessible
                        accessibilityLabel="Write your review"
                    />
                    {loading ? (
                        <ActivityIndicator size="small" color="#000" />
                    ) : (
                        <TouchableOpacity
                            style={[
                                styles.submitButton,
                            ]}
                            onPress={handleSubmit}
                            accessible
                            accessibilityLabel="Submit review"
                        >
                            <Text style={styles.submitButtonText}>
                                Submit
                            </Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.8)",  // Updated to a darker background
    },
    modalContent: {
        width: "85%",
        backgroundColor: "rgba(31, 41, 55, 0.9)",  // Dark background for the modal itself
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#ffffff",  // White text to contrast with dark background
        marginBottom: 10,
    },
    ratingContainer: {
        flexDirection: "row",
        marginBottom: 10,
    },
    reviewInput: {
        borderWidth: 1,
        borderColor: "#cccccc",
        backgroundColor: "#f5f5f5",  // Light background for the input field
        width: "100%",
        height: 100,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        color: "#000000",  // Black text
    },
    submitButton: {
        backgroundColor: "#00243a",
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    submitButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    closeButton: {
        padding: 10,
        backgroundColor: "#ccc",
        borderRadius: 10,
    },
    closeButtonText: {
        color: "#000",
        fontWeight: "bold",
    },
});

export default ReviewModal;
