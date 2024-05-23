import React, { useState, useEffect } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Text, TextInput, Button, HelperText } from "react-native-paper";
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
            <ScrollView style={{ padding: 10 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Email: </Text>
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter email"
                />
                <HelperText type='error' style={{ display: hasErrorEmail() ? 'flex' : 'none' }}>
                    Email không hợp lệ
                </HelperText>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Mật khẩu: </Text>
                <View style={{ flexDirection: "row" }}>
                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        style={{ flex: 1 }}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Image
                            source={showPassword ? require('../assets/eye.png') : require('../assets/eye-hidden.png')}
                            style={{ width: 20, height: 20, margin: 20 }}
                        />
                    </TouchableOpacity>
                </View>
                <HelperText type='error' style={{ display: hasErrorPassword() ? 'flex' : 'none' }}>
                    Password phải có ít nhất 6 kí tự
                </HelperText>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Họ tên: </Text>
                <TextInput
                    value={fullName}
                    onChangeText={setFullname}
                    placeholder="Enter full name"
                />
                <HelperText type='error' style={{ display: hasErrorFullName() ? 'flex' : 'none' }}>
                    Họ và tên không được để trống
                </HelperText>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Địa chỉ: </Text>
                <TextInput
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Enter address"
                />
                <HelperText type='error' style={{ display: hasErrorAddress() ? 'flex' : 'none' }}>
                    Địa chỉ không được để trống
                </HelperText>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Điện thoại: </Text>
                <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Enter phone number"
                />
                <HelperText type='error' style={{ display: hasErrorPhone() ? 'flex' : 'none' }}>
                    Số điện thoại không được để trống
                </HelperText>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Vai trò: </Text>
                <Picker
                    selectedValue={selectedRole}
                    onValueChange={(itemValue) => setSelectedRole(itemValue)}
                >
                    <Picker.Item color="#FF8C00" label="admin" value="admin" />
                    <Picker.Item color="#FF8C00" label="customer" value="customer" />
                </Picker>
                <Button buttonColor="pink" textColor="black" mode="contained" onPress={handleUpdateUser} disabled={disableUpdate}>
                    Cập nhật
                </Button>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default UserUpdate;
