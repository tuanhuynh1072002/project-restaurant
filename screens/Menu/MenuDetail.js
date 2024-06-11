import React from "react";
import { View, Image, ScrollView, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

const MenuDetail = ({ route }) => {
    const { menu } = route.params;

    const styles = StyleSheet.create({
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
        image: {
            height: 300,
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
    });

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>Thông tin món ăn</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Tên món:</Text>
                    <Text style={styles.value}>{menu.title || "Trống"}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Tạo bởi:</Text>
                    <Text style={styles.value}>{menu.create || "Trống"}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Giá:</Text>
                    <Text style={[styles.value, styles.redText]}>
                        {menu.price ? parseFloat(menu.price).toLocaleString() : "Trống"} ₫
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Loại:</Text>
                    <Text style={styles.value}>{menu.category || "Trống"}</Text>
                </View>
                {menu.image ? (
                    <View>
                        <Text style={styles.label}>Hình ảnh:</Text>
                        <Image
                            source={{ uri: menu.image }}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    </View>
                ) : (
                    <View style={styles.row}>
                        <Text style={styles.label}>Hình ảnh:</Text>
                        <Text style={styles.value}>Trống</Text>
                    </View>
                )}
                <View style={{...styles.row, flexDirection:"column"}}>
                    <Text style={styles.label}>Thông tin món ăn:</Text>
                    <Text style={styles.value}>{menu.infoMenu || "Trống"}</Text>
                </View>
            </View>
        </ScrollView>
    );
};

export default MenuDetail;
