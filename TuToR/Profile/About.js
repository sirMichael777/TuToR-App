import React from 'react';
import {View, Text, ScrollView, StyleSheet, Dimensions, ImageBackground, TouchableOpacity} from 'react-native';
import {Ionicons} from "@expo/vector-icons";

const { width, height } = Dimensions.get('window');

const About = ({navigation}) => {
  return (
    <ImageBackground
      source={require('../assets/images/Student.png')} //Replace with your background image
      style={styles.background}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={28} color="#010202" />
        </TouchableOpacity>
        <View style={styles.aboutContainer}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.header}>About TuToR</Text>
        
        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.sectionText}>
          TuToR is a cutting-edge mobile application designed to bridge the gap between students and tutors in an efficient, safe, and user-friendly environment. Developed with both students and educators in mind, our app leverages advanced technology to provide a seamless tutoring experience.
          {'\n\n'}
          Whether you're a student looking to improve your grades, or a tutor seeking to share your knowledge, TuToR is the perfect platform to facilitate academic growth and success.
        </Text>

        <Text style={styles.sectionTitle}>Our Mission</Text>
        <Text style={styles.sectionText}>
          Our mission is simple: to provide an accessible and flexible tutoring platform that helps students achieve their educational goals, while empowering tutors to share their knowledge and skills. We believe in the transformative power of education and are committed to making high-quality tutoring available to everyone.
        </Text>

        <Text style={styles.sectionTitle}>How It Works</Text>
        <Text style={styles.sectionText}>
          TuToR allows students to find tutors based on their specific academic needs, whether it's for a one-time session or ongoing tutoring support. Students can browse tutor profiles, check qualifications, and select a tutor based on availability, subject matter, and reviews.
          {'\n\n'}
          Tutors can set their own schedules, manage sessions, and receive payments directly through the app. Both students and tutors are verified to ensure a safe and trusted environment for learning.
        </Text>

        <Text style={styles.sectionTitle}>Features and Benefits</Text>
        <Text style={styles.sectionText}>
          • **Easy Tutor Search**: Students can search for tutors by subject, course, or availability.
          {'\n\n'}
          • **Real-time Matching**: Request tutors instantly or schedule sessions at your convenience.
          {'\n\n'}
          • **Safe and Secure**: Both students and tutors go through a verification process. Payments are held securely until sessions are completed.
          {'\n\n'}
          • **Customizable Profiles**: Tutors can showcase their qualifications, while students can highlight their learning needs.
          {'\n\n'}
          • **In-App Communication**: Built-in messaging allows students and tutors to communicate before, during, and after sessions.
          {'\n\n'}
          • **Review System**: Both parties can leave feedback to maintain high-quality standards.
        </Text>

        <Text style={styles.sectionTitle}>Why Choose TuToR?</Text>
        <Text style={styles.sectionText}>
          Unlike traditional tutoring services, TuToR offers flexibility and control for both tutors and students. Whether you're looking to improve in a specific subject or need help with exam preparation, TuToR makes it easy to find the right tutor at the right time.
          {'\n\n'}
          We are committed to creating a learning environment that is supportive, inclusive, and accessible. By using TuToR, you can be confident in receiving top-notch tutoring support that helps you meet your academic objectives.
        </Text>

        <Text style={styles.sectionTitle}>Meet the Team</Text>
        <Text style={styles.sectionText}>
          TuToR was developed by a team of passionate individuals who believe in the importance of education. Our team includes:
          {'\n\n'}
          • Lethabo Letsoalo: Lead Developer, focusing on backend development and integration.
          {'\n\n'}
          • Thabang Mokoena: Backend Developer and UI/UX support, ensuring the app runs smoothly and efficiently.
          {'\n\n'}
          • Michael Maseko: UI/UX Designer and Backend support, creating an intuitive and user-friendly interface.
        </Text>

        <Text style={styles.sectionTitle}>Our Values</Text>
        <Text style={styles.sectionText}>
          At TuToR, we are guided by the following core values:
          {'\n\n'}
          • **Integrity**: We operate with honesty and fairness, ensuring that both students and tutors have a positive experience.
          {'\n\n'}
          • **Innovation**: We strive to continuously improve our platform to meet the evolving needs of our users.
          {'\n\n'}
          • **Accessibility**: Education should be available to all, and we aim to make tutoring services accessible to students from all walks of life.
          {'\n\n'}
          • **Quality**: We are committed to maintaining high standards, providing reliable services, and ensuring satisfaction for both tutors and students.
        </Text>

        <Text style={styles.sectionTitle}>Get Involved</Text>
        <Text style={styles.sectionText}>
          Are you passionate about education and interested in joining our community of tutors? Becoming a tutor on TuToR is easy! Simply sign up, complete the verification process, and start offering your services to students in need.
          {'\n\n'}
          Students can also register quickly by providing their UCT credentials, and start browsing for tutors right away. TuToR is designed to make the process simple, efficient, and rewarding.
        </Text>

        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.sectionText}>
          Have questions or feedback? We're here to help! Feel free to reach out to our support team:
          {'\n\n'}
          Email: support@tutorapp.com
          {'\n\n'}
          Phone: +27 (0) 21 123 4567
          {'\n\n'}
          Follow us on social media for the latest updates and educational tips:
          {'\n\n'}
          Instagram: @TuToRApp
          {'\n'}
          Facebook: TuToRApp
          {'\n'}
          Twitter: @TuToR_App
        </Text>

        <Text style={styles.sectionTitle}>Thank You!</Text>
        <Text style={styles.sectionText}>
          Thank you for choosing TuToR. We look forward to being part of your educational journey and helping you achieve your goals!
        </Text>
      </ScrollView>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: width,
    height: height,
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.05,
  },
  backIcon: {
   padding:10
  },
  aboutContainer:{
    flex: 1,
    top: 20,
    borderRadius: width * 0.05,
    backgroundColor: 'rgba(0, 36, 58, 0.6)',
    padding: width * 0.05,
    marginBottom: height * 0.02,
  },
  header: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: height * 0.02,
    textDecorationLine: 'underline',
    color: '#ffff',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#007BFF',
  },
  sectionText: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 20,
    lineHeight: 22,
  },
});

export default About;
