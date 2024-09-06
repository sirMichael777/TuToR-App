import {ActivityIndicator, Image, View} from "react-native";
import Logo from "../assets/Logo.png"
import {useLayoutEffect} from "react";
import {firebaseAuth, firestoreDB} from "../Config/firebaseConfig";
import {doc, getDoc} from "firebase/firestore";
import {setUser} from "../context/actions/userActions";
import {useDispatch} from "react-redux";
import {CommonActions} from "@react-navigation/native";

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

                    if(userData.acceptedTerms){
                        if (userData.role === 'Student') {
                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 0,
                                    routes: [{ name: 'MainApp' }],
                                })
                            );
                        } else if (userData.role === 'Tutor') {
                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 0,
                                    routes: [{ name: 'TutorMainApp' }],
                                })
                            );
                        }
                    }else{
                        navigation.navigate('TermsAndConditions', { userId: user.uid });
                    }
                }
            } else {
                setTimeout(() => {
                    navigation.replace("WelcomeScreen"); // Replace with the tutor home screen
                }, 2000);
            }
        });
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={Logo} style={{ width: 150, height: 150, marginBottom:20 , borderRadius:100 }} resizeMode="contain" />
            <ActivityIndicator size={"large"} color="#00243a" />
        </View>
    );
};

export default LoadingScreen;
