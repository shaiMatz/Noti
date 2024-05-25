import React from 'react';
import { Modal, StyleSheet, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {
    Text,
  } from "@ui-kitten/components";
import { uploadImage } from '../api/apiPost';




const ImageOptionsModal = ({ modalVisible, setModalVisible, setProfileImage }: { modalVisible: boolean, setModalVisible: (visible: boolean) => void, setProfileImage: (image: string) => void }) => {
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri); // Note: Adjust according to the correct result structure
      setModalVisible(false);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri); // Note: Adjust according to the correct result structure
      setModalVisible(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <TouchableOpacity
        style={styles.fullScreenButton}
        activeOpacity={1}
        onPressOut={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <TouchableWithoutFeedback>
            <View style={styles.modalView}>
              <Text style={styles.modalText} category="h6">Choose a Profile Image</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={pickImage}
              >
                <Text style={styles.textStyle}>Pick an Image from Gallery</Text>
              </TouchableOpacity>
              <Text style={styles.modalText} category="p1"> - OR -</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={takePhoto}
              >
                <Text style={styles.textStyle}>Take a Photo</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
  const styles = StyleSheet.create({
  fullScreenButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1193F3", 
    borderStyle: "dashed",
    padding: 10,
    backgroundColor: "#1193F350", 
    marginBottom: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  });


export default ImageOptionsModal;