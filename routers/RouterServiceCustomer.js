import { createStackNavigator } from "@react-navigation/stack";
import ServicesCustomer from '../screens/Service/ServicesCustomer';
import { useMyContextProvider } from "../index";
import Appointment from "../screens/Appointment";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Image } from "react-native";
import ServiceDetailCustomer from "../screens/Service/ServiceDetailCustomer";
import ProfileUpdate from "../screens/User/ProfileUpdate";
import ChangePassword from "../screens/User/ChangePassword";
import MenuDetail from "../screens/Menu/MenuDetail";

const Stack = createStackNavigator();

const RouterServiceCustomer = ({ navigation }) => {
    const [controller] = useMyContextProvider();
    const { userLogin } = controller;

    return (
        <Stack.Navigator
            initialRouteName="ServicesCustomer"
            screenOptions={{
                headerTitleAlign: "left",
                headerStyle: {
                    backgroundColor: "pink"
                },
                headerRight: (props) => (
                    <TouchableOpacity onPress={() => navigation.navigate("ProfileCustomer")}>
                      <Image source={require('../assets/account.png')} style={{ width: 30, height: 30, margin: 20 }} />
                    </TouchableOpacity>
                  ),
            }}
        >
            <Stack.Screen options={{headerLeft: null, title: (userLogin != null) && "Khách hàng: " + (userLogin.fullName)}} name="ServicesCustomer" component={ServicesCustomer} />
            <Stack.Screen name="Appointment" component={Appointment} />
            <Stack.Screen name="ServiceDetailCustomer" component={ServiceDetailCustomer} options={{headerLeft: null, title: "Thông tin đặt bàn"
        , headerRight: (props) => (
            <TouchableOpacity onPress={() => navigation.navigate("Appointments")}>
              <Image source={require('../assets/appointment.png')} style={{ width: 30, height: 30, margin: 20 }} />
            </TouchableOpacity>
          ),
        }}/>
            <Stack.Screen name="ProfileUpdate" component={ProfileUpdate} options={{headerLeft: null, title: "Cập nhật thông tin cá nhân"}}/>
            <Stack.Screen name="ChangePassword" component={ChangePassword} options={{headerLeft: null, title: "Đổi mật khẩu"}}/>
            <Stack.Screen name="MenuDetail" component={MenuDetail} options={{headerLeft: null, title: "Thông tin món ăn",
            headerRight: (props) => (
                <TouchableOpacity onPress={() => navigation.navigate("MenusCustomer")}>
                <Image source={require('../assets/menu.png')} style={{ width: 30, height: 30, margin: 20 }} />
                </TouchableOpacity>
            ),
        }}/>
        </Stack.Navigator>
    )
}

export default RouterServiceCustomer;
