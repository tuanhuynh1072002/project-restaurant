import React, { useState, useEffect } from "react";
import { View, FlatList, Alert, StyleSheet } from "react-native";
import { Text, Appbar, Card, Menu, Button } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import { Menu as PopupMenu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
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
        <PopupMenu>
            <MenuTrigger>
                <Card style={styles.customerContainer}>
                    <Card.Content>
                        <Text style={styles.customerText}>Email: {item.email}</Text>
                        <Text style={styles.customerText}>Password: {item.password}</Text>
                    </Card.Content>
                </Card>
            </MenuTrigger>
            <MenuOptions>
                <MenuOption onSelect={() => handleUpdate(item)}>
                    <Text style={styles.menuText}>Cập nhật</Text>
                </MenuOption>
                <MenuOption onSelect={() => handleDelete(item)}>
                    <Text style={[styles.menuText, { color: 'red' }]}>Xóa khách hàng</Text>
                </MenuOption>
                <MenuOption onSelect={() => handleDetail(item)}>
                    <Text style={styles.menuText}>Thông tin</Text>
                </MenuOption>
            </MenuOptions>
        </PopupMenu>
    );

    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header>
                <Appbar.Content title="Customers" />
            </Appbar.Header>
            <FlatList
                data={customers}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    customerContainer: {
        margin: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        elevation: 3,
    },
    customerText: {
        fontSize: 16,
    },
    menuText: {
        fontSize: 18,
        padding: 10,
    },
    listContent: {
        padding: 10,
    },
});

export default Customers;
