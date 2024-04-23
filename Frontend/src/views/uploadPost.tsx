import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import * as ImagePicker from "expo-image-picker";
import {
  Button,
  Input,
  Layout,
  Text,
  Icon,
  useTheme,
  TopNavigationAction,
  TopNavigation,
} from "@ui-kitten/components";
import { createPost } from "../api/apiPost";
import * as Location from "expo-location";

const postSchema = Yup.object().shape({
  content: Yup.string(),
  image: Yup.string().when(
    "content",
    (content: string | any[], schema: any) => {
      return !content || content.length === 0
        ? schema.required("An image or content is required")
        : schema;
    }
  ),
});
const BackIcon = (props: any) => <Icon {...props} name="arrow-back" />;
export const UploadPost = ({ navigation }: { navigation: any }) => {
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject>();
  const [locationName, setLocationName] = useState<string | null>(null);

  const theme = useTheme();

  const navigateBack = () => {
    navigation.goBack();
  };

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setImage(result.assets[0].uri);
    }
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Permission to access location was denied"
      );
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    const [result] = await Location.reverseGeocodeAsync(location.coords);
    if (result) {
      setLocationName(
        `${result.name}, ${result.street}, ${result.city}, ${result.country}`
      );
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: 50,
        backgroundColor: theme["background-basic-color-1"],
      }}
    >
      <TopNavigation
        title="Posts by Location"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Formik
          initialValues={{ content: "", image: "" }}
          validationSchema={postSchema}
          onSubmit={(values, { setSubmitting }) => {
            const postData = {
              content: values.content,
              image: image,
              location: locationName,
            };

            createPost({
              ...postData,
              location: locationName || "",
              longitude: location?.coords?.latitude ?? 0,
              latitude: location?.coords?.latitude ?? 0,
              image: image || undefined,
            })
              .then(() => {
                Alert.alert("Success", "Post created successfully!");
                setSubmitting(false);
                navigation.navigate("Home");
              })
              .catch((error) => {
                Alert.alert("Error", `Failed to create post: ${error.message}`);
                setSubmitting(false);
              });
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
          }) => (
            <Layout style={styles.form}>
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {!image ? (
                  <React.Fragment>
                    <Icon
                      name="camera-outline"
                      width={32}
                      height={32}
                      fill="#8F9BB3"
                    />
                    <Text category="s1">Upload Image</Text>
                  </React.Fragment>
                ) : (
                  <Image source={{ uri: image }} style={styles.image} />
                )}
              </TouchableOpacity>
              <Input
                onChangeText={handleChange("content")}
                onBlur={handleBlur("content")}
                value={values.content}
                placeholder="Share something about this spot..."
                textStyle={{ minHeight: 64 }}
                multiline
                status={touched.content && errors.content ? "danger" : "basic"}
                caption={
                  touched.content && errors.content ? errors.content : ""
                }
              />

              {errors.image && !image && (
                <Text style={styles.error}>{errors.image}</Text>
              )}

              <Button style={styles.button} onPress={() => handleSubmit()}>
                Create Post
              </Button>
            </Layout>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  form: {
    justifyContent: "space-between",
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginVertical: 8,
  },
  image: {
    width: "100%",
    height: 200,
    marginTop: 10,
    marginBottom: 10,
  },
  errors: {
    color: "red",
  },
  imagePicker: {
    width: "100%",
    height: 200,
    backgroundColor: "#F7F9FC",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});
