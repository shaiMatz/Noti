import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet, Text, Image } from "react-native";
import { format } from "date-fns";
import * as SecureStore from 'expo-secure-store';

const AnimatedImage = Animated.createAnimatedComponent(Image);

const SpinningTimer = ({ timerTime }: { timerTime: number }) => {
  const rotation = useRef(new Animated.Value(0)).current;

  // Start the rotation using a side effect
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: true,
      })
    ).start();
  }, [rotation]);

  // Create an animated style for the image
  const animatedStyle = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const formattedTime = format(new Date(timerTime), "mm:ss"); // Make sure you've imported 'format' from 'date-fns'

  return (
    <Animated.View style={styles.container}>
      <AnimatedImage
        source={require("../../assets/loadingCircle.png")}
        style={[styles.image, { transform: [{ rotate: animatedStyle }] }]}
      />
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formattedTime}</Text>
        <Text style={styles.stopText}>Stop</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: 200, // Adjust the size to fit your design
    height: 200, // Adjust the size to fit your design
  },
  image: {
    width: 200, // Adjust the size to fit your design
    height: 200, // Adjust the size to fit your design
  },
  timerContainer: {
    position: "absolute",
  },
  timerText: {
    fontSize: 34, // Adjust the size to fit your design
    color: "#000000", // Change the color to fit your design
    fontWeight: "bold",
  },
  stopText: {
    padding: 3,
    textAlign: "center",
    fontSize: 16, // Adjust the size to fit your design
    color: "#000000", // Change the color to fit your design
    fontWeight: "bold",
  },
});

export default SpinningTimer;
