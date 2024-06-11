import React from "react";
import { View, Image, ScrollView } from "react-native";
import { Text } from "react-native-paper";

const ServiceDetail = ({ route }) => {
    const { service } = route.params;

    const sumArray = (arr) => {
        return arr.reduce((total, num) => total + parseFloat(num), 0);
    };
    const totalFoodPrice = service.foods ? sumArray(service.foods.map(food => food.price)) : 0;
    const totalPrice = parseFloat(service.price) + totalFoodPrice;

    const styles = {
        container: {
            flex: 1,
            padding: 15,
            backgroundColor: "#f0f0f0",
        },
        section: {
            backgroundColor: "#fff",
            borderRadius: 10,
            padding: 20,
            marginBottom: 15,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 3,
            borderLeftWidth: 5,
            borderLeftColor: "#4CAF50"
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
        },
        label: {
            fontSize: 18,
            fontWeight: 'bold',
            color: "#333",
        },
        value: {
            fontSize: 18,
            color: "#555",
        },
        redText: {
            color: "red",
        },
        greenText: {
            color: "green",
        },
        image: {
            height: 200,
            width: '100%',
            borderRadius: 10,
            marginTop: 10,
        },
        sectionHeader: {
            fontSize: 22,
            fontWeight: 'bold',
            color: "#4CAF50",
            marginBottom: 15,
        },
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>Thông tin bàn</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Tên bàn:</Text>
                    <Text style={styles.value}>{service.title || "Trống"}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Tạo bởi:</Text>
                    <Text style={styles.value}>{service.create || "Trống"}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Giá thuê bàn:</Text>
                    <Text style={[styles.value, styles.redText]}>
                        {service.price ? parseFloat(service.price).toLocaleString() : "Trống"} ₫
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Loại bàn:</Text>
                    <Text style={styles.value}>{service.category || "Trống"}</Text>
                </View>
                {service.image ? (
                    <View>
                        <Text style={styles.label}>Hình ảnh:</Text>
                        <Image
                            source={{ uri: service.image }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    </View>
                ) : (
                    <View style={styles.row}>
                        <Text style={styles.label}>Hình ảnh:</Text>
                        <Text style={styles.value}>Trống</Text>
                    </View>
                )}
                <View style={styles.row}>
                    <Text style={styles.label}>Tình trạng:</Text>
                    <Text style={styles.value}>{service.state || "Trống"}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Người đặt:</Text>
                    <Text style={styles.value}>{service.orderBy || "Chưa có người đặt"}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Ngày đặt:</Text>
                    <Text style={styles.value}>
                        {service.datetime ? new Date(service.datetime.seconds * 1000).toLocaleString() : "Trống"}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Ghi chú:</Text>
                    <Text style={styles.value}>{service.note || "Trống"}</Text>
                </View>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>Món ăn</Text>
                {service.foods && service.foods.length > 0 ? (
                    service.foods.map((food, index) => (
                        <View key={index} style={styles.row}>
                            <Text style={styles.value}>
                                {food.title} <Text style={styles.redText}>({parseFloat(food.price).toLocaleString()} ₫)</Text>
                            </Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.value}>Trống</Text>
                )}
            </View>
            <View style={styles.section}>
                <View style={styles.row}>
                    <Text style={styles.label}>Tổng đơn đặt:</Text>
                    <Text style={[styles.value, styles.greenText]}>
                        {parseFloat(totalPrice).toLocaleString()} ₫
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};

export default ServiceDetail;
