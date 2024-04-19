import React from 'react';
import { Button, Divider, Layout, Text,TopNavigation } from '@ui-kitten/components';
import { SafeAreaView, View,  StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Icon } from '@ui-kitten/components'
export const HomeScreen = ({ navigation }: { navigation: any }) => {

  const navigateDetails = () => {
    navigation.navigate('Details');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          style={styles.profilePic}
          source={{ uri: 'https://randomuser.me/api/portraits' }}
        />
        <Text style={styles.greeting}>Hello, Aliya</Text>
        <Text style={styles.address}>1177 Californian Dr, San Jose, CA 95125, USA</Text>
      </View>

    
      <View style={styles.controlContainer}>
        <TouchableOpacity style={styles.controlButton}>
          <Icon name='unlock' fill='#000' style={styles.icon} />
          <Text>Unlock Doors</Text>
        </TouchableOpacity>
      </View>
      <Image
        style={styles.carImage}
        source={require("../../assets/car9.png")}
      />

      <View style={styles.footer}>
        <Text style={styles.chargeText}>Charge 15%</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  profileContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  address: {
    fontSize: 16,
    color: '#666',
    marginTop: 5
  },
  carImage: {
  width: 600,
  height: 300,
  marginTop: 20,
  },
  controlContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  padding: 10,
  },
  controlButton: {
  alignItems: 'center',
  backgroundColor: '#f0f0f0',
  borderRadius: 10,
  padding: 15,
  marginHorizontal: 10,
  },
  icon: {
  width: 32,
  height: 32,
  },
  footer: {
  width: '100%',
  padding: 20,
  borderTopWidth: 1,
  borderTopColor: '#e0e0e0',
  alignItems: 'center',
  backgroundColor: '#fafafa',
  },
  chargeText: {
  fontSize: 18,
  color: '#333',
  },
  });