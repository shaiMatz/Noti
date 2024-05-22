import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  Icon,
  Avatar,
  TopNavigation,
  useTheme,
  TopNavigationAction,
  OverflowMenu,
  MenuItem,
  IconElement,
  Button,
} from "@ui-kitten/components";
import { IUser, User } from "../models/user_model";
import { CarData } from "../models/car_model";
import { LinearGradient } from "expo-linear-gradient";

const continueIcon = (props: any): IconElement => (
  <Icon
    style={{ width: 25, height: 25, marginRight: 5 }}
    fill="#142A37"
    name="arrow-ios-forward"
  />
);
const LevelIcon = (props: any) => (
  <Icon fill={"#fff"} {...props} name="bar-chart-outline" />
);
const PointsIcon = (props: any) => (
  <Icon {...props} fill={"#fff"} name="award-outline" />
);
const BackIcon = (props: any) => (
  <Icon {...props} fill={"#000"} name="arrow-back" />
);
const carType = CarData;
export const MyProfile = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const { user } = route.params;
  const theme = useTheme();

  // Ensuring the user object exists before creating a User instance
  const userModel = user ? new User(user) : null;
  const carImage =
    CarData.find((car) => car.id === user?.carType)?.image ||
    require("../../assets/car1.png");

  // Determine the correct image source
  const avatarSource =
    user && user.profilePicture !== ""
      ? { uri: user.profilePicture }
      : require("../../assets/default_avatar.png"); // Directly use require for static images
  const navigateBack = () => {
    navigation.navigate("Home", { user });
  };
  const MenuIcon = (props: any): IconElement => (
    <Icon
      style={{ width: 15, height: 15, marginRight: 5 }}
      fill="#000"
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

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  const renderMenuAction = (): React.ReactElement => (
    <TopNavigationAction icon={MenuIcon} onPress={toggleMenu} />
  );

  const toggleMenu = (): void => {
    setMenuVisible(!menuVisible);
  };

  const navigateParking = () => {
    navigation.navigate("ParkingHistory", { user });
  };

  const renderOverflowMenuAction = (): React.ReactElement => (
    <OverflowMenu
      anchor={renderMenuAction}
      visible={menuVisible}
      onBackdropPress={toggleMenu}
    >
      <MenuItem
        accessoryLeft={ProfileIcon}
        title="Edit Profile"
        onPress={() => {
          setMenuVisible(false);
          navigation.navigate("EditProfile", { user: user });
        }}
      />
    </OverflowMenu>
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <LinearGradient
        colors={["#FFFFFF", "#3aedcd30", "#3aedcd70","#3aedcd", "#3aedcd70", "#FFFFFF", "#FFFFFF"]}
        style={styles.linearGradient}
      >
        <ScrollView style={styles.scroll}>
          <View style={styles.container}>
            <TopNavigation
              title={(evaProps) => (
                <Text
                  {...evaProps}
                  style={[evaProps?.style, ]}
                >
                  My Profile
                </Text>
              )}
              alignment="center"
              accessoryLeft={BackAction}
              accessoryRight={renderOverflowMenuAction}
              style={{  backgroundColor: "transparent" }}
            />
          </View>
          <View style={[styles.header, styles.container]}>
            <Avatar size="giant" source={avatarSource} style={styles.avatar} />
            <Text style={styles.name}>
              {userModel ? userModel.getFullName() : "Loading..."}
            </Text>
            <Text style={styles.email}>{user ? user.email : "Loading..."}</Text>
            <View style={styles.cardsCon}>
              <View style={styles.card}>
                <Text style={styles.cardCon}> {user ? user.level : "N/A"}</Text>

                <View style={styles.actions}>
                  <LevelIcon style={styles.icon} />

                  <Text style={styles.text}>Level</Text>
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardCon}>{user ? user.points : "N/A"}</Text>
                <View style={styles.actions}>
                  <PointsIcon style={styles.icon} />

                  <Text style={styles.text}>Points</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.cardContainer}>
            <Image source={carImage} style={styles.carImage} />
            <Text style={styles.cardtext}>{user ? user.carType : "N/A"}</Text>
          </View>
        </ScrollView>
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
            See My Parking History
          </Button>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: "transparent", // Dark backdrop with 50% opacity
  },
  container: {
  },
  header: {
    width: "100%",
    alignItems: "center",
    padding: 20,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
  },
  linearGradient: {
    flex: 1,
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 8,
    color: "#fff",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 65,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#3aedcd",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  email: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 5,
  },
  card: {
    margin: 15,
    padding: 10,
    display: "flex",
    alignItems: "center",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  cardCon: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
  },
  text: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
  cardtext: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    backgroundColor: "#00000020",
    textAlign: "center",
    paddingHorizontal: 15,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardsCon: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    gap: 10,
  },
  cardContainer: {
    alignItems: "center",
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#000",
  },
  carImage: {
    width: 350,
    height: 250,
    resizeMode: "contain",
    marginBottom: 10,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopWidth: 1,
    alignItems: "center",

  },
  parkingBtn: {
    width: "100%",
  },
});

export default MyProfile;
