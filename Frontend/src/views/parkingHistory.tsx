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
  OverflowMenu,
  MenuItem,
  Spinner,
} from "@ui-kitten/components";
import * as Location from "expo-location";
import { deletePost, getPostsByUser } from "../api/apiPost";
import { IconAnimationRegistry } from "@ui-kitten/components/ui/icon/iconAnimation";
import { Post } from "../models/post_model";
import { PostComponent } from "../components/post";

const BackIcon = (props: any) => <Icon {...props} name="arrow-back" />;
const MoreIcon = (props: any) => <Icon {...props} name="more-vertical" />;

export const ParkingHistory = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const { user } = route.params;

  console.log(user);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = fetchPostsByUser(user._id);
      console.log(res);
    };

    fetchPosts();
  }, [user._id]);

  const fetchPostsByUser = async (userId: string) => {
    try {
      console.log("Fetching posts by user");
      const fetchedPosts = await getPostsByUser(userId);

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

  const handleEditPost = (post: Post) => {
    navigation.navigate("UploadPost", { post });
  };

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  const deletePost = async (postId: string) => {
    const newPosts = posts.filter((post) => post._id !== postId);
    setPosts(newPosts);
  }

  const renderItem = ({ item }: { item: Post }) => (
    <PostComponent
      item={item}
      onEdit={handleEditPost}
      onDelete={deletePost}
      currentUserId={user._id}
    />
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme["background-basic-color-1"],
      }}
    >
      <TopNavigation
        title="My Posts"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <Layout style={styles.container}>
        {loading ? (
          <Layout style={styles.noPost}>
            <Spinner size="giant" />
          </Layout>) : posts.length > 0 ? (
            <List
              data={posts}
              renderItem={renderItem}
              keyExtractor={(item, index) => item._id || `post-${index}`}
            />
          ) : (

          <Layout style={styles.noPost}>

            <Text category="p1">No posts found.</Text>
          </Layout>
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
  noPost: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
