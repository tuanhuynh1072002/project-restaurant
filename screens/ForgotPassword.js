import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import firestore from "@react-native-firebase/firestore";

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [disableGetPassword, setDisableGetPassword] = useState(true);

  const hasErrorEmail = () => !email.includes('@');

  const handleGetPassword = () => {
    firestore()
      .collection('USERS')
      .doc(email)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          const userData = documentSnapshot.data();
          setPassword(userData.password);
          setError('');
        } else {
          setPassword('');
          Alert.alert('Thông báo', 'Email không tồn tại trong hệ thống.');
        }
      })
      .catch((error) => {
        console.error("Lỗi: ", error);
        setPassword('');
        Alert.alert('Thông báo', 'Đã có lỗi xảy ra. Vui lòng thử lại sau.');
      });
  };

  useEffect(() => {
    setDisableGetPassword(email.trim() === '' || !!error || hasErrorEmail());
  }, [email, error, hasErrorEmail]);

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Image source={require("../assets/logocircle.png")}
             style={styles.logo}
      />
      <TextInput
        label={"Nhập chính xác Email của bạn"}
        value={email}
        onChangeText={setEmail}
      />
      <HelperText type='error' visible={hasErrorEmail()}>
        Địa chỉ email không hợp lệ
      </HelperText>
      {password ? (
        <View style={{flexDirection: "row"}}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Mật khẩu của bạn là: </Text>
          <Text style={{fontSize: 18}}>{password}</Text>
        </View>
      ) : null}
      <Button mode='contained' textColor='black' buttonColor='pink' onPress={handleGetPassword} disabled={disableGetPassword}>
        Nhận mật khẩu
      </Button>
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        <Button onPress={() => navigation.navigate("Login")}>
          Về đăng nhập
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    alignSelf: "center",
    marginVertical: 60,
    height: 200,
    width: 200
  },
});

export default ForgotPassword;
