import React, { useState, useEffect } from "react";
import { Image, View, FlatList, TouchableOpacity, Alert, StyleSheet, Modal, TouchableHighlight } from "react-native";
import { Text, TextInput } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { useMyContextProvider } from "../..";

const MenusCustomer = ({ navigation }) => {
    const [initialMenus, setInitialMenus] = useState([]);
    const [menus, setMenus] = useState([]);
    const [name, setName] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        const unsubscribeMenus = firestore()
            .collection('Menus')
            .onSnapshot(querySnapshot => {
                const menus = [];
                querySnapshot.forEach(documentSnapshot => {
                    menus.push({
                        ...documentSnapshot.data(),
                        id: documentSnapshot.id,
                    });
                });

                setMenus(menus);
                setInitialMenus(menus);
            });

        return () => unsubscribeMenus();
    }, []);

    const [controller, dispatch] = useMyContextProvider();
    const { userLogin } = controller;

    useEffect(() => {
        if (userLogin?.email) {
            const unsubscribe = firestore()
                .collection('Appointments')
                .where('orderBy', '==', userLogin.email)
                .onSnapshot(querySnapshot => {
                    const appointmentsData = [];
                    querySnapshot.forEach(documentSnapshot => {
                        appointmentsData.push({
                            ...documentSnapshot.data(),
                            id: documentSnapshot.id,
                        });
                    });
                    setAppointments(appointmentsData);
                });

            return () => unsubscribe();
        }
    }, [userLogin]);

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.itemContainer}
        >
            <Menu>
                <MenuTrigger>
                <View style={styles.itemContent}>
                {item.image ? (
                    <Image
                        source={{ uri: item.image }}
                        style={styles.itemImage}
                        resizeMode="cover"
                    />
                ) : (
                    <Image
                        source={require('../assets/placeholder.png')}
                        style={styles.itemImage}
                        resizeMode="cover"
                    />
                )}
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemPrice}>{parseFloat(item.price).toLocaleString()} ₫</Text>
                </View>
                </MenuTrigger>
                <MenuOptions>
                    <MenuOption onSelect={() => handleDetail(item)}>
                        <Text>Thông tin</Text>
                    </MenuOption>
                    <MenuOption onSelect={() => openAddMenuModal(item)}>
                        <Text>Thêm món vào bàn</Text>
                    </MenuOption>
                </MenuOptions>
            </Menu>
        </TouchableOpacity>
    );

    const handleDetail = (menu) => {
        navigation.navigate("MenuDetail", { menu });
    }

    const openAddMenuModal = (menu) => {
        setSelectedMenu(menu);
        setModalVisible(true);
    }

    const handleAddMenuToAppointment = async (appointment) => {
        try {
            const appointmentRef = firestore().collection('Appointments').doc(appointment.id);
            const updatedFoods = appointment.food ? [...appointment.food, { title: selectedMenu.title, price: selectedMenu.price }] : [{ title: selectedMenu.title, price: selectedMenu.price }];
            await appointmentRef.update({ food: updatedFoods });
            const updatedAppointmentPrice = (parseFloat(appointment.price) + parseFloat(selectedMenu.price)).toString();
            await appointmentRef.update({ price: updatedAppointmentPrice });
            const serviceRef = firestore().collection('Services').doc(appointment.serviceId);
            const serviceDoc = await serviceRef.get();
            const serviceData = serviceDoc.data();
            const updatedServiceFoods = serviceData.foods ? [...serviceData.foods, { title: selectedMenu.title, price: selectedMenu.price }] : [{ title: selectedMenu.title, price: selectedMenu.price }];
            await serviceRef.update({ foods: updatedServiceFoods });
            Alert.alert("Đã thêm món thành công!");
            setModalVisible(false);
        } catch (error) {
            console.error("Lỗi khi thêm món ăn vào bàn:", error);
        }
    }

    const filterMenusByCategory = (category) => {
        if (selectedCategory === category) {
            setMenus(initialMenus);
            setSelectedCategory(null);
        } else {
            const filteredMenus = initialMenus.filter(menu => menu.category === category);
            setMenus(filteredMenus);
            setSelectedCategory(category);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <Image source={require("../assets/logo.png")}
                style={styles.logo}
            />
            <TextInput
                label={"Tìm món"}
                value={name}
                onChangeText={(text) => {
                    setName(text);
                    const result = initialMenus.filter(menu => menu.title.toLowerCase().includes(text.toLowerCase()));
                    setMenus(result);
                }}
                style={styles.searchInput}
            />
            <View style={styles.categoriesContainer}>
                <TouchableOpacity 
                    onPress={() => filterMenusByCategory("Tráng miệng")} 
                    style={[
                        styles.categoryButton, 
                        selectedCategory === "Tráng miệng" && styles.selectedCategoryButton,
                        { width: '33%', flexDirection: "row" }
                    ]}
                >
                    <Image source={require("../assets/icecreamcup.png")} style={{height: 20, width: 20}}/>
                    <Text style={styles.categoryButtonText}>Tráng miệng</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => filterMenusByCategory("Món chính")} 
                    style={[
                        styles.categoryButton, 
                        selectedCategory === "Món chính" && styles.selectedCategoryButton,
                        { width: '30%', flexDirection: "row" }
                    ]}
                >
                    <Image source={require("../assets/tray.png")} style={{height: 20, width: 20}}/>
                    <Text style={styles.categoryButtonText}>Món chính</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => filterMenusByCategory("Đồ uống")} 
                    style={[
                        styles.categoryButton, 
                        selectedCategory === "Đồ uống" && styles.selectedCategoryButton,
                        { width: '30%', flexDirection: "row" }
                    ]}
                >
                    <Image source={require("../assets/soda.png")} style={{height: 20, width: 20}}/>
                    <Text style={styles.categoryButtonText}>Đồ uống</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.header}>
                <Text style={styles.headerText}>
                    Danh sách menu
                </Text>
            </View>
            <FlatList
                data={menus}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                numColumns={2}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Chọn bàn đã đặt để thêm món:</Text>
                        {appointments.length > 0 ? (
                            <FlatList
                                data={appointments}
                                renderItem={({ item }) => (
                                    <TouchableHighlight
                                        style={styles.appointmentItem}
                                        onPress={() => handleAddMenuToAppointment(item)}
                                    >
                                        <Text style={styles.appointmentText}>{item.title}</Text>
                                    </TouchableHighlight>
                                )}
                                keyExtractor={item => item.id}
                            />
                        ) : (
                            <Text style={styles.noAppointmentText}>Chưa đặt bàn</Text>
                        )}
                        <TouchableHighlight
                            style={styles.closeButton}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Text style={styles.textStyle}>Đóng</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    logo: {
        alignSelf: "center",
        marginVertical: 20,
    },
    searchInput: {
        marginHorizontal: 15,
        marginBottom: 20
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        marginBottom: 10,
    },
    headerText: {
        marginTop: 10,
        fontSize: 25,
        fontWeight: "bold",
    },
    addButton: {
        width: 30,
        height: 30,
        margin: 20,
    },
    itemContainer: {
        flex: 1,
        margin: 5,
        backgroundColor: '#e0e0e0',
        borderRadius: 15,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemContent: {
        padding: 15,
        alignItems: 'center',
    },
    itemImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    itemTitle: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: "bold",
    },
    itemPrice: {
        fontSize: 16,
        color: 'green',
    },
    itemState: {
        fontSize: 16,
        color: 'gray',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: '80%',
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    closeButton: {
        backgroundColor: "pink",
        borderRadius: 20,
        padding: 10,
        marginTop: 10,
        elevation: 2
    },
    textStyle: {
        color: "black",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold"
    },
    appointmentItem: {
        padding: 10,
        margin: 5,
        backgroundColor: "#f0f0f0",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    appointmentText: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
    },
    noAppointmentText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginVertical: 10,
    },
    categoriesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 0,
    },
    categoryButton: {
        backgroundColor: '#ccc',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 10,
    },
    selectedCategoryButton: {
        backgroundColor: '#aaa',
    },
    categoryButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
})

export default MenusCustomer;
