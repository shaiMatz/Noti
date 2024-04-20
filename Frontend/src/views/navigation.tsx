import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button } from "@ui-kitten/components";

import { HomeScreen } from "./home";
import { DetailsScreen } from "./details";
import Login from "./login";
import Register from "./register";
import { AuthProvider, useAuth } from "../context/AuthContext";

const { Navigator, Screen } = createNativeStackNavigator();

const HomeNavigator = () => {
  const { authState, onLogout } = useAuth();

  return (
    <Navigator screenOptions={{ headerShown: false }}>
      {authState?.authenticated ? (
        <>
          <Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerRight: () => <Button onPress={onLogout}>Sign Out</Button>,
            }}
          />
          <Screen name="Details" component={DetailsScreen} />
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
