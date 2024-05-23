import React, { useEffect, useState } from 'react';
import { Image, View, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { useMyContextProvider, login } from '../index';
import Icon from 'react-native-vector-icons/FontAwesome';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [controller, dispatch] = useMyContextProvider();
  const { userLogin } = controller;
  const [showPassword, setShowPassword] = useState(false);
  const [disableLogin, setDisableLogin] = useState(true);

  const hasErrorEmail = () => !email.includes("@");
  const hasErrorPassword = () => password.length < 6;

  useEffect(() => {
    setDisableLogin(email.trim() === '' || password.trim() === '' || hasErrorEmail() || hasErrorPassword());
  }, [email, password, hasErrorEmail, hasErrorPassword]);

  const handleLogin = () => {
    login(dispatch, email, password);
  };

  useEffect(() => {
    if (userLogin != null) {
      if (userLogin.role === "admin")
        navigation.navigate("Admin")
      else if (userLogin.role === "customer")
        navigation.navigate("Customer")
    }
  }, [userLogin])

  return (
    <KeyboardAvoidingView
      style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
    <ScrollView style={{ flex: 1, padding: 10 }}>
      <Image source={require("../assets/logocircle.png")}
                style={styles.logo}
            />
      <TextInput
        label={"Email"}
        value={email}
        onChangeText={setEmail}
      />
      <HelperText type='error' visible={hasErrorEmail()}>
        Địa chỉ Email không hợp lệ
      </HelperText>
      <View style={{ flexDirection: "row" }}>
        <TextInput
          label={"Mật khẩu"}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={showPassword}
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
        Mật khẩu có ít nhất 6 ký tự
      </HelperText>
      <Button mode='contained' textColor='black' buttonColor='pink' onPress={handleLogin} disabled={disableLogin}>
        Đăng nhập
      </Button>
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        <Text>Bạn chưa có tài khoản ?</Text>
        <Button onPress={() => navigation.navigate("Register")}>
          Đăng ký
        </Button>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        <Button onPress={() => navigation.navigate("ForgotPassword")}>
          Quên mật khẩu?
        </Button>
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  logo: {
    alignSelf: "center",
    marginVertical: 60,
    height: 200,
    width: 200
},
})

export default Login;
