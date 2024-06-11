import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, ScrollView, Modal, TouchableOpacity, Alert } from "react-native";
import { Text, Button } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import { useMyContextProvider } from "../index";

const Appointments = ({ navigation }) => {
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
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
        <ScrollView style={styles.itemContainer}>
            <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemPrice}>{parseFloat(item.price).toLocaleString()} ₫</Text>
                <Text style={[styles.itemState, { color: item.state === "Đã đặt" ? "red" : "black" }]}>{item.state}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <Button buttonColor="#4CAF50" mode="contained" style={styles.button} onPress={() => handleDetail(item)}>Thông tin</Button>
                <Button buttonColor="#f44336" mode="contained" style={styles.button} onPress={() => handleDelete(item)}>Hủy bàn</Button>
                <Button buttonColor="#2196F3" mode="contained" style={styles.button} onPress={() => openDeleteFoodModal(item)}>Xóa món</Button>
            </View>
        </ScrollView>
    );

    const openDeleteFoodModal = (appointmentData) => {
        setSelectedAppointment(appointmentData);
        setModalVisible(true);
    };

    const handleDeleteFood = async (food, index) => {
        try {
            const updatedFood = selectedAppointment.food.filter((_, i) => i !== index);
            const updatedAppointmentPrice = (parseFloat(selectedAppointment.price) - parseFloat(food.price)).toString();
            await firestore().collection('Appointments').doc(selectedAppointment.id).update({ food: updatedFood, price: updatedAppointmentPrice });

            const serviceRef = firestore().collection('Services').doc(selectedAppointment.serviceId);
            const serviceDoc = await serviceRef.get();
            const serviceData = serviceDoc.data();

            const updatedServiceFoods = serviceData.foods.filter((item, i) => i !== index);
            await serviceRef.update({ foods: updatedServiceFoods });

            console.log("Món ăn đã được xóa khỏi bàn!");
            setModalVisible(false);
        } catch (error) {
            console.error("Lỗi khi xóa món ăn:", error);
        }
    };

    const handleDelete = (appointmentsData) => {
        Alert.alert(
            "Cảnh báo",
            "Bạn có chắc chắn muốn xóa? Hành động này sẽ không được hoàn tác",
            [
                {
                    text: "Không",
                    style: "cancel"
                },
                {
                    text: "Hủy bàn",
                    onPress: async () => {
                        try {
                            const serviceRef = firestore().collection('Services').doc(appointmentsData.serviceId);
                            const updateData = {
                                state: "Trống",
                                orderBy: firestore.FieldValue.delete(),
                                orderInfo: firestore.FieldValue.delete(),
                                note: firestore.FieldValue.delete(),
                                datetime: firestore.FieldValue.delete(),
                                foods: firestore.FieldValue.delete(),
                                totalPrice: firestore.FieldValue.delete(),
                            };
                            await serviceRef.update(updateData);

                            await firestore().collection('Appointments').doc(appointmentsData.id).delete();

                            console.log("Bàn đã được hủy!");
                            navigation.navigate("Appointments");
                        } catch (error) {
                            console.error("Lỗi khi hủy bàn:", error);
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };

    const handleDetail = (appointmentsData) => {
        navigation.navigate("ServiceDetailCustomer", { appointmentsData });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Appointments</Text>
            <FlatList
                data={appointments}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
            {selectedAppointment && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(!modalVisible)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Chọn món ăn bạn muốn xóa khỏi bàn:</Text>
                            {selectedAppointment.food && selectedAppointment.food.length > 0 ? (
                                <FlatList
                                    data={selectedAppointment.food}
                                    renderItem={({ item, index }) => (
                                        <TouchableOpacity
                                            style={styles.foodItem}
                                            onPress={() => handleDeleteFood(item, index)}
                                        >
                                            <Text style={styles.foodText}>{item.title}</Text>
                                        </TouchableOpacity>
                                    )}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            ) : (
                                <Text style={styles.noFoodText}>Chưa đặt món</Text>
                            )}
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <Text style={styles.textStyle}>Đóng</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    headerText: {
        padding: 15,
        fontSize: 25,
        fontWeight: "bold",
        textAlign: 'center',
    },
    itemContainer: {
        margin: 10,
        padding: 15,
        borderRadius: 15,
        marginVertical: 5,
        backgroundColor: '#f0f0f0'
    },
    itemContent: {
        marginBottom: 10,
    },
    itemTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
    itemPrice: {
        fontSize: 18,
        color: 'green',
    },
    itemState: {
        fontSize: 18,
        color: 'gray',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        flex: 1,
        margin: 5,
        marginHorizontal: 2,
        paddingHorizontal: 5,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%',
    },
    closeButton: {
        backgroundColor: "#ff4081",
        borderRadius: 20,
        padding: 10,
        marginTop: 15,
        width: '30%',
        alignItems: 'center',
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold"
    },
    foodItem: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: "#e0e0e0",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        width: '100%',
    },
    foodText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    noFoodText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginVertical: 10,
    },
});

export default Appointments;
