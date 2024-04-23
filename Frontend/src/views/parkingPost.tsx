import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Alert, Image } from "react-native";
import {
  Divider,
  Icon,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  Card,
  List,
  useTheme,
  AnimationConfig,
} from "@ui-kitten/components";
import * as Location from "expo-location";
import { getPostsByLocation } from "../api/apiPost";
import { IconAnimationRegistry } from "@ui-kitten/components/ui/icon/iconAnimation";
import { Post } from "../models/post_model";

const BackIcon = (props: any) => <Icon {...props} name="arrow-back" />;

export const ParkingScreen = ({ navigation }: { navigation: any }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchLocationAndPosts = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Permission to access location was denied"
        );
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { longitude, latitude } = location.coords;
      console.log("Longitude: ", longitude);
      console.log("Latitude: ", latitude);

      const res = fetchPostsByLocation(longitude, latitude);
      console.log(res);
    };

    fetchLocationAndPosts();
  }, []);

  const fetchPostsByLocation = async (longitude: number, latitude: number) => {
    try {
      console.log("Fetching posts by location");
      const fetchedPosts = await getPostsByLocation(longitude, latitude);
      setPosts(fetchedPosts);
      setLoading(false);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch posts");
      console.error("Failed to fetch posts:", error);
      setLoading(false);
    }
  };

  const navigateBack = () => {
    navigation.goBack();
  };

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );
  const renderItem = ({ item }: { item: Post }) => (
    <Card style={styles.card}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.image} />
      )}
      <Text category="s1">{item.content || ""}</Text>
      <Text category="label">{`Location: ${item.location}`}</Text>
    </Card>
  );

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
      <Divider />
      <Layout style={styles.container}>
        {loading ? (
          <Text category="h6">Loading...</Text>
        ) : posts.length > 0 ? (
          <List
            data={posts}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <Text category="p1">No posts found in this location.</Text>
        )}
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    marginVertical: 8,
  },
  image: {
    width: "100%",
    height: 200,
  },
});
