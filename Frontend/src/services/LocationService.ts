import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { scheduleNotification } from "./NotificationService";
import { getDistanceFromLatLonInKm } from "../utils/LocationUtils";

const LOCATION_TASK_NAME = "background-location-task";
let lastLocation: Location.LocationObject | null = null;

export async function requestLocationPermissions() {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    console.log("Permission to access location was denied");
    return false;
  }

  // You may also need background location permissions depending on your requirements
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
  await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
}

interface TaskData {
  locations: Location.LocationObject[];
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
      const timeElapsed =
        (currentLocation.timestamp - lastLocation.timestamp) / 1000; // time in seconds
      const speedKmH = (distance / timeElapsed) * 3600;
      console.log("Current Speed (km/h):", speedKmH);
      if (speedKmH > 40) {
        scheduleNotification();
      }

      console.log("Current Speed (km/h):", speedKmH);
    }

    // Update lastLocation with currentLocation for the next update
    lastLocation = currentLocation;
  }
});
