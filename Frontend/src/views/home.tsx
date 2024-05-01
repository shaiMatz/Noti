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
  useTheme,
  Modal,
} from "@ui-kitten/components";
import {
  SafeAreaView,
  View,
  StyleSheet,
  AppState ,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Icon } from "@ui-kitten/components";
import { useAuth } from "../context/AuthContext";
import { getUser, deleteUser, increasePoints } from "../api/apiUser";
import { User } from "../models/user_model";
import { format, set } from "date-fns";
import SpinningTimer from "../components/SpinningTimer";
import { requestLocationPermissions, startLocationUpdates, stopLocationUpdates } from "../services/LocationService";
import * as SecureStore from 'expo-secure-store';
import  {scheduleNotification, setupNotificationHandler}  from '../services/NotificationService';
import * as Notifications from 'expo-notifications';

const TIMER_STORAGE_KEY = 'TIMER_START_TIME';


const MenuIcon = (props: any): IconElement => (
  <Icon
    style={{ width: 15, height: 15, marginRight: 5 }}
    fill="#8F9BB3"
    name="more-vertical"
  />
);

const ProfileIcon = (props: any): IconElement => (
  <Icon
    style={{ width: 15, height: 15, marginRight: 5 }}
    fill="#8F9BB3"
    name="person-outline"
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
    fill="#142A37"
    name="arrow-ios-forward"
  />
);
const getGreetingTime = (date: { getHours: () => any }) => {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};


