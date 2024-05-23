import React from "react"
import { View, Image } from "react-native"
import { Text } from "react-native-paper"

const UserDetail = ({ route }) => {
    const { customersData } = route.params;

    return (
        <View style={{ padding: 10 }}>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Email: </Text>
                <Text style={{ fontSize: 20 }}>{customersData.email}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Mật khẩu: </Text>
                <Text style={{ fontSize: 20 }}>{customersData.password}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Họ tên: </Text>
                <Text style={{ fontSize: 20 }}>{customersData.fullName}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Địa chỉ: </Text>
                <Text style={{ fontSize: 20 }}>{customersData.address}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Số điện thoại: </Text>
                <Text style={{ fontSize: 20 }}>{customersData.phone}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Vai trò: </Text>
                <Text style={{ fontSize: 20 }}>{customersData.role}</Text>
            </View>
        </View>
    )
}

export default UserDetail;
