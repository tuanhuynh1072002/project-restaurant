import React from "react"
import { View, Image } from "react-native"
import { Text } from "react-native-paper"

const MenuDetail = ({ route }) => {
    const { menu } = route.params;

    return (
        <View style={{ padding: 10 }}>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Tên món: </Text>
                <Text style={{ fontSize: 20 }}>{menu.title}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Tạo bởi: </Text>
                <Text style={{ fontSize: 20 }}>{menu.create}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Giá: </Text>
                <Text style={{ fontSize: 20, color: "red" }}>{parseFloat(menu.price).toLocaleString()} ₫</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Loại: </Text>
                <Text style={{ fontSize: 20 }}>{menu.category}</Text>
            </View>
            {menu.image ? (
                <View style={{ marginBottom: 5 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Hình ảnh: </Text>
                    <Image
                        source={{ uri: menu.image }}
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
            <View style={{ flexDirection: 'column' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Thông tin món ăn: </Text>
                <Text style={{ fontSize: 20 }}>{menu.infoMenu}</Text>
            </View>
        </View>
    )
}

export default MenuDetail;
