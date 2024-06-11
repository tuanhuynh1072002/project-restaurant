import React, { useState, useEffect } from "react";
import { Image, View, FlatList, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { IconButton, Text, TextInput } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';

const Services = ({ navigation }) => {
    const [initialServices, setInitialServices] = useState([]);
    const [services, setServices] = useState([]);
    const [name, setName] = useState('');

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('Services')
            .onSnapshot(querySnapshot => {
                const services = [];
                querySnapshot.forEach(documentSnapshot => {
                    services.push({
                        ...documentSnapshot.data(),
                        id: documentSnapshot.id,
                    });
                });

                services.sort((a, b) => (a.state === "Đã đặt" ? -1 : 1));

                setServices(services);
                setInitialServices(services);
            });

        return () => unsubscribe();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.itemContainer}
        >
            <Menu>
                <MenuTrigger>
                <View style={styles.itemContent}>
                {item.image ? (
                    <Image
                        source={{ uri: item.image }}
                        style={styles.itemImage}
                        resizeMode="cover"
                    />
                ) : (
                    <Image
                        source={require('../assets/placeholder.png')}
                        style={styles.itemImage}
                        resizeMode="cover"
                    />
                )}
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemPrice}>{parseFloat(item.price).toLocaleString()} ₫</Text>
                <Text>{item.category}</Text>
                <Text style={[styles.itemState, { color: item.state === "Đã đặt" ? "red" : "black" }]}>{item.state}</Text>
                </View>
                </MenuTrigger>
                <MenuOptions>
                    <MenuOption onSelect={() => handleUpdate(item)}>
                        <Text>Cập nhật</Text>
                    </MenuOption>
                    <MenuOption onSelect={() => handleDelete(item)}>
                        <Text>Xóa bàn</Text>
                    </MenuOption>
                    <MenuOption onSelect={() => handleDetail(item)}>
                        <Text>Thông tin</Text>
                    </MenuOption>
                </MenuOptions>
            </Menu>
        </TouchableOpacity>
    );

    const handleUpdate = async (service) => {
        try {
            navigation.navigate("ServiceUpdate", { service });
        } catch (error) {
            console.error("Lỗi khi cập nhật bàn:", error);
        }
    }

    const handleDelete = (service) => {
        Alert.alert(
            "Cảnh báo",
            "Bạn có chắc chắn muốn xóa? Hành động này sẽ không được hoàn tác",
            [
                {
                    text: "Hủy",
                    style: "cancel"
                },
                {
                    text: "Xóa",
                    onPress: () => {
                        firestore()
                            .collection('Services')
                            .doc(service.id)
                            .delete()
                            .then(() => {
                                Alert.alert("Bàn đã được xóa thành công!");
                                navigation.navigate("Services");
                            })
                            .catch(error => {
                                console.error("Lỗi khi xóa bàn:", error);
                            });
                    },
                    style: "default"
                }
            ]
        )
    }

    const handleDetail = (service) => {
        navigation.navigate("ServiceDetail", { service });
    }

    return (
        <View style={{ flex: 1 }}>
            <Image source={require("../assets/logo.png")}
                style={styles.logo}
            />
            <TextInput
                label={"Tìm bàn"}
                value={name}
                onChangeText={(text) => {
                    setName(text);
                    const result = initialServices.filter(service => service.title.toLowerCase().includes(text.toLowerCase()));
                    setServices(result);
                }}
                style={styles.searchInput}
            />
            <View style={styles.header}>
                <Text style={styles.headerText}>
                    Danh sách bàn
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate("AddNewService")}>
                    <Image source={require('../assets/add.png')} style={styles.addButton} />
                </TouchableOpacity>
            </View>
            <FlatList
                data={services}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                numColumns={2}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    logo: {
        alignSelf: "center",
        marginVertical: 20,
    },
    searchInput: {
        marginHorizontal: 15,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        marginBottom: 10,
    },
    headerText: {
        fontSize: 25,
        fontWeight: "bold",
    },
    addButton: {
        width: 30,
        height: 30,
        margin: 20,
    },
    itemContainer: {
        flex: 1,
        margin: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 15,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemContent: {
        padding: 15,
        alignItems: 'center',
    },
    itemImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    itemTitle: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: "bold",
    },
    itemPrice: {
        fontSize: 16,
        color: 'green',
    },
    itemState: {
        fontSize: 16,
        color: 'gray',
    },
});

export default Services;
