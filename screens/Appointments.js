import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, ScrollView, Modal, TouchableHighlight, Alert } from "react-native";
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
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={styles.itemContent}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemPrice}>{parseFloat(item.price).toLocaleString()} ₫</Text>
                    <Text style={[styles.itemState, { color: item.state === "Đã đặt" ? "red" : "black" }]}>{item.state}</Text>
                </View>
                <View style={{ flexDirection: "column" }}>
                    <Button buttonColor="green" mode="contained" style={styles.cancelButton} onPress={() => handleDetail(item)}>Thông tin</Button>
                    <Button buttonColor="red" mode="contained" style={styles.cancelButton} onPress={() => handleDelete(item)}>Hủy bàn</Button>
                    <Button buttonColor="blue" mode="contained" style={styles.cancelButton} onPress={() => openDeleteFoodModal(item)}>Xóa món</Button>
                </View>
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

            console.log("Food item successfully deleted from both Appointments and Services!");
            setModalVisible(false);
        } catch (error) {
            console.error("Error deleting food item:", error);
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

                            console.log("Appointment successfully deleted!");
                            navigation.navigate("Appointments");
                        } catch (error) {
                            console.error("Error deleting appointment:", error);
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
        <View style={{ flex: 1 }}>
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
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Chọn món ăn bạn muốn xóa khỏi bàn:</Text>
                        {selectedAppointment.food && selectedAppointment.food.length > 0 ? (
                            <FlatList
                                data={selectedAppointment.food}
                                renderItem={({ item, index }) => (
                                    <TouchableHighlight
                                        style={styles.foodItem}
                                        onPress={() => handleDeleteFood(item, index)}
                                    >
                                        <Text style={styles.foodText}>{item.title}</Text>
                                    </TouchableHighlight>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        ) : (
                            <Text style={styles.noFoodText}>Chưa đặt món</Text>
                        )}
                        <TouchableHighlight
                            style={styles.closeButton}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Text style={styles.textStyle}>Đóng</Text>
                        </TouchableHighlight>
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    headerText: {
        padding: 15,
        fontSize: 25,
        fontWeight: "bold"
    },
    itemContainer: {
        margin: 10,
        padding: 15,
        borderRadius: 15,
        marginVertical: 5,
        backgroundColor: '#e0e0e0'
    },
    itemTitle: {
        marginTop: 10,
        fontSize: 20,
        fontWeight: "bold",
    },
    itemPrice: {
        fontSize: 20,
        color: 'green',
    },
    itemState: {
        fontSize: 20,
        color: 'gray',
    },
    cancelButton: {
        marginLeft: 10,
        margin: 5
    },
    itemContent: {
        alignItems: 'left',
        marginBottom: 10,
        marginLeft: 20
    },
    modalView: {
        margin: 20,
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
    foodItem: {
        padding: 10,
        margin: 5,
        backgroundColor: "#f0f0f0",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    foodText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    noFoodText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginVertical: 10,
    },
});

export default Appointments;
