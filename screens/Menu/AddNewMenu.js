import React, { useState } from "react";
import { View, Image, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import ImagePicker from "react-native-image-crop-picker";
import { useMyContextProvider } from "../../index";
import { Picker } from "@react-native-picker/picker";

const AddNewMenu = ({ navigation }) => {
    const [controller] = useMyContextProvider();
    const { userLogin } = controller;
    const [imagePath, setImagePath] = useState("");
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [infoMenu, setInfoMenu] = useState("");
    const [category, setCategory] = useState("Tráng miệng");
    const MENUS = firestore().collection("Menus");

    const handleAddNewMenu = () => {
        if (!title || !price || !infoMenu || !imagePath) {
            alert("Please fill all the fields and add an image");
            return;
        }

        MENUS.add({
            title,
            infoMenu,
            price,
            create: userLogin.email,
            category,
        })
        .then(response => {
            const refImage = storage().ref("/menus/" + response.id + ".png");
            refImage.putFile(imagePath)
            .then(() =>
                refImage.getDownloadURL()
                .then(link => {
                    MENUS.doc(response.id).update({
                        id: response.id,
                        image: link
                    });
                    navigation.navigate("Services");
                    navigation.navigate("Menu");
                })
            )
            .catch(e => console.log(e.message));
        });
    };

    const handleUploadImage = () => {
        ImagePicker.openPicker({
            mediaType: "photo",
            width: 400,
            height: 300,
        })
        .then(image => setImagePath(image.path))
        .catch(e => console.log(e.message));
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScrollView style={{ padding: 10 }}>
                <Button textColor="black" buttonColor="pink" style={{ margin: 10 }} mode="contained" onPress={handleUploadImage}>
                    Upload Image
                </Button>
                {imagePath !== "" && (
                    <Image source={{ uri: imagePath }} style={{ height: 200 }} />
                )}
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Tên món ăn:</Text>
                <TextInput
                    placeholder="Cơm chiên, Salad, v.v..."
                    value={title}
                    onChangeText={setTitle}
                    style={{ marginBottom: 10, borderWidth: 1, borderColor: "#ccc" }}
                />
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Thông tin món ăn:</Text>
                <TextInput
                    placeholder="v.v..."
                    value={infoMenu}
                    onChangeText={setInfoMenu}
                    style={{ marginBottom: 10, borderWidth: 1, borderColor: "#ccc" }}
                />
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Giá món ăn:</Text>
                <TextInput
                    placeholder="0"
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                    style={{ marginBottom: 10, borderWidth: 1, borderColor: "#ccc" }}
                />
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Loại món ăn:</Text>
                <Picker
                    selectedValue={category}
                    onValueChange={(itemValue) => setCategory(itemValue)}
                    style={{ marginBottom: 10, borderWidth: 1, borderColor: "#ccc" }}
                >
                    <Picker.Item color="#FF8C00" label="Tráng miệng" value="Tráng miệng" />
                    <Picker.Item color="#FF8C00" label="Món chính" value="Món chính" />
                    <Picker.Item color="#FF8C00" label="Đồ uống" value="Đồ uống" />
                </Picker>
                <Button buttonColor="pink" textColor="black" mode="contained" onPress={handleAddNewMenu}>
                    Thêm món ăn
                </Button>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default AddNewMenu;
