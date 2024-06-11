import React, { useState, useEffect } from "react";
import { Image, View, FlatList, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { Text, TextInput } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';

const Menus = ({ navigation }) => {
    const [initialMenus, setInitialMenus] = useState([]);
    const [menus, setMenus] = useState([]);
    const [name, setName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('Menus')
            .onSnapshot(querySnapshot => {
                const menus = [];
                querySnapshot.forEach(documentSnapshot => {
                    menus.push({
                        ...documentSnapshot.data(),
                        id: documentSnapshot.id,
                    });
                });
                menus.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                setMenus(menus);
                setInitialMenus(menus);
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
                </View>
                </MenuTrigger>
                <MenuOptions>
                    <MenuOption onSelect={() => handleUpdate(item)}>
                        <Text>Cập nhật</Text>
                    </MenuOption>
                    <MenuOption onSelect={() => handleDelete(item)}>
                        <Text>Xóa món</Text>
                    </MenuOption>
                    <MenuOption onSelect={() => handleDetail(item)}>
                        <Text>Thông tin</Text>
                    </MenuOption>
                </MenuOptions>
            </Menu>
        </TouchableOpacity>
    );

    const handleUpdate = async (menu) => {
        try {
            navigation.navigate("MenuUpdate", { menu });
        } catch (error) {
            console.error("Lỗi khi cập nhật món:", error);
        }
    }

    const handleDelete = (menu) => {
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
                            .collection('Menus')
                            .doc(menu.id)
                            .delete()
                            .then(() => {
                                Alert.alert("Món đã được xóa thành công!");
                                navigation.navigate("Menu");
                            })
                            .catch(error => {
                                console.error("Lỗi khi xóa món:", error);
                            });
                    },
                    style: "default"
                }
            ]
        )
    }

    const filterMenusByCategory = (category) => {
        if (selectedCategory === category) {
            setMenus(initialMenus);
            setSelectedCategory(null);
        } else {
            const filteredMenus = initialMenus.filter(menu => menu.category === category);
            setMenus(filteredMenus);
            setSelectedCategory(category);
        }
    };
    
    const handleDetail = (menu) => {
        navigation.navigate("MenuDetail", { menu });
    }

    return (
        <View style={{ flex: 1 }}>
            <Image source={require("../assets/logo.png")}
                style={styles.logo}
            />
            <TextInput
                label={"Tìm món"}
                value={name}
                onChangeText={(text) => {
                    setName(text);
                    const result = initialMenus.filter(menu => menu.title.toLowerCase().includes(text.toLowerCase()));
                    setMenus(result);
                }}
                style={styles.searchInput}
            />
            <View style={styles.categoriesContainer}>
                <TouchableOpacity 
                    onPress={() => filterMenusByCategory("Tráng miệng")} 
                    style={[
                        styles.categoryButton, 
                        selectedCategory === "Tráng miệng" && styles.selectedCategoryButton,
                        { width: '33%', flexDirection: "row" }
                    ]}
                >
                    <Image source={require("../assets/icecreamcup.png")} style={{height: 20, width: 20}}/>
                    <Text style={styles.categoryButtonText}>Tráng miệng</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => filterMenusByCategory("Món chính")} 
                    style={[
                        styles.categoryButton, 
                        selectedCategory === "Món chính" && styles.selectedCategoryButton,
                        { width: '30%', flexDirection: "row" }
                    ]}
                >
                    <Image source={require("../assets/tray.png")} style={{height: 20, width: 20}}/>
                    <Text style={styles.categoryButtonText}>Món chính</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => filterMenusByCategory("Đồ uống")} 
                    style={[
                        styles.categoryButton, 
                        selectedCategory === "Đồ uống" && styles.selectedCategoryButton,
                        { width: '30%', flexDirection: "row" }
                    ]}
                >
                    <Image source={require("../assets/soda.png")} style={{height: 20, width: 20}}/>
                    <Text style={styles.categoryButtonText}>Đồ uống</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.header}>
                <Text style={styles.headerText}>
                    Danh sách menu
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate("AddNewMenu")}>
                    <Image source={require('../assets/add.png')} style={styles.addButton} />
                </TouchableOpacity>
            </View>
            <FlatList
                data={menus}
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
        marginBottom: 20
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15
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
        margin: 5,
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
    categoriesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 0,
    },
    categoryButton: {
        backgroundColor: '#ccc',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 10,
    },
    selectedCategoryButton: {
        backgroundColor: '#888',
    },
    categoryButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
})

export default Menus;
