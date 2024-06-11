import React, { useState, useEffect } from "react";
import { Image, View, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Text, TextInput } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';

const ServicesCustomer = ({ navigation }) => {
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
            onPress={() => handleAppointment(item)}
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
                    <Text style={[styles.itemState, { color: item.state === "Đã đặt" ? "red" : "black" }]}>{item.state}</Text>
                </View>   
                </MenuTrigger>
                <MenuOptions>
                    <MenuOption onSelect={() => handleAppointment(item)}>
                        <Text>Đặt bàn</Text>
                    </MenuOption>
                </MenuOptions>
            </Menu>
        </TouchableOpacity>
    );

    const handleAppointment = (service) => {
        navigation.navigate("Appointment", { service });
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

export default ServicesCustomer;
