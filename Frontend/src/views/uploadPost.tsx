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
import { createPost, updatePost, uploadImage } from "../api/apiPost";
import * as Location from "expo-location";
import ImageOptionsModal from "../components/pickImage";

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
export const UploadPost = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const post = route.params?.post;
  const [image, setImage] = useState<string | null>(post?.image || null);
  const [location, setLocation] = useState<Location.LocationObject>();
  const [locationName, setLocationName] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const theme = useTheme();

  const navigateBack = () => {
    navigation.goBack();
  };

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  const getLocation = async () => {
    try {
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

      try {
        const [result] = await Location.reverseGeocodeAsync(location.coords);
        if (result) {
          setLocationName(
            `${result.name}, ${result.street}, ${result.city}, ${result.country}`
          );
        }
      } catch (geocodeError) {
        console.error("Geocoding error:", geocodeError);
        Alert.alert(
          "Location Error",
          "Unable to fetch the address at this time. Please check your network connection or try again later."
        );
      }
    } catch (error) {
      console.error("Location error:", error);
      Alert.alert(
        "Location Error",
        "Unable to fetch your location. Please check your settings and try again."
      );
    }
  };

  useEffect(() => {
    if (!post) getLocation();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme["background-basic-color-1"],
      }}
    >
      <TopNavigation
        title={post ? "Edit Post" : "Create Post"}
        alignment="center"
        accessoryLeft={BackAction}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <Formik
          initialValues={{
            content: post?.content || "",
            image: post?.image || "",
          }}
          validationSchema={postSchema}
          onSubmit={(values, { setSubmitting }) => {
            const postData = {
              content: values.content || undefined,
              image: image || undefined,
              location: locationName || undefined,
            };
            const action = post
              ? () => updatePost(post._id, postData)
              : () =>
                  createPost({
                    ...postData,
                    location: locationName || "",
                    longitude: location?.coords?.latitude ?? 0,
                    latitude: location?.coords?.latitude ?? 0,
                    image: image || undefined,
                  });
            action()
              .then(() => {
                Alert.alert(
                  "Success",
                  `Post ${post ? "updated" : "created"} successfully!`
                );
                setSubmitting(false);
                navigation.navigate("Home");
              })
              .catch((error) => {
                Alert.alert(
                  "Error",
                  `Failed to ${post ? "update" : "create"} post: ${
                    error.message
                  }`
                );
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
              <TouchableOpacity
                style={styles.imagePicker}
                onPress={() => setModalVisible(true)}
              >
                {image ? (
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: image }}
                      style={styles.image}
                    />
                    <TouchableOpacity
                      style={styles.imageEditIcon}
                      onPress={() => setModalVisible(true)}
                    >
                      <Icon
                        name="edit-outline"
                        width={32}
                        height={32}
                        fill="#FFF"
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.imagePicker}
                    onPress={() => setModalVisible(true)}
                  >
                    <Icon
                      name="camera-outline"
                      width={32}
                      height={32}
                      fill="#8F9BB3"
                    />
                    <Text category="s1">Upload Image</Text>
                  </TouchableOpacity>
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
                  touched.content && typeof errors.content === "string"
                    ? errors.content
                    : ""
                }
              />
              {errors.image && typeof errors.image === "string" && !image && (
                <Text style={styles.error}>{errors.image}</Text>
              )}

              {locationName && (
                <Text category="c1" style={{ marginVertical: 10 }}>
                  Location: {locationName}
                </Text>
              )}

              <Button
                style={styles.button}
                onPress={async () => {
                  const uploadedImage = await uploadImage(image!);
                  setImage(uploadedImage);
                  handleSubmit();

                }}
              >
                {post ? "Update Post" : "Create Post"}
              </Button>
            </Layout>
          )}
        </Formik>
        <ImageOptionsModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          setProfileImage={setImage}
        />
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
    height: "100%",
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 200,
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  imageEditIcon: {
    position: "absolute",
    right: 10,
    bottom: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 8,
    borderRadius: 20,
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
