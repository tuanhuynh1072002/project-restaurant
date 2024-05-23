import React, { useState, useEffect } from "react";
import { View, FlatList, Alert, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import auth from '@react-native-firebase/auth';

const Customers = ({ navigation }) => {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('USERS')
            .where('role', '==', 'customer')
            .onSnapshot(querySnapshot => {
                const customersData = [];
                querySnapshot.forEach(documentSnapshot => {
                    customersData.push({
                        ...documentSnapshot.data(),
                        id: documentSnapshot.id,
                    });
                });
                setCustomers(customersData);
            });

        return () => unsubscribe();
    }, []);

    const handleUpdate = (customersData) => {
        navigation.navigate("UserUpdate", { customersData });
    };

    const handleDelete = (customersData) => {
        Alert.alert(
            "Cảnh báo",
            "Bạn có chắc chắn muốn xóa khách hàng này không? Thao tác này không thể hoàn tác",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xóa",
                    onPress: async () => {
                        try {
                            const user = await auth().getUser(customersData.id);
                            await user.delete();
                        } catch (error) {
                            console.error("Lỗi khi xóa khách hàng:", error);
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };

    const handleDetail = (customersData) => {
        navigation.navigate("UserDetail", { customersData });
    };

    const renderItem = ({ item }) => (
        <Menu>
            <MenuTrigger>
                <View style={styles.customerContainer}>
                    <Text style={styles.customerText}>Email: {item.email} | Password: {item.password}</Text>
                </View>
            </MenuTrigger>
            <MenuOptions>
                <MenuOption onSelect={() => handleUpdate(item)}>
                    <Text>Cập nhật</Text>
                </MenuOption>
                <MenuOption onSelect={() => handleDelete(item)}>
                    <Text>Xóa khách hàng</Text>
                </MenuOption>
                <MenuOption onSelect={() => handleDetail(item)}>
                    <Text>Thông tin</Text>
                </MenuOption>
            </MenuOptions>
        </Menu>
    );

    return (
        <View style={{ flex: 1 }}>
            <Text style={styles.headerText}>Customers</Text>
            <FlatList
                data={customers}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    customerContainer: {
        margin: 10,
        padding: 15,
        borderRadius: 15,
        marginVertical: 5,
        backgroundColor: '#e0e0e0',
    },
    customerText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    headerText: {
        padding: 15,
        fontSize: 25,
        fontWeight: "bold",
    },
});

export default Customers;