export const HomeScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const { user } = route.params;
  const [menuVisible, setMenuVisible] = useState(false);
  const [user1, setUser] = useState<User | null>(user||null);
  const theme = useTheme();
  const [reminderSet, setReminderSet] = useState(false);
  const [timerStart, setTimerStart] = useState(false);
  const [timerTime, setTimerTime] = useState(0);
  const { onLogout } = useAuth();
  const [greeting, setGreeting] = useState(getGreetingTime(new Date())); // Set initial greeting
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNoPost, setisNoPost] = useState(false);
  const [dynamicGreeting, setDynamicGreeting] = useState(greeting);

   const fetchUserData = async () => {
     try {
       const userData = await getUser();
       console.log("User Data: ", userData);
       setUser(userData);
     } catch (error) {
       console.error(error);
     }
   };

  useEffect(() => {
    const checkTimer = async () => {
      const startTimeString = await SecureStore.getItemAsync(TIMER_STORAGE_KEY);
      if (startTimeString) {
        const startTime = parseInt(startTimeString, 10);
        const currentTime = Date.now();
        setTimerTime(currentTime - startTime);
        setTimerStart(true);
        requestLocationPermissions().then(startLocationUpdates);
      }
    };

   
    checkTimer();
    fetchUserData();
    setupNotificationHandler();
    requestLocationPermissions();
  }, []);

  useEffect(() => {
    const updateGreeting = () => {
      const newGreeting = getGreetingTime(new Date());
      setGreeting(newGreeting);
    };

    const intervalId = setInterval(updateGreeting, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    setTimerTime(0);
    if (timerStart) {
      interval = setInterval(() => {
        updateTimerTime();
      }, 1000);
    } else {
      if (interval) {
        clearInterval(interval);
      }
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timerStart]);

  Notifications.addNotificationResponseReceivedListener((response) => {
    console.log("Notification response received:", response);

    const actionIdentifier = response.actionIdentifier;
    if (actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) {
      // User tapped on the notification itself
      //open the app if closed or in background

      console.log("Notification tapped, opening app...");

      // You will need to implement this function
    } else if (actionIdentifier === "turn-off-action") {
      // User tapped on 'Turn Off Now' action
      console.log("Turn Off Now action button tapped, stopping timer...");
      handleReminderToggle(); // Implement this as well
    }
    // Add more actions as needed
  });

  const updateTimerTime = async () => {
    const startTimeString = await SecureStore.getItemAsync(TIMER_STORAGE_KEY);
    if (startTimeString) {
      const startTime = parseInt(startTimeString, 10);
      setTimerTime(Date.now() - startTime);
    }
  };
  const handleClosePango = () => {
    // Hide the modal
    setisNoPost(false);
    setIsModalVisible(false);

    // Attempt to open the Pango app; replace 'pango://app' with the actual Pango app deep link
    const pangoUrl = "pango://app";
    Linking.canOpenURL(pangoUrl)
      .then((supported) => {
        if (!supported) {
          console.log("Can't handle Pango URL");
        } else {
          return Linking.openURL(pangoUrl);
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  const handleReminderToggle = async () => {
    if (!reminderSet) {
      requestLocationPermissions().then(startLocationUpdates);
      const startTime = Date.now();
      await SecureStore.setItemAsync(TIMER_STORAGE_KEY, startTime.toString());
      setTimerTime(0);
      setReminderSet(true);
      setTimerStart(true);
      setDynamicGreeting("Your reminder is set");
    } else {
      await SecureStore.deleteItemAsync(TIMER_STORAGE_KEY);
      setTimerTime(0);
      handleTimerClose(); // This will also handle setting reminderSet to false
      setDynamicGreeting(getGreetingTime(new Date()));
    }
  };
  const handleTimerClose = async () => {
    setTimerStart(false);
    setReminderSet(false);
    setIsModalVisible(true);
    setisNoPost(true);
    stopLocationUpdates();
    increasePoints().then(()=>fetchUserData())
  };
  const handlePostUpload = () => {
    setIsModalVisible(false);
    navigation.navigate("UploadPost");
    // Implement your logic to post about the cleared parking spot
    console.log("Post uploaded!");
  };
  const getButtonStyle = () => ({
    backgroundColor: reminderSet ? theme["color-primary-default"] : null,
  });
  const handlePostDecline = () => {
    setisNoPost(false);
    // Logic to handle when the user does not want to upload a post
    console.log("Post declined!");
  };

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
        accessoryLeft={ProfileIcon}
        title="My Profile"
        onPress={() => {
          setMenuVisible(false);
          navigation.navigate("MyProfile", { user: user||user1 });
        }}
      />
      <MenuItem accessoryLeft={LogoutIcon} title="Logout" onPress={logout} />
    </OverflowMenu>
  );
  const navigateParking = () => {
    navigation.navigate("Parking",{ user: user||user1 });
  };
  const renderTitle = (props: any): React.ReactElement => (
    <View style={styles.titleContainer}>
      <Avatar style={styles.logo} source={require("../../assets/logo.png")} />
      <Text {...props}>Noti</Text>
    </View>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme["background-basic-color-1"] },
      ]}
    >
      <TopNavigation
        style={styles.header}
        title={renderTitle}
        accessoryRight={renderOverflowMenuAction}
      />

      <View style={styles.profileContainer}>
        <Text category="h4" style={[styles.greeting, { fontWeight: "bold" }]}>
          {dynamicGreeting}, {user1 ? user1.firstName : "Loading..."}
        </Text>
        <Text category="h6" style={styles.greeting}>
          {reminderSet
            ? "Don't forget to close the timer and earn 10 points!"
            : "Want to set a reminder to close the parking app?"}
        </Text>
      </View>

      <View style={styles.controlContainer}>
        <TouchableOpacity
          style={[
            styles.controlButton,
            reminderSet
              ? {}
              : {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 3 },
                  shadowRadius: 6,
                  shadowOpacity: 0.3,

                  // Elevation for Android
                  elevation: 5,
                  backgroundColor: theme["color-primary-default"],
                  padding: 15,
                },
          ]}
          onPress={handleReminderToggle}
        >
          {!reminderSet ? (
            <>
              <Icon name="bell" fill="#fff" style={styles.icon} />
              <Text style={styles.buttonText}>Set a Reminder</Text>
            </>
          ) : (
            <SpinningTimer timerTime={timerTime} />
          )}
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: theme["background-basic-color-3"],
            borderTopColor: theme["background-basic-color-4"],
          },
        ]}
      >
        <Button
          size="large"
          appearance="ghost"
          status="info"
          style={styles.parkingBtn}
          accessoryRight={continueIcon}
          onPress={navigateParking}
        >
          Search for Parking
        </Button>
      </View>

      <Modal
        visible={isModalVisible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {isNoPost ? (
            <>
              <Text category="h5" style={{ marginBottom: 5 }}>
                Parking spot cleared?
              </Text>
              <Text category="p1">
                Would you like to upload a post about the cleared parking spot?
              </Text>
              <View
                style={{ display: "flex", flexDirection: "row", marginTop: 20 }}
              >
                <Button size="small" onPress={handlePostUpload}>
                  Yes, upload post
                </Button>
                <Button
                  size="small"
                  onPress={handlePostDecline}
                  appearance="ghost"
                >
                  No, thanks
                </Button>
              </View>
            </>
          ) : (
            <>
              <Text category="h5" style={{ marginBottom: 5,textAlign:'center' }}>
                Don't forget to close Pango!
              </Text>
               <View
                style={{ display: "flex", flexDirection: "row", marginTop: 20 }}
              >
              <Button size="small" onPress={handleClosePango}>
                Open Pango
              </Button>
              <Button
                size="small"
                onPress={() => setIsModalVisible(false)}
                appearance="ghost"
              >
                Close
              </Button>
              </View>
            </>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
  },
  container: {
    display: "flex",
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
  },
  profileContainer: {
    padding: 50,
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
    fontWeight: "normal",
    textAlign: "center",
  },

  controlContainer: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
  },
  controlButton: {
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 10,
   
  },
  icon: {
    width: 32,
    height: 32,
  },
  timerText: {
    color: "#fff",
  },
  reminderSet: {
    backgroundColor: "#34C759",
  },
  buttonText: {
    color: "#fff",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopWidth: 1,
    alignItems: "center",
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
  modalContainer: {
    backgroundColor: "white",
    padding: 25,
    width: 300,
    borderRadius: 8,
    alignItems: "center",
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
