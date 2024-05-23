import React, { useState } from "react";
import { View, Image, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Text, TextInput, Button } from "react-native-paper";
import firestore from '@react-native-firebase/firestore';
import storage from "@react-native-firebase/storage";
import ImagePicker from "react-native-image-crop-picker";
import { Picker } from '@react-native-picker/picker';

const MenuUpdate = ({ route, navigation }) => {
    const { menu } = route.params;
    const [title, setTitle] = useState(menu.title);
    const [price, setPrice] = useState(menu.price);
    const [infoMenu, setInfomenu] = useState(menu.infoMenu);
    const [imagePath, setImagePath] = useState(menu.image);

    const handleUpdateMenu = async () => {
        try {
            const updateData = {
                title: title,
                price: price,
                infoMenu: infoMenu,
            };

            await firestore()
                .collection('Menus')
                .doc(menu.id)
                .update(updateData);

            if (imagePath !== menu.image) {
                const refImage = storage().ref(`/menus/${menu.id}.png`);
                await refImage.putFile(imagePath);
                const imageLink = await refImage.getDownloadURL();
                await firestore()
                    .collection('Menus')
                    .doc(menu.id)
                    .update({
                        image: imageLink
                    });
                }

            navigation.navigate("Menu");
        } catch (error) {
            console.error("Lỗi khi cập nhật món:", error);
        }
    }

    const handleUploadImage = () => {
        ImagePicker.openPicker({
            mediaType: "photo",
            width: 400,
            height: 300
        })
        .then(image =>
            setImagePath(image.path)
        )
        .catch(e => console.log(e.message));
    }

    return (
        <KeyboardAvoidingView
      style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView style={{ padding: 10 }}>
                {imagePath !== "" &&
                    <Image source={{ uri: imagePath }} style={{ height: 200 }} />
                }
                <Button style={{ margin: 20 }} buttonColor="pink" textColor="black" mode="contained" onPress={handleUploadImage}>
                    Thay đổi hình ảnh
                </Button>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Tên món: </Text>
                <TextInput
                    style={{ marginBottom: 10, borderWidth: 1, borderColor: '#ccc', padding: 5 }}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Input a menu name"
                />
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Thông tin món ăn: </Text>
                <TextInput
                    style={{ marginBottom: 10, borderWidth: 1, borderColor: '#ccc', padding: 5 }}
                    value={infoMenu}
                    onChangeText={setInfomenu}
                    placeholder="Input a menu name"
                />
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Giá: </Text>
                <TextInput
                    style={{ marginBottom: 10, borderWidth: 1, borderColor: '#ccc', padding: 5 }}
                    value={price}
                    onChangeText={setPrice}
                    placeholder="0"
                    keyboardType="numeric"
                />
                <Button buttonColor="pink" textColor="black" mode="contained" onPress={handleUpdateMenu}>
                    Cập nhật
                </Button>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default MenuUpdate;
