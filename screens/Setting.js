import { View, Image, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import { logout, useMyContextProvider } from "../index";
import { useEffect } from "react";

const Setting = ({ navigation }) => {
    const [controller, dispatch] = useMyContextProvider();
    const { userLogin } = controller;

    useEffect(() => {
        if (userLogin == null)
            navigation.navigate("Login");
    }, [userLogin]);

    const handleLogout = () => {
        logout(dispatch);
    };

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <Image
                    source={require("../assets/logocircle.png")}
                    style={styles.logo}
                />
                <Text style={styles.titleText}>Goodbye!</Text>
                <Text style={styles.subtitleText}>Cảm ơn bạn đã đến Nhà Hàng TKT</Text>
                <Button
                    buttonColor="pink"
                    textColor="black"
                    mode="contained"
                    onPress={handleLogout}
                    style={styles.logoutButton}
                >
                    Đăng xuất
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f8f8f8"
    },
    contentContainer: {
        width: "100%",
        maxWidth: 400,
        padding: 20,
        borderRadius: 20,
        backgroundColor: "white",
        alignItems: "center",
        elevation: 5, 
    },
    logo: {
        height: 200,
        width: 200,
        marginBottom: 20,
    },
    titleText: {
        fontWeight: 'bold',
        fontSize: 35,
        textAlign: "center",
        marginBottom: 10,
        color: "#333"
    },
    subtitleText: {
        fontSize: 20,
        textAlign: "center",
        marginBottom: 30,
        color: "#555"
    },
    logoutButton: {
        width: "100%",
        borderRadius: 10,
        paddingVertical: 10,
    }
});

export default Setting;
