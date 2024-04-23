import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const LOCATION_TASK_NAME = 'background-location-task';

export async function requestLocationPermissions() {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    console.log('Permission to access location was denied');
    return;
  }

  // You may also need background location permissions depending on your requirements
  let { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
  if (bgStatus !== 'granted') {
    console.log('Permission to access background location was denied');
    return;
  }
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

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    const locations = data;
    // Handle your location updates here
    console.log(locations);
  }
});
