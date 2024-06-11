import React, { useState, useEffect } from "react";
import { View, ScrollView, KeyboardAvoidingView, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Text, TextInput, Button, HelperText } from "react-native-paper";
import { useMyContextProvider } from "../../index";
import firestore from '@react-native-firebase/firestore';
import auth from "@react-native-firebase/auth";

const ChangePassword = ({ navigation }) => {
    const [controller] = useMyContextProvider();
    const { userLogin } = controller;
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [errorText, setErrorText] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [disableButton, setDisableButton] = useState(false);

    useEffect(() => {
        if (errorText !== '' || newPassword.length < 6 || confirmNewPassword.length < 6 || newPassword !== confirmNewPassword) {
            setDisableButton(true);
        } else {
            setDisableButton(false);
        }
    }, [errorText, newPassword, confirmNewPassword]);

    const handleChangePassword = async () => {
        try {
            const user = auth().currentUser;

            const credential = auth.EmailAuthProvider.credential(user.email, currentPassword);
            await user.reauthenticateWithCredential(credential);

            await user.updatePassword(newPassword);

            await firestore().collection('USERS').doc(user.email).update({ password: newPassword });

            Alert.alert('Mật khẩu đã được thay đổi thành công.');
            navigation.navigate(userLogin.role === 'admin' ? 'Profile' : 'ProfileCustomer');
        } catch (error) {
            setErrorText('Đã xảy ra lỗi khi thay đổi mật khẩu: ' + error.message);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.formContainer}>
                    <Image source={require("../assets/logocircle.png")} style={styles.logo} />
                    <View style={styles.inputContainer}>
                        <TextInput
                            label="Mật khẩu hiện tại"
                            secureTextEntry={!showCurrentPassword}
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            style={styles.input}
                            mode="outlined"
                        />
                        <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                            <Image
                                source={showCurrentPassword ? require('../assets/eye.png') : require('../assets/eye-hidden.png')}
                                style={styles.eyeIcon}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            label="Mật khẩu mới"
                            secureTextEntry={!showNewPassword}
                            value={newPassword}
                            onChangeText={setNewPassword}
                            style={styles.input}
                            mode="outlined"
                        />
                        <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                            <Image
                                source={showNewPassword ? require('../assets/eye.png') : require('../assets/eye-hidden.png')}
                                style={styles.eyeIcon}
                            />
                        </TouchableOpacity>
                    </View>
                    {newPassword.length < 6 && <HelperText type="error" style={styles.helperText}>Mật khẩu mới phải có ít nhất 6 ký tự.</HelperText>}
                    <View style={styles.inputContainer}>
                        <TextInput
                            label="Xác nhận mật khẩu mới"
                            secureTextEntry={!showConfirmNewPassword}
                            value={confirmNewPassword}
                            onChangeText={setConfirmNewPassword}
                            style={styles.input}
                            mode="outlined"
                        />
                        <TouchableOpacity onPress={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
                            <Image
                                source={showConfirmNewPassword ? require('../assets/eye.png') : require('../assets/eye-hidden.png')}
                                style={styles.eyeIcon}
                            />
                        </TouchableOpacity>
                    </View>
                    {errorText !== '' && <HelperText type="error" style={styles.helperText}>{errorText}</HelperText>}
                    {confirmNewPassword.length < 6 && <HelperText type="error" style={styles.helperText}>Mật khẩu mới phải có ít nhất 6 ký tự.</HelperText>}
                    {newPassword !== confirmNewPassword && <HelperText type="error" style={styles.helperText}>Mật khẩu mới và xác nhận không khớp.</HelperText>}
                    <Button
                        mode="contained"
                        onPress={handleChangePassword}
                        style={styles.button}
                        disabled={disableButton}
                        textColor="black"
                    >
                        Đổi mật khẩu
                    </Button>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f7f7f7',
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        padding: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    logo: {
        alignSelf: "center",
        marginBottom: 30,
        height: 120,
        width: 120,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        width: '100%',
    },
    input: {
        flex: 1,
        backgroundColor: 'white',
    },
    eyeIcon: {
        marginLeft: 10,
        width: 24,
        height: 24,
    },
    button: {
        marginTop: 20,
        width: '100%',
        paddingVertical: 10,
        backgroundColor: 'pink',
    },
    helperText: {
        width: '100%',
        textAlign: 'left',
        marginTop: -10,
        marginBottom: 10,
    },
});

export default ChangePassword;
