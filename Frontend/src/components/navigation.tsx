import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { HomeScreen } from "../views/home";
import { ParkingScreen } from "../views/parkingPost";
import Login from "../views/login";
import Register from "../views/register";
import MyProfile from "../views/myProfile";
import EditProfile from "../views/editProfile";
import { UploadPost } from "../views/uploadPost";
import { ParkingHistory } from "../views/parkingHistory";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { IUser } from "../models/user_model";
const { Navigator, Screen } = createNativeStackNavigator();

const HomeNavigator = () => {
  const { authState } = useAuth();

  return (
    <Navigator screenOptions={{ headerShown: false }}>
      {authState?.authenticated ? (
        <>
          <Screen
            name="Home"
            component={HomeScreen}
            initialParams={{ user: null }}
          />
          <Screen name="Parking" component={ParkingScreen} />
          <Screen name="UploadPost" component={UploadPost} />
          <Screen
            name="MyProfile"
            component={MyProfile}
            initialParams={{ user: null }}
          />
          <Screen
            name="EditProfile"
            component={EditProfile}
            initialParams={{ user: null }}
          />
          <Screen name="ParkingHistory" component={ParkingHistory} />
        </>
      ) : (
        <>
          <Screen name="Login" component={Login} />
          <Screen name="Register" component={Register} />
        </>
      )}
    </Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <HomeNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};
