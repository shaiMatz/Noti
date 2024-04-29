import React, { useState, FC, useEffect, ReactElement } from "react";
import {useAuth} from '../context/AuthContext';
import {
  AnimationConfig,
  Button,
  Icon,
  IconElement,
  Input,
  Layout,
  Text,
} from "@ui-kitten/components";

import {
  SafeAreaView,
  TouchableWithoutFeedback,
  StyleSheet,
  View,
  Image,
} from "react-native";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";

const AlertIcon = (): IconElement => (
  <Icon style={{width:15,height:15,marginRight:5}} fill="#8F9BB3" name="alert-circle-outline" />
);




const googleIcon = () => (
  <Icon style={styles.icon} fill="#ea4335" name="google-outline" />
);
export const Login = ({ navigation }: { navigation: any }): IconElement => {
  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const {onLogin, onGoogleLogin} = useAuth();

  const toggleSecureEntry = (): void => {
    setSecureTextEntry(!secureTextEntry);
  };
  const renderIcon = (): React.ReactElement => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon
        style={styles.icon}
        fill="#00000080"
        name={secureTextEntry ? "eye-off" : "eye"}
      />
    </TouchableWithoutFeedback>
  );
  const renderCaption = (): React.ReactElement => {
    return (
      <View style={styles.captionContainer}>
        {AlertIcon()}
        <Text style={styles.captionText}>
          Should contain at least 8 symbols
        </Text>
      </View>
    );
  };
  //login function
  const login = async() => {
    console.log("Login function");
    const result = await onLogin!(Email, password);
    console.log("Result: ",result);
    if(!result.error){
      console.log("Login successful, userId: ",result.userId);
      
      navigation.navigate({
        name: 'Home',
        merge: true,
      });
    }
    else{
      console.log("Login failed");
      alert("Login failed: "+result.message);
    }

  };


const onGoogleButtonPress = async () => {
  const res =await onGoogleLogin!()
  console.log("res: ", res);
  if(!res.error){
    console.log("Login successful, userId: ",res.userId);
    
    navigation.navigate({
      name: 'Home',
      merge: true,
    });
  }
  else{
    console.log("Login failed");
    alert("Login failed: "+res.message);
  }
};


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={{ flex: 1, justifyContent: "space-between" }}>
        <View style={styles.container}>
          <Image
            style={styles.logo}
            source={require("../../assets/logo.png")}
          />

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
              style={styles.input}
              accessoryRight={renderIcon}
              secureTextEntry={secureTextEntry}
              onChangeText={(nextValue) => setPassword(nextValue)}
            />
          </View>
          <View>
            <Button size="small" style={styles.btn} onPress={login}>
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
            <View
              style={{ flex: 1, height: 1, backgroundColor: "#00000050" }}
            />
            <View>
              <Text category="c1" style={{ width: 50, textAlign: "center" }}>
                OR
              </Text>
            </View>
            <View
              style={{ flex: 1, height: 1, backgroundColor: "#00000050" }}
            />
          </View>

          <View>
           <GoogleSigninButton
  size={GoogleSigninButton.Size.Wide}
  color={GoogleSigninButton.Color.Dark}
  onPress={() => {
    onGoogleButtonPress();
  }}
  style={styles.btn2}
/>
          </View>
        </View>
        <View style={styles.signup_contaiter}>
          <Text category="c1">Don't have an account?</Text>
          <Text
            category="c1"
            style={{ marginLeft: 5, color: "#4285f4", fontWeight: "bold" }}
            status="basic"
            onPress={() => navigation.navigate("Register")}
          >
            Sign Up
          </Text>
        </View>
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    padding: 40,
    marginTop: 120,
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
  btn2: {
    marginTop: 25,
    marginBottom: 15,
    borderRadius: 25,
    textAlign: "center",
    width: 250,
  },
  input: {
    marginBottom: 15,
  },
  icon: {
    width: 20,
    height: 20,
  },
  signup_contaiter: {
    padding: 50,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  captionContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  captionIcon: {
    width: 10,
    height: 10,
    marginRight: 5,
  },
  captionText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#8F9BB3",
  },
});
export default Login;
function onGoogleLogin(): any {
  throw new Error("Function not implemented.");
}

