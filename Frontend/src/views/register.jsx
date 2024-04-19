import React, { useState } from "react";
import {
  Button,
  Icon,
  Input,
  Layout,
  Text,
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
  <Icon style={[styles.smallIcon,styles.editIcon]} fill="#000" name="edit" />
);

const AddIcon = () => (
  <Icon style={styles.smallIcon} fill="#000" name="plus-outline" />
);

const renderAccessoryIcon = (name, handler) => (
  <TouchableWithoutFeedback onPress={handler}>
    <Icon style={styles.icon} fill="#00000050" name={name} />
  </TouchableWithoutFeedback>
);

export const SignUp = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
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

      if (result.cancelled) {
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
      <Image source={{ uri: profileImage }} style={styles.profileImage} />
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
    console.log("Sign Up function");
    navigation.navigate("Home");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={{ flex: 1, justifyContent: "space-between" }}>
      

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
              Sign Up
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
    position: 'relative',
    border: 1,

  },
  profilePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    border: 3,
    borderColor: '#000',
    borderStyle: 'dashed',
    marginTop: 15,
    backgroundColor: "#e1e1e1",
    alignItems: "center",
    justifyContent: "center",
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 50,
  }
});

export default SignUp;
