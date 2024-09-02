import {ActivityIndicator, Image, View} from "react-native";
import Logo from "../assets/Logo.png"
import {useLayoutEffect} from "react";
import {firebaseAuth, firestoreDB} from "../Config/firebaseConfig";
import {doc, getDoc} from "firebase/firestore";
import {setUser} from "../context/actions/userActions";
import {useDispatch} from "react-redux";

const LoadingScreen = ({navigation}) => {
    const dispatch = useDispatch();

     useLayoutEffect(() => {
        checkLoggedUser();
    }, []);

    const checkLoggedUser = async () => {
        firebaseAuth.onAuthStateChanged(async (user) => {
            if (user?.uid) {
                const docSnap = await getDoc(doc(firestoreDB, 'users', user?.uid));
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    dispatch(setUser(userData));
                    // Redirect based on user role
                    if (userData.role === 'Student') {
                        setTimeout(() => {
                            navigation.replace("MainApp"); // Replace with the student home screen
                        }, 5000);
                    } else if (userData.role === 'Tutor') {
                        setTimeout(() => {
                            navigation.replace("TutorMainApp"); // Replace with the tutor home screen
                        }, 5000);
                    }
                }
            } else {
                navigation.replace("WelcomeScreen");
            }
        });
    };

    return (
        <View className="flex items-center justify-center space-y-24">
            <Image source={Logo} className="w-24 h-24" resizeMode="contain" />
            <ActivityIndicator size={"large"} color="#00243a" />
        </View>
    );
};

export default LoadingScreen;
