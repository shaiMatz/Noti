import React, { useState, useRef } from "react";
import {
  View,
  SafeAreaView,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import {
  Icon,
  Avatar,
  Spinner,
  TopNavigation,
  TopNavigationAction,
  Text,
} from "@ui-kitten/components";
import { CarData } from "../models/car_model";
import ImageOptionsModal from "../components/pickImage";
import { IUser } from "../models/user_model";
import { editUser } from "../api/apiUser";

const AddIcon = () => (
  <Icon style={styles.smallIcon} fill="#000" name="plus-outline" />
);
const BackIcon = (props: any) => (
  <Icon {...props} fill={"#000"} name="arrow-back" />
);
const EditIcon = () => (
  <Icon style={[styles.smallIcon, styles.editIcon]} fill="#000" name="edit" />
);
export const EditProfile = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { user } = route.params;


  // States for form fields
  const [fname, setFName] = useState(user.firstName);
  const [lname, setLName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [profileImage, setProfileImage] = useState<string | null>(
    user.profilePicture
  );
  const [carType, setCarType] = useState(user.carType);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);



const scrollViewRef = useRef<ScrollView>(null);

  const navigateBack = () => {
    navigation.navigate("MyProfile", { user });
  };

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  const carData = CarData;

  const saveProfile = () => {
    // Implement save functionality
    console.log("Profile saved", { fname, lname, email, profileImage });
    setIsLoading(true);
    editUser({
      firstName: fname,
      lastName: lname,
      email,
      profilePicture: profileImage || "../../assets/default_avatar.png",
      carType: carType,
    })
      .then((res) => {
        setIsLoading(false);
        console.log("Profile saved", res);
        navigation.navigate("MyProfile", { user: res as IUser })
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("Error saving profile", error);
      });
  };
  const ImagePlaceholder = () => (
    <TouchableOpacity
      style={styles.profilePlaceholder}
      onPress={() => setModalVisible(true)}
    >
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

  const handleCarTypeSelect = (id: string) => {
    setCarType(id);
 if (scrollViewRef.current) {
   scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
 }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopNavigation
        title={(evaProps) => (
          <Text
            {...evaProps}
            style={[evaProps?.style, styles.topNavigationTitle]}
          >
            Edit Profile
          </Text>
        )}
        alignment="center"
        accessoryLeft={BackAction}
      />
      <View style={styles.avatarContainer}>
        {isLoading ? (
          <Spinner size="large" />
        ) : profileImage ? (
          <ProfileImage />
        ) : (
          <ImagePlaceholder />
        )}
      </View>
      <View style={styles.form}>
        <View style={styles.nameInputContainer}>
          <TextInput
            style={[styles.input, styles.inputName1]}
            value={fname}
            onChangeText={setFName}
            placeholder="Name"
          />
          <TextInput
            style={[styles.input, styles.inputName2]}
            value={lname}
            onChangeText={setLName}
            placeholder="Last Name"
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.carTypeContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {[...carData]
              .sort((a, b) =>
                a.id === carType ? -1 : b.id === carType ? 1 : 0
              )
              .map((car) => (
                <TouchableOpacity
                  key={car.id}
                  style={[
                    styles.carTypeOption,
                    carType === car.id && styles.carTypeOptionSelected,
                  ]}
                  onPress={() => handleCarTypeSelect(car.id)}
                >
                  <Image
                    source={car.image}
                    style={styles.carTypeImage}
                    resizeMode="contain"
                  />
                    <Text style={styles.carTypeText}>{car.label}</Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
          <Text style={styles.saveButtonText}>Save Profile</Text>
        </TouchableOpacity>
      </View>
      <ImageOptionsModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setProfileImage={setProfileImage}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    paddingTop: 50,
    backgroundColor: "#fff",
  },
  topNavigationTitle: {
    fontWeight: "bold",
    backgroundColor: "transparent",
    fontSize: 20,
    color: "#000", // Adjust if you have a different theme color
  },
  form: {
    paddingHorizontal: 40,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  nameInputContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
    marginBottom: 25,
  },
  inputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#D0DBE4",
    marginBottom: 25,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#D0DBE4",
    height: 50,
    fontSize: 16,
  },
  inputName1: {
    marginRight: 15,
    flex: 0.5,
  },
  inputName2: {
    flex: 0.5,
  },
  saveButton: {
    backgroundColor: "#3aedcd", // Button color
    borderRadius: 25,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 18,
    color: "#FFFFFF", // Text color
    fontWeight: "600",
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
  icon: {
    width: 22,
    height: 22,
  },
  smallIcon: {
    width: 25,
    height: 25,
  },
  carTypeContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    // Add your styling here
  },
  carTypeLabel: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
  },
  carTypeOption: {
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 15,
    marginBottom: 10,
  },
  carTypeOptionSelected: {
    borderColor: "#3aedcd", // Selected option border color
  },
  carTypeImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  carTypeText: {
    fontSize: 16,
  },
 
});

export default EditProfile;
