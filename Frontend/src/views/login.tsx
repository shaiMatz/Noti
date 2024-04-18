import React, { useState, FC, useEffect, ReactElement } from "react";
import { Button, Icon, IconElement, Input, Text } from "@ui-kitten/components";
import {
  TouchableWithoutFeedback,
  StyleSheet,
  View,
  Image,
} from "react-native";

const Login = () => {
  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //login function
  const login = () => {
    console.log("Login function");
  };

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../../assets/logo.png")} />

      <View style={styles.form_container}>
        <Text category="h5" style={{ marginBottom: 25 }}>
          Login to your Account
        </Text>
        <Input
          placeholder="Email"
          value={Email}
          style={styles.input}
          onChangeText={(nextValue) => setEmail(nextValue)}
        />
        <Input
          placeholder="Password"
          value={password}
          secureTextEntry={true}
          style={styles.input}
          onChangeText={(nextValue) => setPassword(nextValue)}
        />
      </View>
      <View>
        <Button style={styles.btn} onPress={login}>
          Sign In
        </Button>
      </View>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginTop: 15,
        }}
      >
        <View style={{ flex: 1, height: 0.4, backgroundColor: "#00000070" }} />
        <View>
          <Text category="c1" style={{ width: 50, textAlign: "center" }}>
            OR
          </Text>
        </View>
        <View style={{ flex: 1, height: 0.4, backgroundColor: "#00000070" }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    padding: 50,
  },
  logo: {
    width: 125,
    height: 125,
    marginBottom: 50,
  },
  form_container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  btn: {
    marginBottom: 15,
    borderRadius: 25,
    textAlign: "center",
    width: 200,
  },
  input: {
    marginBottom: 15,
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
});
export default Login;
