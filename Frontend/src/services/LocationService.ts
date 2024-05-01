import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { scheduleNotification, unScheduleNotification } from "./NotificationService";
import { getDistanceFromLatLonInKm } from "../utils/LocationUtils";

const LOCATION_TASK_NAME = "background-location-task";
let lastLocation: Location.LocationObject | null = null;
let notificationSent = false; // Flag to track if notification has been sent

export async function requestLocationPermissions() {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    console.log("Permission to access location was denied");
    return false;
  }

  let { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
  if (bgStatus !== "granted") {
    console.log("Permission to access background location was denied");
    return false;
  }
  return true;
}

export async function startLocationUpdates() {
  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.High,
    distanceInterval: 0, // Receive updates only when the location has changed
    timeInterval: 1000, // Receive updates every second
    deferredUpdatesInterval: 1000, // Defer updates when the app is in the background
    deferredUpdatesDistance: 1, // Minimum distance in meters to defer
  });
}

export async function stopLocationUpdates() {
  console.log("Attempting to stop location updates");
  try {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    await unScheduleNotification();
    console.log("Location updates stopped successfully");
  } catch (error) {
    console.error("Failed to stop location updates:", error);
  }
}

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    console.error("Location Task Error:", error);
    return;
  }
  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    const currentLocation = locations[locations.length - 1];
    if (lastLocation && currentLocation) {
      const distance = getDistanceFromLatLonInKm(
        lastLocation.coords.latitude,
        lastLocation.coords.longitude,
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );
      const timeElapsed = (currentLocation.timestamp - lastLocation.timestamp) / 1000;
      const speedKmH = (distance / timeElapsed) * 3600;

      if (speedKmH > 40 && !notificationSent) {
        console.log("Current Speed (km/h):", speedKmH);
        scheduleNotification();
        notificationSent = true; // Set the flag to true after sending notification
      } else if (speedKmH <= 40) {
        notificationSent = false; // Reset the flag if speed goes below 40 km/h
      }
    }

    // Update lastLocation with currentLocation for the next update
    lastLocation = currentLocation;
  }
});
