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

    return (
        <ScrollView style={{ padding: 10 }}>
            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Tên bàn: </Text>
                <Text style={{ fontSize: 20 }}>{service.title || "Trống"}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Tạo bởi: </Text>
                <Text style={{ fontSize: 20 }}>{service.create || "Trống"}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Giá thuê bàn: </Text>
                <Text style={{ fontSize: 20, color: "red" }}>{service.price ? parseFloat(service.price).toLocaleString() : "Trống"} ₫</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Loại bàn: </Text>
                <Text style={{ fontSize: 20 }}>{service.category || "Trống"}</Text>
            </View>
            {service.image ? (
                <View style={{ marginBottom: 5 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Hình ảnh: </Text>
                    <Image
                        source={{ uri: service.image }}
                        style={{ height: 300, width: '100%' }}
                        resizeMode="contain"
                    />
                </View>
            ) : (
                <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Hình ảnh: </Text>
                    <Text style={{ fontSize: 20 }}>Trống</Text>
                </View>
            )}
            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Tình trạng: </Text>
                <Text style={{ fontSize: 20 }}>{service.state || "Trống"}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Người đặt: </Text>
                <Text style={{ fontSize: 20 }}>{service.orderBy || "Chưa có người đặt"}</Text>
            </View>
            <View style={{ flexDirection: 'column', marginBottom: 5 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Thông tin: </Text>
                <Text style={{ fontSize: 20 }}>{service.orderInfo || "Trống"}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Ngày đặt: </Text>
                <Text style={{ fontSize: 20 }}>
                    {service.datetime ? new Date(service.datetime.seconds * 1000).toLocaleString() : "Trống"}
                </Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Ghi chú: </Text>
                <Text style={{ fontSize: 20 }}>{service.note || "Trống"}</Text>
            </View>
            <View style={{ marginBottom: 5 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Món ăn: </Text>
                {service.foods && service.foods.length > 0 ? (
                    service.foods.map((food, index) => (
                        <View key={index}>
                            <Text style={{ fontSize: 20 }}>
                                {food.title} <Text style={{color: "red"}}>({parseFloat(food.price).toLocaleString()} ₫)</Text>
                            </Text>
                        </View>
                    ))
                ) : (
                    <Text style={{ fontSize: 20 }}>Trống</Text>
                )}
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Tổng đơn đặt: </Text>
                <Text style={{ fontSize: 20, color: "green" }}>{parseFloat(totalPrice).toLocaleString()} ₫</Text>
            </View>
        </ScrollView>
    );
};

export default ServiceDetail;
