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
                <Image source={require("../assets/logocircle.png")} style={styles.logo} />
                <TextInput
                    label="Họ tên"
                    value={fullName}
                    onChangeText={text => setFullName(text)}
                    style={styles.input}
                />
                {fullName.trim() == '' && <HelperText type="error">Không được để trống họ tên.</HelperText>}
                <TextInput
                    label="Địa chỉ"
                    value={address}
                    onChangeText={text => setAddress(text)}
                    style={styles.input}
                />
                {address.trim() == '' && <HelperText type="error">Không được để trống địa chỉ.</HelperText>}
                <TextInput
                    label="Điện thoại"
                    value={phone}
                    onChangeText={text => setPhone(text)}
                    style={styles.input}
                />
                {phone.trim() == '' && <HelperText type="error">Không được để trống điện thoại.</HelperText>}
                {userData.role === 'admin' && (
                    <Picker
                        selectedValue={role}
                        onValueChange={(itemValue, itemIndex) => setRole(itemValue)}
                        style={styles.input}
                    >
                        <Picker.Item color="#FF8C00" label="Admin" value="admin" />
                        <Picker.Item color="#FF8C00" label="Customer" value="customer" />
                    </Picker>
                )}
                <Button textColor="black" buttonColor="pink" mode="contained" onPress={handleUpdateProfile} style={styles.button} disabled={disableButton}>
                    Cập nhật thông tin
                </Button>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        marginBottom: 10,
    },
    button: {
        marginTop: 20,
    },
    logo: {
        alignSelf: "center",
        marginVertical: 30,
        height: 200,
        width: 200
    },
});

export default ProfileUpdate;
