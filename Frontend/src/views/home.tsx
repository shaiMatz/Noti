import React from 'react';
import {MenuItem,OverflowMenu,IconElement,TopNavigationAction, Avatar,Button, Divider, Layout, Text,TopNavigation } from '@ui-kitten/components';
import { SafeAreaView, View,  StyleSheet, Image,TouchableOpacity } from 'react-native';
import { Icon } from '@ui-kitten/components'
import {useAuth} from '../context/AuthContext';

const MenuIcon = (props:any): IconElement => (
  <Icon
  style={{width:15,height:15,marginRight:5}} fill="#8F9BB3"
    name='more-vertical'
  />
);

const InfoIcon = (props:any): IconElement => (
  <Icon
  style={{width:15,height:15,marginRight:5}} fill="#8F9BB3"
    name='info'
  />
);

const LogoutIcon = (props:any): IconElement => (
  <Icon
  style={{width:15,height:15,marginRight:5}} fill="#8F9BB3"
    name='log-out'
  />
);
export const HomeScreen = (route:any,{ navigation }: { navigation: any }) => {
  const { userId } = route.params;
  const [menuVisible, setMenuVisible] = React.useState(false);
  const {onLogout} = useAuth();

  const logout = async() => {
    console.log("Logout function");
    const result = await onLogout!();
    if(result&&result.error){
      console.log("Logout failed");
      return
    }else{
      console.log("Logout successful");
      navigation.navigate('Login');
    }
  };

  const toggleMenu = (): void => {
    setMenuVisible(!menuVisible);
  };

  const renderMenuAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={toggleMenu}
    />
  );
  const renderOverflowMenuAction = (): React.ReactElement => (
    <OverflowMenu
      anchor={renderMenuAction}
      visible={menuVisible}
      onBackdropPress={toggleMenu}
    >
      <MenuItem
        accessoryLeft={InfoIcon}
        title='About'
        onPress={navigateDetails}
      />
      <MenuItem
        accessoryLeft={LogoutIcon}
        title='Logout'
        onPress={logout}
      />
    </OverflowMenu>
  );
  const navigateDetails = () => {
    navigation.navigate('Details');
  };
  const renderTitle = (props:any): React.ReactElement => (
    <View style={styles.titleContainer}>
      <Avatar
        style={styles.logo}
        source={require('../../assets/logo.png')}
      />
      <Text {...props}>Noti</Text>
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
    
            <TopNavigation style={styles.header}
      title={renderTitle}
      accessoryRight={renderOverflowMenuAction}
    />     


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
  header: {
    top:50 ,
    backgroundColor: '#fff',

  },
  container: {
    flex: 1,
    alignItems: 'center',
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    marginHorizontal: 16,
  },
  });