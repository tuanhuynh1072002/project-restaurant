import React, { useState, useEffect } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, Image } from 'react-native';
import { Text, TextInput, Button, HelperText, Card } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import { TouchableOpacity } from 'react-native-gesture-handler';

const UserUpdate = ({ route, navigation }) => {
    const { customersData } = route.params;
    const [email, setEmail] = useState(customersData.email);
    const [password, setPassword] = useState(customersData.password);
    const [fullName, setFullname] = useState(customersData.fullName);
    const [address, setAddress] = useState(customersData.address);
    const [phone, setPhone] = useState(customersData.phone);
    const [selectedRole, setSelectedRole] = useState(customersData.role === "admin" ? "admin" : "customer");
    const [disableUpdate, setDisableUpdate] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const hasErrorFullName = () => fullName === "";
    const hasErrorEmail = () => !email.includes('@');
    const hasErrorPassword = () => password.length < 6;
    const hasErrorAddress = () => address === "";
    const hasErrorPhone = () => phone === "";

    useEffect(() => {
        const isFormValid = !(
            hasErrorFullName() ||
            hasErrorEmail() ||
            hasErrorPassword() ||
            hasErrorAddress() ||
            hasErrorPhone()
        );
        setDisableUpdate(!isFormValid);
    }, [email, password, fullName, address, phone, selectedRole]);

    const handleUpdateUser = async () => {
        if (disableUpdate) return;

        try {
            const updateData = {
                email: email,
                password: password,
                fullName: fullName,
                address: address,
                phone: phone,
                role: selectedRole,
            };

            await firestore()
                .collection('USERS')
                .doc(customersData.id)
                .update(updateData);

            navigation.navigate("Customers");
        } catch (error) {
            console.error("Lỗi khi cập nhật khách hàng:", error);
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.container}>
                <Card style={styles.card}>
                    <Card.Content>
                        <View style={styles.inputContainer}>
                            <TextInput
                                label="Email"
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Enter email"
                                style={styles.input}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <HelperText style={{ display: hasErrorEmail() ? 'flex' : 'none' }} type='error'>
                                Email không hợp lệ
                            </HelperText>
                        </View>
                        <View style={styles.inputContainer}>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    label="Mật khẩu"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    style={[styles.input, { flex: 1 }]}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Image
                                        source={showPassword ? require('../assets/eye.png') : require('../assets/eye-hidden.png')}
                                        style={styles.eyeIcon}
                                    />
                                </TouchableOpacity>
                            </View>
                            <HelperText style={{ display: hasErrorPassword() ? 'flex' : 'none' }} type='error'>
                                Password phải có ít nhất 6 kí tự
                            </HelperText>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                label="Họ tên"
                                value={fullName}
                                onChangeText={setFullname}
                                placeholder="Enter full name"
                                style={styles.input}
                            />
                            <HelperText style={{ display: hasErrorFullName() ? 'flex' : 'none' }} type='error'>
                                Họ và tên không được để trống
                            </HelperText>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                label="Địa chỉ"
                                value={address}
                                onChangeText={setAddress}
                                placeholder="Enter address"
                                style={styles.input}
                            />
                            <HelperText style={{ display: hasErrorAddress() ? 'flex' : 'none' }} type='error'>
                                Địa chỉ không được để trống
                            </HelperText>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                label="Điện thoại"
                                value={phone}
                                onChangeText={setPhone}
                                placeholder="Enter phone number"
                                style={styles.input}
                                keyboardType="phone-pad"
                            />
                            <HelperText style={{ display: hasErrorPhone() ? 'flex' : 'none' }} type='error'>
                                Số điện thoại không được để trống
                            </HelperText>
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.pickerLabel}>Vai trò</Text>
                            <Picker
                                selectedValue={selectedRole}
                                onValueChange={(itemValue) => setSelectedRole(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item style={{color: "red"}} label="Admin" value="admin" />
                                <Picker.Item style={{color: "red"}} label="Customer" value="customer" />
                            </Picker>
                        </View>
                        <Button 
                            mode="contained" 
                            onPress={handleUpdateUser} 
                            disabled={disableUpdate}
                            style={styles.button}
                            textColor="black"
                        >
                            Cập nhật
                        </Button>
                    </Card.Content>
                </Card>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    card: {
        borderRadius: 15,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    inputContainer: {
        marginBottom: 10,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 10,
    },
    eyeIcon: {
        width: 24,
        height: 24,
        margin: 8,
    },
    picker: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: 10,
    },
    pickerLabel: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    button: {
        marginTop: 20,
        padding: 10,
        backgroundColor: 'pink',
    },
});

export default UserUpdate;
