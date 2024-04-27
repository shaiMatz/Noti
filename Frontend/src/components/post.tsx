import React, { useState } from "react";
import {
  Card,
  Icon,
  MenuItem,
  OverflowMenu,
  Text,
  IconElement,
} from "@ui-kitten/components";
import { Alert, Image, StyleSheet, View } from "react-native";
import { deletePost } from "../api/apiPost";
import { Post } from "../models/post_model";

const MenuIcon = (props: any): IconElement => (
  <Icon
    style={{ width: 15, height: 15, padding: 0, borderRadius: 50 }}
    fill="#8F9BB3"
    name="more-vertical"
  />
);
const DeleteIcon = (props: any): IconElement => (
  <Icon
    style={{ width: 15, height: 15, marginRight: 5 }}
    fill="#8F9BB3"
    name="trash-2-outline"
  />
);

const EditIcon = (props: any): IconElement => (
  <Icon
    style={{ width: 15, height: 15, marginRight: 5 }}
    fill="#8F9BB3"
    name="edit-outline"
  />
);
export const PostComponent = ({
  item,
  onEdit,
  onDelete,
  currentUserId,
}: {
  item: Post;
  onEdit: (post: Post) => void;
  onDelete: (postId: string) => void;
  currentUserId: string;
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const toggleMenu = () => setMenuVisible(!menuVisible);

  const renderMenuAction = () => (
    <MenuItem accessoryLeft={MenuIcon} onPress={toggleMenu} />
  );

  const handleDeletePost = async (postId: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this post?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            const res = await deletePost(postId);
            if (res)
                onDelete(postId);
            toggleMenu();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderOverflowMenuAction = (): React.ReactElement => (
    <OverflowMenu
      anchor={renderMenuAction}
      visible={menuVisible}
      onBackdropPress={toggleMenu}
    >
      <MenuItem
        accessoryLeft={EditIcon}
        title="Edit"
        onPress={() => {onEdit(item); toggleMenu();}}
      />
      <MenuItem
        accessoryLeft={DeleteIcon}
        title="Delete"
        onPress={() => handleDeletePost(item._id)}
      />
    </OverflowMenu>
  );



  return (
    <Card style={styles.card}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.image} />
      )}
      <View style={styles.headerContainer}>
        <Text category="p1">{item.content || ""}</Text>
        {currentUserId === item.userId && renderOverflowMenuAction()}
      </View>
      <Text category="c1">{`Location: ${item.location}`}</Text>
    </Card>
  );
};
function fetchPostsByUser(_id: any) {
  throw new Error("Function not implemented.");
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    borderRadius: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },

  image: {
    width: "100%",
    height: 200,
    borderRadius: 7,
  },
});
