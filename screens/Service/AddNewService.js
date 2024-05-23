import React, { useState } from "react"
import { View, Image, ScrollView, KeyboardAvoidingView } from "react-native"
import { Text, TextInput, Button } from "react-native-paper"
import firestore from '@react-native-firebase/firestore'
import storage from "@react-native-firebase/storage"
import ImagePicker from "react-native-image-crop-picker"
import { useMyContextProvider } from "../../index"
import { Picker } from '@react-native-picker/picker'

const AddNewService = ({ navigation }) => {
    const [controller, dispatch] = useMyContextProvider()
    const { userLogin } = controller
    const [imagePath, setImagePath] = useState('')
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')
    const [image, setImage] = useState('')
    const [state, setState] = useState('')
    const [category, setCategory] = useState('Bàn 2 người')
    const SERVICES = firestore().collection("Services")

    const handleAddNewService = () => {
        SERVICES.add({
            title,
            price,
            create: userLogin.email,
            state: 'Trống',
            category
        })
        .then(response => {
            const refImage = storage().ref("/services/" + response.id + ".png");
            refImage.putFile(imagePath)
            .then(() =>
                refImage.getDownloadURL()
                .then(link => {
                    SERVICES.doc(response.id).update({
                        id: response.id, 
                        image: link
                    });
                    navigation.navigate("Services");
                })
            )
            .catch(e => console.log(e.message));
        });
    }

    const handleUploadImage = () => {
        ImagePicker.openPicker({
            mediaType: "photo",
            width: 400,
            height: 300
        })
        .then(image => setImagePath(image.path))
        .catch(e => console.log(e.message))
    }

    return (
        <KeyboardAvoidingView
      style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView style={{ padding: 10 }}>
                <Button textColor="black" buttonColor="pink" style={{ margin: 10 }} mode="contained" onPress={handleUploadImage}>
                    Thêm hình ảnh
                </Button>
                {imagePath !== "" && (
                    <Image
                        source={{ uri: imagePath }}
                        style={{ height: 200 }}
                    />
                )}
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Tên bàn:</Text>
                <TextInput
                    placeholder="Bàn 1, Bàn 2, Bàn Vip, v.v..."
                    value={title}
                    onChangeText={setTitle}
                    style={{ marginBottom: 10, borderWidth: 1, borderColor: '#ccc' }}
                />
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Giá đặt bàn:</Text>
                <TextInput
                    placeholder="Ví dụ: 100000, 200000, v.v..."
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                    style={{ marginBottom: 10, borderWidth: 1, borderColor: '#ccc' }}
                />
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Loại bàn:</Text>
                <Picker
                    selectedValue={category}
                    onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
                    style={{ marginBottom: 10, borderWidth: 1, borderColor: '#ccc' }}
                >
                    <Picker.Item color="#FF8C00" label="Bàn 2 người" value="Bàn 2 người" />
                    <Picker.Item color="#FF8C00" label="Bàn 4 người" value="Bàn 4 người" />
                    <Picker.Item color="#FF8C00" label="Bàn 8 người" value="Bàn 8 người" />
                    <Picker.Item color="#FF8C00" label="Bàn 12 người" value="Bàn 12 người" />
                    <Picker.Item color="#FF8C00" label="Bàn 20 người" value="Bàn 20 người" />
                </Picker>
                <Button buttonColor="pink" textColor="black" mode="contained" onPress={handleAddNewService}>Thêm bàn</Button>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default AddNewService;
