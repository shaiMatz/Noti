import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

import {
  Button,
  Icon,
  Input,
  Layout,
  Text,
  useTheme,
  IconElement,
  Spinner,
  TopNavigation,
  TopNavigationAction,
} from "@ui-kitten/components";
import * as ImagePicker from "expo-image-picker";
import {
  SafeAreaView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  Alert,
  ScrollView,
  Dimensions,
  Modal,
} from "react-native";
import ImageOptionsModal from "../components/pickImage";
import { CarData } from "../models/car_model";
import { uploadImage } from "../api/apiPost";

const AlertIcon = () => (
  <Icon
    style={{ width: 15, height: 15, marginRight: 5 }}
    fill="#8F9BB3"
    name="alert-circle-outline"
  />
);
const BackIcon = (props: any) => <Icon {...props} name="arrow-back" />;
const uploadIcon = () => (
  <Icon style={styles.icon} fill="#8F9BB3" name="upload-outline" />
);
const EditIcon = () => (
  <Icon style={[styles.smallIcon, styles.editIcon]} fill="#000" name="edit" />
);

const AddIcon = () => (
  <Icon style={styles.smallIcon} fill="#000" name="plus-outline" />
);

const renderAccessoryIcon = (name: any, handler: any) => (
  <TouchableWithoutFeedback onPress={handler}>
    <Icon style={styles.icon} fill="#00000050" name={name} />
  </TouchableWithoutFeedback>
);

const carData = CarData

