import {View, Image, StyleSheet} from "react-native"
import {Button, Text} from "react-native-paper"
import { logout, useMyContextProvider } from "../index"
import { useEffect } from "react"

const Setting = ({navigation}) => {
    const [controller, dispatch] = useMyContextProvider();
    const {userLogin} = controller
    useEffect(()=>{
        if(userLogin==null)
            navigation.navigate("Login")
    }, [userLogin])

    const handleLogout = () => {
        logout(dispatch);
    };
    
    return(
        <View style={{ padding:40, flex:1, justifyContent:"center"}}>
            <Image source={require("../assets/logocircle.png")}
                style={styles.logo}
            />
            <Text style={{...styles.myText, fontWeight: 'bold', fontSize: 35}}>Goodbye!</Text>
            <Text style={{...styles.myText, fontSize: 20}}>Cảm ơn bạn đã đến Nhà Hàng TKT</Text>
            <Button
                buttonColor="pink"
                textColor="black"
                mode="contained"
                onPress={handleLogout}
            >
                Đăng xuất
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    logo: {
      alignSelf: "center",
      marginVertical: 10,
      height: 200,
      width: 200
  },
  myText:{
    textAlign: "center",
    marginVertical: 10
  }
  })

export default Setting