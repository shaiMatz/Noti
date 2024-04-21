import React, { useEffect, useState } from "react";
import {
  MenuItem,
  OverflowMenu,
  IconElement,
  TopNavigationAction,
  Avatar,
  Button,
  Text,
  TopNavigation,
} from "@ui-kitten/components";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Icon } from "@ui-kitten/components";
import { useAuth } from "../context/AuthContext";
import { getUser, deleteUser } from "../api/apiUser";
import { User } from "../models/user_model";

const MenuIcon = (props: any): IconElement => (
  <Icon
    style={{ width: 15, height: 15, marginRight: 5 }}
    fill="#8F9BB3"
    name="more-vertical"
  />
);

const InfoIcon = (props: any): IconElement => (
  <Icon
    style={{ width: 15, height: 15, marginRight: 5 }}
    fill="#8F9BB3"
    name="info"
  />
);

const LogoutIcon = (props: any): IconElement => (
  <Icon
    style={{ width: 15, height: 15, marginRight: 5 }}
    fill="#8F9BB3"
    name="log-out"
  />
);

const continueIcon = (props: any): IconElement => (
  <Icon
    style={{ width: 25, height: 25, marginRight: 5 }}
    fill="#3aedcd"
    name="arrow-ios-forward"
  />
);

export const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const { onLogout } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUser();
        console.log("User Data: ", userData);
        setUser(userData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, []);

  const logout = async () => {
    const result = await onLogout!();
    if (result && result.error) {
      console.log("Logout failed");
    } else {
      console.log("Logout successful");
      navigation.navigate("Login");
    }
  };

  const toggleMenu = (): void => {
    setMenuVisible(!menuVisible);
  };

  const renderMenuAction = (): React.ReactElement => (
    <TopNavigationAction icon={MenuIcon} onPress={toggleMenu} />
  );
  const renderOverflowMenuAction = (): React.ReactElement => (
    <OverflowMenu
      anchor={renderMenuAction}
      visible={menuVisible}
      onBackdropPress={toggleMenu}
    >
      <MenuItem
        accessoryLeft={InfoIcon}
        title="About"
      />
      <MenuItem accessoryLeft={LogoutIcon} title="Logout" onPress={logout} />
    </OverflowMenu>
  );
  const navigateParking = () => {
    navigation.navigate("Parking");
  };
  const renderTitle = (props: any): React.ReactElement => (
    <View style={styles.titleContainer}>
      <Avatar style={styles.logo} source={require("../../assets/logo.png")} />
      <Text {...props}>Noti</Text>
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <TopNavigation
        style={styles.header}
        title={renderTitle}
        accessoryRight={renderOverflowMenuAction}
      />

      <View style={styles.profileContainer}>
   
        <Text category="h4" style={styles.greeting}>
          Hello, {user ? user.firstName : "Loading..."}
        </Text>
        <Text category="p1" style={styles.greeting}>
          want to set a reminder to close the parking app?
        </Text>
        
      <View style={styles.controlContainer}>
        <TouchableOpacity style={styles.controlButton}>
          <Text>Set a Reminder</Text>
        </TouchableOpacity>
      </View>
     
      </View>

      <View style={styles.footer}>
        <Button
          size="large"
          appearance="ghost"
          status="primary"
          style={styles.parkingBtn}
          accessoryRight={continueIcon}
          onPress={navigateParking}
        >
          Search for Parking
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 50,
    backgroundColor: "#fff",
  },
  container: {
    display: "flex",
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  profileContainer: {
    marginTop: 50,
    alignItems: "center",
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  greeting: {
    marginTop: 10,
  },

  controlContainer: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
  },
  controlButton: {
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 10,
  },
  icon: {
    width: 32,
    height: 32,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    alignItems: "center",
    backgroundColor: "#fafafa",
  },
  chargeText: {
    fontSize: 18,
    color: "#333",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    marginHorizontal: 16,
  },
  parkingBtn: {
    width: "100%",
  },
});
