import React, { useState, useEffect } from 'react';
import { Image, View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { createAccount } from '../index';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Register = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [role] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [disableCreate, setDisableCreate] = useState(true);

  const hasErrorFullName = () => fullName === "";
  const hasErrorEmail = () => !email.includes('@');
  const hasErrorPassword = () => password.length < 6;
  const hasErrorPasswordConfirm = () => confirmPassword !== password;

  useEffect(() => {
    setDisableCreate(
      hasErrorFullName() ||
      hasErrorEmail() ||
      hasErrorPassword() ||
      hasErrorPasswordConfirm() ||
      phone.trim() === '' ||
      address.trim() === ''
    );
  }, [fullName, email, password, confirmPassword, phone, address]);

  const handleRegister = () => {
    createAccount(email, password, fullName, phone, address, role);
  };

  return (
    <KeyboardAvoidingView
      style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={{ flex: 1, padding: 10 }}>
        <Image source={require("../assets/logo.png")}
                  style={styles.logo}
              />
        <TextInput
          label={"Họ tên"}
          value={fullName}
          onChangeText={setFullname}
        />
        <HelperText type='error' visible={hasErrorFullName()}>
          Họ tên không được phép để trống
        </HelperText>
        <TextInput
          label={"Email"}
          value={email}
          onChangeText={setEmail}
        />
        <HelperText type='error' visible={hasErrorEmail()}>
          Địa chỉ email không hợp lệ
        </HelperText>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            label={"Mật khẩu"}
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
        <HelperText type='error' visible={hasErrorPassword()}>
          Mật khẩu ít nhất 6 kí tự
        </HelperText>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            label={"Xác nhận mật khẩu"}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            style={{ flex: 1 }}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Image
              source={showConfirmPassword ? require('../assets/eye.png') : require('../assets/eye-hidden.png')}
              style={{ width: 20, height: 20, margin: 20 }}
            />
          </TouchableOpacity>
        </View>
        <HelperText type='error' visible={hasErrorPasswordConfirm()}>
          Mật khẩu xác nhận phải giống với mật khẩu
        </HelperText>
        <TextInput
          label={"Địa chỉ"}
          value={address}
          onChangeText={setAddress}
          style={{ marginBottom: 20 }}
        />
        <TextInput
          label={"Số điện thoại"}
          value={phone}
          onChangeText={setPhone}
          style={{ marginBottom: 20 }}
        />
        <Button textColor='black' buttonColor='pink' mode='contained' onPress={handleRegister} disabled={disableCreate}>
          Tạo tài khoản
        </Button>
        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
          <Text>Bạn đã có tài khoản ?</Text>
          <Button onPress={() => navigation.navigate("Login")}>
           Đăng nhập
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  logo: {
    alignSelf: "center",
    marginVertical: 30,
  },
})

export default Register;
