import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { HomeScreen } from "./home";
import { ParkingScreen } from "./parkingPost";
import Login from "./login";
import Register from "./register";
import { AuthProvider, useAuth } from "../context/AuthContext";

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
          />
          <Screen name="Parking" component={ParkingScreen} />
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
