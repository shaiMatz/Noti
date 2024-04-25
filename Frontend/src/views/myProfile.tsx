import React from "react";
import {
  View,
  SafeAreaView,
  Text,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import {
  Icon,
  Avatar,
  TopNavigation,
  useTheme,
  TopNavigationAction,
} from "@ui-kitten/components";
import { IUser, User } from "../models/user_model";
import { CarData } from "../models/car_model";
import { LinearGradient } from 'expo-linear-gradient';

const LevelIcon = (props: any) => <Icon {...props} name="bar-chart-outline" />;
const PointsIcon = (props: any) => <Icon {...props} name="award-outline" />;
const BackIcon = (props: any) => <Icon {...props} name="arrow-back" />;
const carType = CarData;
export const MyProfile = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
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
    navigation.goBack();
  };

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <LinearGradient
        colors={["#3aedcd","#3aedcd70","#FFFFFF","#FFFFFF"]}
        style={styles.linearGradient}
      >
        <ScrollView style={styles.scroll}>
          <View style={styles.container}>
            <TopNavigation
              title="My Profile"
              alignment="center"
              accessoryLeft={BackAction}
              style={{ marginTop: 50, backgroundColor: "transparent" }}
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
                <LevelIcon style={styles.icon} />

                <Text style={styles.cardCon}> {user ? user.level : "N/A"}</Text>
                <Text style={styles.text}>Level</Text>
              </View>

              <View style={styles.card}>
                <PointsIcon style={styles.icon} />

                <Text style={styles.cardCon}>
                  {" "}
                  {user ? user.points : "N/A"}
                </Text>
                <Text style={styles.text}>Points</Text>
              </View>
            </View>
          </View>
          <View style={styles.cardContainer}>
            <Image source={carImage} style={styles.carImage} />
            <Text style={styles.cardtext}>{user ? user.carType : "N/A"}</Text>
          </View>
        </ScrollView>
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
    width: 32,
    height: 32,
    marginRight: 8,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
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
    marginBottom: 20,
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
    margin: 20,
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  cardsCon: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    gap: 10,
  },
  cardContainer: {
    margin: 15,
    padding: 10,
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
  },
});

export default MyProfile;
