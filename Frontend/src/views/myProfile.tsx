import React from 'react';
import { View, Text, ScrollView, Button, StyleSheet } from 'react-native';
import { Avatar, Card } from '@ui-kitten/components';
import { IUser, User } from '../models/user_model';



export const MyProfile = ({ navigation, route }: { navigation: any, route: any }) => {
    console.log("route: ", route);
    const { user } = route.params;

    // Ensuring the user object exists before creating a User instance
    const userModel = user ? new User(user) : null;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Avatar
                    size='giant'
                    source={{ uri: user ? user.profilePicture : require('../../assets/default_avatar.png') }} 
                    style={styles.avatar}
                />
                <Text style={styles.name}>{userModel ? userModel.getFullName() : 'Loading...'}</Text>
                <Text style={styles.email}>{user ? user.email : 'Loading...'}</Text>
            </View>

            <Card style={styles.card}>
                <Text style={styles.cardTitle}>Car Details</Text>
                <Text>Car Type: {user ? user.carType : 'N/A'}</Text>
                <Text>Level: {user ? user.level : 'N/A'}</Text>
                <Text>Points: {user ? user.points : 'N/A'}</Text>
            </Card>

            <View style={styles.actions}>
                <Button title="Edit Profile" onPress={() => {}} />
                <Button title="Change Password" onPress={() => {}} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f7f7f7',
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        marginBottom: 10,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    email: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    card: {
        margin: 15,
        padding: 10,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: 20,
    },
});

export default MyProfile;
