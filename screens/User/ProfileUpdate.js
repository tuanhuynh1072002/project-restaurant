import React, { useState, useEffect } from "react";
import { Text, Button, TextInput, HelperText } from "react-native-paper";
import { View, KeyboardAvoidingView, ScrollView, StyleSheet, Image, Alert, Platform } from "react-native";
import firestore from '@react-native-firebase/firestore';
import { Picker } from "@react-native-picker/picker";

const ProfileUpdate = ({ navigation, route }) => {
    const { userData } = route.params;
    const [fullName, setFullName] = useState(userData.fullName);
    const [address, setAddress] = useState(userData.address);
    const [phone, setPhone] = useState(userData.phone);
    const [role, setRole] = useState(userData.role);
    const [disableButton, setDisableButton] = useState(true);

    useEffect(() => {
        if (fullName.trim() !== '' && address.trim() !== '' && phone.trim() !== '') {
            setDisableButton(false);
        } else {
            setDisableButton(true);
        }
    }, [fullName, address, phone]);

    const handleUpdateProfile = () => {
        firestore()
            .collection('USERS')
            .doc(userData.email)
            .update({
                fullName: fullName,
                address: address,
                phone: phone,
                role: role
            })
            .then(() => {
                Alert.alert("Cập nhật thông tin cá nhân thành công")
                navigation.navigate(userData.role === 'admin' ? 'Profile' : 'ProfileCustomer');
            })
            .catch(error => {
                console.error('Lỗi khi cập nhật thông tin: ', error);
            });
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.formContainer}>
                    <Image source={require("../assets/logocircle.png")} style={styles.logo} />
                    <TextInput
                        label="Họ tên"
                        value={fullName}
                        onChangeText={text => setFullName(text)}
                        style={styles.input}
                        mode="outlined"
                        theme={{ colors: { primary: '#6200ee' } }}
                    />
                    {fullName.trim() === '' && <HelperText type="error" style={styles.helperText}>Không được để trống họ tên.</HelperText>}
                    <TextInput
                        label="Địa chỉ"
                        value={address}
                        onChangeText={text => setAddress(text)}
                        style={styles.input}
                        mode="outlined"
                        theme={{ colors: { primary: '#6200ee' } }}
                    />
                    {address.trim() === '' && <HelperText type="error" style={styles.helperText}>Không được để trống địa chỉ.</HelperText>}
                    <TextInput
                        label="Điện thoại"
                        value={phone}
                        onChangeText={text => setPhone(text)}
                        style={styles.input}
                        mode="outlined"
                        theme={{ colors: { primary: '#6200ee' } }}
                    />
                    {phone.trim() === '' && <HelperText type="error" style={styles.helperText}>Không được để trống điện thoại.</HelperText>}
                    {userData.role === 'admin' && (
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={role}
                                onValueChange={(itemValue, itemIndex) => setRole(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Admin" value="admin" />
                                <Picker.Item label="Customer" value="customer" />
                            </Picker>
                        </View>
                    )}
                    <Button
                        mode="contained"
                        onPress={handleUpdateProfile}
                        style={styles.button}
                        disabled={disableButton}
                        labelStyle={styles.buttonLabel}
                    >
                        Cập nhật thông tin
                    </Button>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

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
        alignItems: 'center',
    },
    logo: {
        alignSelf: "center",
        marginBottom: 30,
        height: 120,
        width: 120,
    },
    input: {
        width: '100%',
        marginBottom: 15,
        backgroundColor: 'white',
        fontSize: 16,
    },
    pickerContainer: {
        width: '100%',
        borderColor: '#6200ee',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
    },
    picker: {
        width: '100%',
        height: 50,
    },
    button: {
        marginTop: 20,
        width: '100%',
        paddingVertical: 12,
        backgroundColor: 'pink',
        borderRadius: 5,
    },
    buttonLabel: {
        fontSize: 18,
        color: 'black',
    },
    helperText: {
        width: '100%',
        textAlign: 'left',
        marginTop: -10,
        marginBottom: 10,
        fontSize: 14,
    },
});

export default ProfileUpdate;
