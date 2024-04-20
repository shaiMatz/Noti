import React, { useState } from "react";
import {useAuth} from '../context/AuthContext';

import {
  Button,
  Icon,
  Input,
  Layout,
  Text,
  IconElement,
  Spinner,
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
} from "react-native";

const AlertIcon = () => (
  <Icon
    style={{ width: 15, height: 15, marginRight: 5 }}
    fill="#8F9BB3"
    name="alert-circle-outline"
  />
);

const uploadIcon = () => (
  <Icon style={styles.icon} fill="#8F9BB3" name="upload-outline" />
);
const EditIcon = () => (
  <Icon style={[styles.smallIcon, styles.editIcon]} fill="#000" name="edit" />
);

const AddIcon = () => (
  <Icon style={styles.smallIcon} fill="#000" name="plus-outline" />
);

const renderAccessoryIcon = (name:any, handler
  :any
) => (
  <TouchableWithoutFeedback onPress={handler}>
    <Icon style={styles.icon} fill="#00000050" name={name} />
  </TouchableWithoutFeedback>
);
const carData = [
  { id: "car1", label: "Coupe", image: require("../../assets/car1.png") },
  { id: "car2", label: "SUV", image: require("../../assets/car2.png") },
  { id: "car3", label: "Convertible", image: require("../../assets/car3.png") },
  { id: "car4", label: "Truck", image: require("../../assets/car5.png") },
  { id: "car5", label: "Van", image: require("../../assets/car6.png") },
  { id: "car6", label: "Coupe", image: require("../../assets/car7.png") },
  { id: "car7", label: "Hatchback", image: require("../../assets/car8.png") },
  { id: "car8", label: "Wagon", image: require("../../assets/car9.png") },
  { id: "car9", label: "Supercar", image: require("../../assets/car10.png") },
];
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
  const {onLogin, onRegister} = useAuth();
  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };
  const handleCarSelect = (id:any) => {
    setSelectedCar(id);
  };
  const login = async() => {
    console.log("Login function");
    const result = await onLogin!(email, password);
    if(result&& result.error){
      console.log("Login failed");
      Alert.alert("Login Failed", result.msg);
    }else{
      console.log("Login successful");
      navigation.navigate("Home");
    }
  };
  const handleContinue = async () => {
    if (selectedCar) {
      const result = await onRegister!(
        firstName,
        lastName,
        email,
        password
  
      );
      if(result && result.error){
        Alert.alert("Registration Failed", result.msg);
      }
      else{
       login();
      }
    } else {
      alert("Please select a car type to continue.");
    }
  };
  const pickImage = async () => {
    setIsLoading(true);
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (result.canceled) {
        Alert.alert("Image Upload", "You did not select any image.");
        setIsLoading(false);
      } else {
        const uri =
          result.assets && result.assets.length > 0
            ? result.assets[0].uri
            : null;
        if (uri) {
          setProfileImage(uri);
        } else {
          Alert.alert("Image Upload Error", "Failed to retrieve image URI.");
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Image Upload Failed",
        "An unexpected error occurred while trying to upload the image."
      );
      setIsLoading(false);
    }
  };
  const ImagePlaceholder = () => (
    <TouchableOpacity style={styles.profilePlaceholder} onPress={pickImage}>
      <AddIcon />
    </TouchableOpacity>
  );

  const ProfileImage = () => (
    <TouchableOpacity onPress={pickImage}>
      {profileImage ? (<Image source={{ uri: profileImage }} style={styles.profileImage} />
     ):(<ImagePlaceholder/>)}
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
    setIsContinue(false);
  };

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
          </>
        ) : (
          <View style={styles.car_container}>
            <Text category="h5" style={{ marginBottom: 15 }}>
              Choose Your Car Type
            </Text>
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
                marginBottom: 100,
              }}
            >
              <Button size="small" style={styles.btn} onPress={handleContinue}>
                Sign Up
              </Button>
            </View>
          </View>
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
    marginTop: 60,
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
    width: 170,
    height: 170, // Fixed height for uniformity
  },
  label: {
    fontSize: 16,
  },
});

export default SignUp;