export const SignUp = ({ navigation }: { navigation: any }): IconElement => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isContinue, setIsContinue] = useState(true);
  const [selectedCar, setSelectedCar] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { onLogin, onRegister } = useAuth();
  const theme = useTheme();

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };
  const handleCarSelect = (id: any) => {
    setSelectedCar(id);
  };
  const login = async () => {
    console.log("Login function");
    const result = await onLogin!(email, password);
    console.log("Result: ", result);
    if (!result.error) {
      console.log("Login successful, userId: ", result.userId);

      navigation.navigate({
        name: "Home",
        merge: true,
      });
    } else {
      console.log("Login failed");
      alert("Login failed\n" + result.message);
    }
  };
  const handleContinue = async () => {
    if (!selectedCar) {
      Alert.alert(
        "Car Selection Required",
        "Please select a car type to continue."
      );
      return;
    }
    setIsLoading(true);
    if(profileImage){
       const uploadedImage = await uploadImage(profileImage!);
    setProfileImage(uploadedImage);
    }
    else{
      setProfileImage("../../assets/default_avatar.png");
    }
    console.log("Registering user, userdata: ", {
      firstName,
      lastName,
      email,
      password,
      profileImage,
      selectedCar,
    });
   
    const result = await onRegister!(
      firstName,
      lastName,
      email,
      password,
      profileImage ? profileImage : "../../assets/default_avatar.png",
      selectedCar
    );
    setIsLoading(false);

    if (result.error) {
      Alert.alert("Registration Failed", result.message);
    } else {
      login();
    }
  };

  
  const ImagePlaceholder = () => (
    <TouchableOpacity style={styles.profilePlaceholder} onPress={() => setModalVisible(true)} >
      <AddIcon />
    </TouchableOpacity>
  );

  const ProfileImage = () => (
    <TouchableOpacity onPress={() => setModalVisible(true)}>
      {profileImage ? (
        <Image source={{ uri: profileImage }} style={styles.profileImage} />
      ) : (
        <ImagePlaceholder />
      )}
      <EditIcon />
    </TouchableOpacity>
  );
  const renderPasswordIcon = () =>
    renderAccessoryIcon(secureTextEntry ? "eye-off" : "eye", toggleSecureEntry);

  const renderCaption = () => (
    <View style={styles.captionContainer}>
      {AlertIcon()}
      <Text style={styles.captionText}>Should contain at least 8 symbols</Text>
    </View>
  );

  const signUp = () => {
    console.log("continue function");
    if (!firstName || !lastName || !email || !password) {
      alert("All fields are required");
      return;
    }
    setIsContinue(false);
  };
  const navigateBack = () => {
    navigation.goBack();
  };

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <Layout style={{ flex: 1, justifyContent: "space-between" }}>
        {isContinue ? (
          <>
            <View style={styles.container}>
              {isLoading ? (
                <Spinner size="large" />
              ) : profileImage ? (
                <ProfileImage />
              ) : (
                <ImagePlaceholder />
              )}
              <View style={styles.form_container}>
                <Text category="h5" style={{ marginBottom: 25 }}>
                  Create your Account
                </Text>
                <View style={styles.nameContainer}>
                  <Input
                    placeholder="First Name"
                    value={firstName}
                    style={[styles.input, styles.inputName1]}
                    onChangeText={setFirstName}
                  />
                  <Input
                    placeholder="Last Name"
                    value={lastName}
                    style={[styles.input, styles.inputName2]}
                    onChangeText={setLastName}
                  />
                </View>
                <Input
                  placeholder="Email"
                  value={email}
                  style={styles.input}
                  onChangeText={setEmail}
                />
                <Input
                  placeholder="Password"
                  value={password}
                  style={styles.input}
                  caption={renderCaption}
                  accessoryRight={renderPasswordIcon}
                  secureTextEntry={secureTextEntry}
                  onChangeText={setPassword}
                />
              </View>

              <View style={{ marginTop: 25 }}>
                <Button size="small" style={styles.btn} onPress={signUp}>
                  Continue
                </Button>
              </View>
            </View>

            <View style={styles.signup_contaiter}>
              <Text category="c1">Already have an account?</Text>
              <Text
                category="c1"
                style={{ marginLeft: 5, color: "#4285f4", fontWeight: "bold" }}
                onPress={() => navigation.navigate("Login")}
              >
                Sign In
              </Text>
            </View>
            <ImageOptionsModal
  modalVisible={modalVisible}
  setModalVisible={setModalVisible}
  setProfileImage={setProfileImage}
/>

          </>
        ) : (
          <SafeAreaView
            style={{
              flex: 1,
              paddingTop: 50,
              backgroundColor: theme["background-basic-color-1"],
            }}
          >
            <TopNavigation
              title="Choose Your Car Type"
              alignment="center"
              accessoryLeft={BackAction}
            />

            <View style={styles.car_container}>
              <ScrollView contentContainerStyle={styles.grid}>
                {carData.map((car) => (
                  <TouchableOpacity
                    key={car.id}
                    style={[
                      styles.card,
                      selectedCar === car.id && styles.cardSelected,
                    ]}
                    onPress={() => handleCarSelect(car.id)}
                  >
                    <Image
                      source={car.image}
                      style={styles.carImage}
                      resizeMode="contain"
                    />
                    <Text category="c1" style={styles.label}>
                      {car.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View
                style={{
                  marginTop: 20,
                  backgroundColor: "#fff",
                  marginBottom: 180,
                }}
              >
                <Button
                  size="small"
                  style={styles.btn}
                  onPress={handleContinue}
                >
                  Sign Up
                </Button>
              </View>
            </View>
          </SafeAreaView>
        )}
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    padding: 40,
    marginTop: 100,
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
    width: "100%",
    marginTop: 25,
  },
  nameContainer: {
    flexDirection: "row",
    width: "100%", // Ensure container uses full width
    justifyContent: "space-between",
  },
  btn: {
    marginBottom: 15,
    borderRadius: 25,
    textAlign: "center",
    width: 200,
  },
  smallIcon: {
    width: 25,
    height: 25,
  },
  inputName1: {
    marginRight: 15,
    flex: 0.5,
  },
  inputName2: {
    flex: 0.5,
  },
  input: {
    marginBottom: 15,
  },
  icon: {
    width: 22,
    height: 22,
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
  captionText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#8F9BB3",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginTop: 15,
    position: "relative",
  },
  profilePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginTop: 15,
    backgroundColor: "#e1e1e1",
    alignItems: "center",
    justifyContent: "center",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 10,
    backgroundColor: "#fff",
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 50,
  },
  /* Car selection styles */
  car_container: {
    alignItems: "center",
    justifyContent: "center",
  },

  grid: {
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  card: {
    width: Dimensions.get("window").width * 0.4, // Roughly 40% of screen width
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 70,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardSelected: {
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 34 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    backgroundColor: "#00000020",
  },
  carImage: {
    width: 100,
    height: 130, // Fixed height for uniformity
    resizeMode: "contain",

  },
  label: {
    fontSize: 16,
  },


});

export default SignUp;
