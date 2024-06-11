import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Card, Avatar } from "react-native-paper";

const UserDetail = ({ route }) => {
    const { customersData } = route.params;

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Email: </Text>
                        <Text style={styles.value}>{customersData.email}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Mật khẩu: </Text>
                        <Text style={styles.value}>{customersData.password}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Họ tên: </Text>
                        <Text style={styles.value}>{customersData.fullName}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Địa chỉ: </Text>
                        <Text style={styles.value}>{customersData.address}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Số điện thoại: </Text>
                        <Text style={styles.value}>{customersData.phone}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Vai trò: </Text>
                        <Text style={styles.value}>{customersData.role}</Text>
                    </View>
                </Card.Content>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '100%',
        borderRadius: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    avatar: {
        backgroundColor: '#6200ee',
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 15,
        alignItems: 'center',
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    value: {
        fontSize: 18,
        color: '#555',
        flex: 2,
    },
});

export default UserDetail;
