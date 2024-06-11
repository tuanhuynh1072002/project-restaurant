import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

const ServiceDetailCustomer = ({ route }) => {
    const { appointmentsData } = route.params;

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <View style={styles.item}>
                    <Text style={styles.label}>Tên bàn:</Text>
                    <Text style={styles.value}>{appointmentsData.title}</Text>
                </View>
                <View style={styles.item}>
                    <Text style={styles.label}>Tổng giá:</Text>
                    <Text style={[styles.value, styles.red]}>{parseFloat(appointmentsData.price).toLocaleString()} ₫</Text>
                </View>
                <View style={styles.item}>
                    <Text style={styles.label}>Loại bàn:</Text>
                    <Text style={styles.value}>{appointmentsData.category}</Text>
                </View>
                <View style={styles.item}>
                    <Text style={styles.label}>Tình trạng:</Text>
                    <Text style={styles.value}>{appointmentsData.state}</Text>
                </View>
                <View style={styles.item}>
                    <Text style={styles.label}>Người đặt:</Text>
                    <Text style={styles.value}>{appointmentsData.orderBy}</Text>
                </View>
                <View style={{...styles.item, flexDirection:"column"}}>
                    <Text style={styles.label}>Thông tin:</Text>
                    <Text style={styles.value}>{appointmentsData.orderInfo}</Text>
                </View>
                <View style={styles.item}>
                    <Text style={styles.label}>Ngày đặt:</Text>
                    <Text style={styles.value}>
                        {appointmentsData.datetime ? new Date(appointmentsData.datetime.seconds * 1000).toLocaleString() : "Chưa đặt"}
                    </Text>
                </View>
                <View style={styles.item}>
                    <Text style={styles.label}>Ghi chú:</Text>
                    <Text style={styles.value}>{appointmentsData.note}</Text>
                </View>
                <View style={[styles.item, styles.foodSection]}>
                    <Text style={styles.label}>Món ăn:</Text>
                    <View>
                        {appointmentsData.food && appointmentsData.food.length > 0 ? (
                            appointmentsData.food.map((food, index) => (
                                <Text key={index} style={styles.foodItem}>
                                    {food.title} <Text style={styles.red}>({parseFloat(food.price).toLocaleString()} ₫)</Text>
                                </Text>
                            ))
                        ) : (
                            <Text style={styles.value}>Trống</Text>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#f8f8f8",
    },
    section: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 10,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    item: {
        flexDirection: "row",
        marginBottom: 5,
    },
    label: {
        fontSize: 20,
        fontWeight: "bold",
        width: 120,
    },
    value: {
        fontSize: 20,
    },
    red: {
        color: "red",
    },
    foodSection: {
        flexDirection: "column",
        marginBottom: 0,
    },
    foodItem: {
        fontSize: 20,
    },
});

export default ServiceDetailCustomer;
