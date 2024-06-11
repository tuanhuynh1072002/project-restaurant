import React, { useEffect, useState } from "react";
import { Text, Button } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import { useMyContextProvider } from "../index";
import firestore from '@react-native-firebase/firestore';

const Profile = ({ navigation }) => {
    const [controller, dispatch] = useMyContextProvider();
    const { userLogin } = controller;
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('USERS')
            .doc(userLogin.email)
            .onSnapshot(documentSnapshot => {
                if (documentSnapshot.exists) {
                    setUserData(documentSnapshot.data());
                } else {
                    setUserData(null);
                }
            });

        return () => unsubscribe();
    }, []);

    const handleUpdateProfile = () => {
        navigation.navigate("ProfileUpdate", { userData: userData });
    };

    const handleChangePassword = () => {
        navigation.navigate("ChangePassword");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>
            {userData && (
                <View style={styles.imageContainer}>
                    <View style={styles.profileImage}>
                        <Text style={styles.profileImageText}>{userData.email.charAt(0).toUpperCase()}</Text>
                    </View>
                </View>
            )}
            {userData && (
                <View style={styles.userInfoContainer}>
                    <View style={styles.userInfo}>
                        <Text style={styles.label}>Email:</Text>
                        <Text style={styles.info}>{userData.email}</Text>
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.label}>Mật khẩu:</Text>
                        <Text style={styles.info}>{userData.password}</Text>
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.label}>Họ tên:</Text>
                        <Text style={styles.info}>{userData.fullName}</Text>
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.label}>Địa chỉ:</Text>
                        <Text style={styles.info}>{userData.address}</Text>
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.label}>Điện thoại:</Text>
                        <Text style={styles.info}>{userData.phone}</Text>
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.label}>Vai trò:</Text>
                        <Text style={styles.info}>{userData.role}</Text>
                    </View>
                </View>
            )}
            <View style={styles.buttonContainer}>
                <Button onPress={handleChangePassword} mode="contained" style={[styles.button, styles.changePasswordButton]}>
                    <Text style={styles.buttonText}>Đổi mật khẩu</Text>
                </Button>
                <Button onPress={handleUpdateProfile} mode="contained" style={[styles.button, styles.updateProfileButton]}>
                    <Text style={styles.buttonText}>Đổi thông tin</Text>
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#6200ee',
    },
    userInfoContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    userInfo: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        width: 120,
        color: '#333',
    },
    info: {
        fontSize: 18,
        color: '#333',
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 30,
    },
    button: {
        flex: 1,
        marginHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
    },
    changePasswordButton: {
        backgroundColor: '#ff4081',
    },
    updateProfileButton: {
        backgroundColor: '#ff4081',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#ff4081',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
        shadowColor: 'rgba(0,0,0,0.5)',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
        elevation: 5,
    },
    profileImageText: {
        fontSize: 40,
        color: '#fff',
    },
});

export default Profile;
