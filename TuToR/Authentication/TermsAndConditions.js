import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Dimensions,
    ImageBackground,
    Alert,
    ActivityIndicator
} from 'react-native';
import {doc, getDoc, setDoc} from "firebase/firestore";
import {firestoreDB,firebaseAuth} from "../Config/firebaseConfig";
import {signOut,sendEmailVerification} from 'firebase/auth'

const { width, height } = Dimensions.get('window');

const TermsOfUseScreen = ({route, navigation }) => {

    const currentUser = firebaseAuth?.currentUser;
    const [loading, setLoading] = useState(false);
    const [isScrolledToEnd, setIsScrolledToEnd] = useState(false);
    const { userId } = route.params;


    const handleScroll = ({ nativeEvent }) => {
        const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
        if (layoutMeasurement.height + contentOffset.y >= contentSize.height*0.99) {
            setIsScrolledToEnd(true);
            
        }
    };

    const handleAgree = async () => {
        setLoading(true);  // Start loading
        try {
            const userDoc = await getDoc(doc(firestoreDB, 'users', userId));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const role = userData.role;

                const collectionName = role === 'Student' ? 'Students' : 'Tutors';

                await setDoc(doc(firestoreDB, 'users', userId), { acceptedTerms: true }, { merge: true });

                if (collectionName === 'Students' && isScrolledToEnd) {
                    try {
                        await sendEmailVerification(currentUser);
                        Alert.alert('Email Sent', 'A verification email has been sent to your email address.');
                        await signOut(firebaseAuth);
                        await setDoc(doc(firestoreDB, 'Students', userId), { acceptedTerms: true }, { merge: true });
                    } catch (error) {
                        console.error('Error signing out:', error.message);
                    }
                } else if (collectionName === 'Tutors' && isScrolledToEnd) {
                    await setDoc(doc(firestoreDB, 'Tutors', userId), { acceptedTerms: true }, { merge: true });
                    navigation.navigate("ApplicationStatus");
                }
            } else {
                console.error("User document does not exist");
            }
        } catch (error) {
            console.error("Error updating terms acceptance: ", error.message);
        } finally {
            setLoading(false);  // Stop loading
        }
    };

    return (
        <ImageBackground 
            source={require('../assets/images/Student.png')} 
            style={styles.background}
        >
            <View style={styles.container}>
                <View style={styles.termsContainer}>

                    <ScrollView 
                        style={styles.scrollView} 
                        onScroll={handleScroll} 
                        scrollEventThrottle={16}
                    >
                        <Text style={styles.header}>Terms of Use</Text>
                        <Text style={styles.sectionTitle}>1. Introduction</Text>
                        <Text style={styles.sectionText}>
                            Welcome to TuToR, a mobile application designed to connect students with tutors. By using this app, you agree to comply with and be bound by the following terms of use. These terms govern your access to and use of the app, including any content, functionality, and services offered.
                        </Text>
                        <Text style={styles.sectionTitle}>2. User Obligations</Text>
                        <Text style={styles.sectionText}>
                            As a user of TuToR, you agree to:
                            {'\n\n'}
                            • Use the app only for lawful purposes and in accordance with these terms.
                            {'\n'}
                            • Provide accurate and complete information during registration and update your profile as necessary.
                            {'\n'}
                            • Respect the privacy and rights of other users.
                            {'\n'}
                            • Refrain from using the app to harass, threaten, or harm others.
                            {'\n'}
                            • Abide by all applicable laws and regulations in your jurisdiction.
                        </Text>
                        <Text style={styles.sectionTitle}>3. Account Creation and Management</Text>
                        <Text style={styles.sectionText}>
                            Registration: To use the app, you must create an account using your UCT (University of Cape Town) details. You agree to provide true, accurate, and complete information during the registration process.
                            {'\n\n'}
                            Account Security: You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                            {'\n\n'}
                            Account Termination: We reserve the right to suspend or terminate your account if you violate these terms or engage in any activity that is harmful to the app or its users.
                        </Text>
                        <Text style={styles.sectionTitle}>4. Payment Terms</Text>
                        <Text style={styles.sectionText}>
                            Payment Processing: All payments for tutoring services are processed securely within the app. Students are required to upload money to their accounts before requesting a tutor, and tutors must provide valid banking details to receive payments.
                            {'\n\n'}
                            Payment Holds: Payments will be held in escrow until the tutoring session is completed and verified by both the student and the tutor.
                            {'\n\n'}
                            Refunds and Disputes: In the event of a dispute, the app will hold the payment until the issue is resolved. Refunds may be issued at our discretion based on the outcome of the dispute resolution process.
                        </Text>
                        <Text style={styles.sectionTitle}>5. Tutor and Student Responsibilities</Text>
                        <Text style={styles.sectionText}>
                            For Tutors:
                            {'\n\n'}
                            • You must verify your qualifications and provide accurate information in your profile.
                            {'\n\n'}
                            • You agree to be punctual and prepared for all tutoring sessions.
                            {'\n\n'}
                            • You must comply with all safety protocols, including the use of verification codes for session completion.
                            {'\n\n'}
                            For Students:
                            {'\n\n'}
                            • You must provide accurate information about your academic needs when requesting a tutor.
                            {'\n\n'}
                            • You agree to treat tutors with respect and adhere to the scheduled session times.
                            {'\n\n'}
                            • You are responsible for completing the review process within 24 hours after the session.
                        </Text>
                        <Text style={styles.sectionTitle}>6. Safety Features</Text>
                        <Text style={styles.sectionText}>
                            Verification Process: All users must complete the verification process, which includes email verification and, for tutors, qualification verification.
                            {'\n\n'}
                            Session Completion Verification: Tutors and students must use a verification code or QR code to confirm the completion of each session.
                            {'\n\n'}
                            Reporting Mechanisms: Users can report inappropriate behavior, and we will investigate all reports promptly. Accounts may be suspended or terminated based on the investigation's findings.
                        </Text>
                        <Text style={styles.sectionTitle}>7. Review and Rating System</Text>
                        <Text style={styles.sectionText}>
                            For Tutors: Students can rate tutors based on their performance. Tutors who receive consistently low ratings (below 3 stars on three occasions) may have their accounts reviewed and potentially terminated.
                            {'\n\n'}
                            For Students: Tutors can also review students based on punctuality, respect, and communication. Poor reviews may affect a student's ability to book future sessions.
                            {'\n\n'}
                            Review Process: All reviews must be submitted within 24 hours of the session's completion. Reviews that are deemed disrespectful or inappropriate will be removed.
                        </Text>
                        <Text style={styles.sectionTitle}>8. Cross-Platform Compatibility</Text>
                        <Text style={styles.sectionText}>
                            TuToR is designed to work seamlessly on both Android and iOS devices. We are committed to providing a consistent user experience across all supported platforms.
                        </Text>
                        <Text style={styles.sectionTitle}>9. Termination of Service</Text>
                        <Text style={styles.sectionText}>
                            Voluntary Termination: You may terminate your account at any time by contacting customer support.
                            {'\n\n'}
                            Involuntary Termination: We reserve the right to terminate or suspend your account if you violate these terms, engage in fraudulent activities, or fail to comply with our rules and regulations.
                            {'\n\n'}
                            Effect of Termination: Upon termination, you will no longer have access to your account, and any outstanding payments or balances will be handled according to our payment terms.
                        </Text>
                        <Text style={styles.sectionTitle}>10. Liability</Text>
                        <Text style={styles.sectionText}>
                            Limitation of Liability: We are not liable for any damages arising from your use of the app, including but not limited to, loss of data, loss of income, or any other damages resulting from interactions with other users.
                            {'\n\n'}
                            Indemnification: You agree to indemnify and hold harmless the app, its developers, and affiliated parties from any claims, damages, or losses arising from your use of the app.
                        </Text>
                        <Text style={styles.sectionTitle}>11. Privacy Policy</Text>
                        <Text style={styles.sectionText}>
                            Data Collection: We collect and store personal information as described in our Privacy Policy, which is available on the app and website.
                            {'\n\n'}
                            Data Usage: Your data will be used to improve the app's services and for verification purposes. We do not share your personal information with third parties without your consent.
                            {'\n\n'}
                            User Rights: You have the right to access, modify, or delete your personal information at any time by contacting customer support.
                        </Text>
                        <Text style={styles.sectionTitle}>12. Dispute Resolution</Text>
                        <Text style={styles.sectionText}>
                            Internal Resolution: Most disputes can be resolved through our internal dispute resolution process. We encourage users to contact us directly with any concerns.
                            {'\n\n'}
                            Arbitration: In the event that a dispute cannot be resolved internally, it will be submitted to binding arbitration in accordance with the rules of the jurisdiction in which you reside.
                        </Text>
                        <Text style={styles.sectionTitle}>13. Modification of Terms</Text>
                        <Text style={styles.sectionText}>
                            Right to Modify: We reserve the right to modify these terms at any time. Any changes will be communicated to you via email or through a notification within the app.
                            {'\n\n'}
                            Acceptance of Modified Terms: Continued use of the app after modifications to the terms indicates your acceptance of the new terms.
                        </Text>
                        <Text style={styles.sectionTitle}>14. Contact Information</Text>
                        <Text style={styles.sectionText}>
                            If you have any questions or concerns about these terms, please contact our support team at support@tutorapp.com.
                        </Text>
                    </ScrollView>
                </View>
                <TouchableOpacity
                    style={[styles.agreeButton, { backgroundColor: isScrolledToEnd && !loading ? '#007BFF' : '#cccccc' }]}
                    onPress={handleAgree}
                    disabled={!isScrolledToEnd || loading}  // Disable if not scrolled to end or loading
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />  // Show loading indicator
                    ) : (
                        <Text style={styles.agreeButtonText}>Agree and continue</Text>
                    )}
                </TouchableOpacity>

            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.05,
    },
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    header: {
        fontSize: width * 0.07,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: height * 0.02,
        textDecorationLine: 'underline',
        color: '#ffff',
    },
    termsContainer: {
        flex: 1,
        top: 50,
        borderRadius: width * 0.05,
        backgroundColor: 'rgba(0, 36, 58, 0.6)',
        padding: width * 0.05,
        marginBottom: height * 0.02,
    },
    scrollView: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: height * 0.01,
    },
    sectionText: {
        fontSize: width * 0.04,
        color: '#ffffff',
        marginBottom: height * 0.02,
        lineHeight: width * 0.06,
    },
    agreeButton: {
        top: 50,
        borderRadius: width * 0.05,
        paddingVertical: height * 0.02,
        alignItems: 'center',
        marginBottom: height * 0.02,
    },
    agreeButtonText: {
        color: '#fff',
        fontSize: width * 0.05,
        fontWeight: 'bold',
    },
});

export default TermsOfUseScreen;
