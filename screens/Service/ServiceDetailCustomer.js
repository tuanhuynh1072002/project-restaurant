import React from "react"
import { View, Image } from "react-native"
import { Text } from "react-native-paper"

const ServiceDetailCustomer = ({ route }) => {
    const { appointmentsData } = route.params;

    return (
        <View style={{ padding: 10 }}>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Tên bàn: </Text>
                <Text style={{ fontSize: 20 }}>{appointmentsData.title}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Tổng giá: </Text>
                <Text style={{ fontSize: 20, color: "red" }}>{parseFloat(appointmentsData.price).toLocaleString()} ₫</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Loại bàn: </Text>
                <Text style={{ fontSize: 20 }}>{appointmentsData.category}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Tình trạng: </Text>
                <Text style={{ fontSize: 20 }}>{appointmentsData.state}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Người đặt: </Text>
                <Text style={{ fontSize: 20 }}>{appointmentsData.orderBy}</Text>
            </View>
            <View style={{ flexDirection: 'column' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Thông tin: </Text>
                <Text style={{ fontSize: 20 }}>{appointmentsData.orderInfo}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Ngày đặt: </Text>
                <Text style={{ fontSize: 20 }}>
                    {appointmentsData.datetime ? new Date(appointmentsData.datetime.seconds * 1000).toLocaleString() : "Chưa đặt"}
                </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Ghi chú: </Text>
                <Text style={{ fontSize: 20 }}>{appointmentsData.note}</Text>
            </View>
            <View style={{ marginBottom: 5 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Món ăn: </Text>
                {appointmentsData.food && appointmentsData.food.length > 0 ? (
                    appointmentsData.food.map((food, index) => (
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
        </View>
    )
}

export default ServiceDetailCustomer;
