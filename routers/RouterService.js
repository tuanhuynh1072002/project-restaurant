import { createStackNavigator } from "@react-navigation/stack";
import Services from '../screens/Service/Services';
import AddNewService from '../screens/Service/AddNewService';
import ServiceDetail from '../screens/Service/ServiceDetail';
import ServiceUpdate from "../screens/Service/ServiceUpdate";
import { useMyContextProvider } from "../index";
import { Text, IconButton } from "react-native-paper";
import { Menu, MenuTrigger, MenuOption, MenuOptions } from "react-native-popup-menu";
import { Alert, Image } from "react-native";
import firestore from '@react-native-firebase/firestore';
import { TouchableOpacity } from "react-native-gesture-handler";
import UserDetail from "../screens/User/UserDetail";
import UserUpdate from "../screens/User/UserUpdate";
import ChangePassword from "../screens/User/ChangePassword";
import ProfileUpdate from "../screens/User/ProfileUpdate";
import Menus from "../screens/Menu/Menus";
import AddNewMenu from "../screens/Menu/AddNewMenu";
import MenuDetail from "../screens/Menu/MenuDetail";
import MenuUpdate from "../screens/Menu/MenuUpdate";

const Stack = createStackNavigator();

const RouterService = ({ navigation }) => {
    const [controller] = useMyContextProvider();
    const { userLogin } = controller;

    const handleDelete = (service) => {
        Alert.alert(
            "Cảnh báo",
            "Bạn có chắc chắn muốn xóa? Hành động này sẽ không được hoàn tác",
            [
                {
                    text: "Hủy",
                    style: "cancel"
                },
                {
                    text: "Xóa",
                    onPress: () => {
                        firestore()
                            .collection('Services')
                            .doc(service.id)
                            .delete()
                            .then(() => {
                                console.log("Dịch vụ đã được xóa thành công!");
                                navigation.navigate("Services");
                            })
                            .catch(error => {
                                console.error("Lỗi khi xóa dịch vụ:", error);
                            });
                    },
                    style: "default"
                }
            ]
        );
    };

    const handleDeleteUser = (customersData) => {
        Alert.alert(
            "Cảnh báo",
            "Bạn có chắc chắn muốn xóa? Hành động này sẽ không được hoàn tác",
            [
                {
                    text: "Hủy",
                    style: "cancel"
                },
                {
                    text: "Xóa",
                    onPress: () => {
                        firestore()
                            .collection('USERS')
                            .doc(customersData.id)
                            .delete()
                            .then(() => {
                                console.log("Dịch vụ đã được xóa thành công!");
                                navigation.navigate("Customers");
                            })
                            .catch(error => {
                                console.error("Lỗi khi xóa dịch vụ:", error);
                            });
                    },
                    style: "default"
                }
            ]
        );
    };
    const handleDeleteMenu = (menu) => {
        Alert.alert(
            "Cảnh báo",
            "Bạn có chắc chắn muốn xóa? Hành động này sẽ không được hoàn tác",
            [
                {
                    text: "Hủy",
                    style: "cancel"
                },
                {
                    text: "Xóa",
                    onPress: () => {
                        firestore()
                            .collection('Menus')
                            .doc(menu.id)
                            .delete()
                            .then(() => {
                                console.log("Dịch vụ đã được xóa thành công!");
                                navigation.navigate("Menu");
                            })
                            .catch(error => {
                                console.error("Lỗi khi xóa dịch vụ:", error);
                            });
                    },
                    style: "default"
                }
            ]
        );
    };

    return (
        <Stack.Navigator
            initialRouteName="Services"
            screenOptions={{
                headerTitleAlign: "left",
                headerStyle: {
                    backgroundColor: "pink"
                },
                headerRight: (props) => (
                    <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                      <Image source={require('../assets/account.png')} style={{ width: 30, height: 30, margin: 20 }} />
                    </TouchableOpacity>
                  ),
                  
            }}
        >
            <Stack.Screen options={{headerLeft: null, title: (userLogin != null) &&  "Quản trị: " + (userLogin.fullName)}} name="Services" component={Services} />
            <Stack.Screen name="AddNewService" options={{title:"Thêm bàn mới", 
            headerRight: null
        }} component={AddNewService} />
            <Stack.Screen
                name="ServiceDetail"
                component={ServiceDetail}
                options={({ route }) => ({
                    title:"Thông tin chi tiết",
                    headerRight: () => (
                        <Menu>
                            <MenuTrigger>
                            <Image source={require('../assets/dots.png')} style={{ width: 30, height: 30, margin: 20 }} />
                            </MenuTrigger>
                            <MenuOptions>
                                <MenuOption onSelect={() => navigation.navigate("ServiceUpdate", { service: route.params.service })}>
                                    <Text>Cập nhật</Text>
                                </MenuOption>
                                <MenuOption onSelect={() => handleDelete(route.params.service)}>
                                    <Text>Xóa bàn</Text>
                                </MenuOption>
                            </MenuOptions>
                        </Menu>
                    )
                })}
            />
            <Stack.Screen name="ServiceUpdate" component={ServiceUpdate} options={{title: "Cập nhật thông tin"}}/>
            <Stack.Screen
                name="UserDetail"
                component={UserDetail}
                options={({ route }) => ({
                    title:"Thông tin chi tiết khách hàng",
                    headerLeft: null,
                    headerRight: () => (
                        <Menu>
                            <MenuTrigger>
                            <Image source={require('../assets/dots.png')} style={{ width: 30, height: 30, margin: 20 }} />
                            </MenuTrigger>
                            <MenuOptions>
                                <MenuOption onSelect={() => navigation.navigate("UserUpdate", { customersData: route.params.customersData })}>
                                    <Text>Cập nhật</Text>
                                </MenuOption>
                                <MenuOption onSelect={() => handleDeleteUser(route.params.customersData)}>
                                    <Text>Xóa khách hàng</Text>
                                </MenuOption>
                            </MenuOptions>
                        </Menu>
                    )
                })}
            />
            <Stack.Screen name="UserUpdate" component={UserUpdate} options={{headerLeft: null, title: "Cập nhật thông tin khách hàng"
            , headerRight: (props) => (
                <TouchableOpacity onPress={() => navigation.navigate("Customers")}>
                  <Image source={require('../assets/customer.png')} style={{ width: 30, height: 30, margin: 20 }} />
                </TouchableOpacity>
              ),
            }}/>
            <Stack.Screen name="ProfileUpdate" component={ProfileUpdate} options={{ headerLeft: null, title: "Cập nhật thông tin cá nhân"}}/>
            <Stack.Screen name="ChangePassword" component={ChangePassword} options={{headerLeft: null, title: "Đổi mật khẩu"}}/>
            <Stack.Screen name="AddNewMenu" options={{ headerLeft: null, title:"Thêm menu" , 
            headerRight: (props) => (
                <TouchableOpacity onPress={() => navigation.navigate("Menu")}>
                  <Image source={require('../assets/menu.png')} style={{ width: 30, height: 30, margin: 20 }} />
                </TouchableOpacity>
              ),
        }} component={AddNewMenu} />
            <Stack.Screen
                    name="MenuDetail"
                    component={MenuDetail}
                    options={({ route }) => ({
                        title:"Thông tin chi tiết",
                        headerLeft: null,
                        headerRight: () => (
                            <Menu>
                                <MenuTrigger>
                                <Image source={require('../assets/dots.png')} style={{ width: 30, height: 30, margin: 20 }} />
                                </MenuTrigger>
                                <MenuOptions>
                                    <MenuOption onSelect={() => navigation.navigate("MenuUpdate", { menu: route.params.menu })}>
                                        <Text>Cập nhật</Text>
                                    </MenuOption>
                                    <MenuOption onSelect={() => handleDeleteMenu(route.params.menu)}>
                                        <Text>Xóa món</Text>
                                    </MenuOption>
                                    <MenuOption onSelect={() => navigation.navigate("Menu")}>
                                        <Text>Menu</Text>
                                    </MenuOption>
                                </MenuOptions>
                            </Menu>
                        )
                    })}
                />        
            <Stack.Screen name="MenuUpdate" component={MenuUpdate} options={{headerLeft: null, title: "Cập nhật thông tin", 
            headerRight: (props) => (
                <TouchableOpacity onPress={() => navigation.navigate("Menu")}>
                <Image source={require('../assets/menu.png')} style={{ width: 30, height: 30, margin: 20 }} />
                </TouchableOpacity>
            ),
        }}/>  
        </Stack.Navigator>
        
    )
}

export default RouterService;
