// NotificationService.ts
import * as Notifications from "expo-notifications";

export const setupNotificationHandler = async () => {
  // Request permissions as part of the setup process
  await requestNotificationPermissions();

  // Set the notification handler
  await Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
};

// Define the function to request notification permissions
async function requestNotificationPermissions() {
  const settings = await Notifications.getPermissionsAsync();
  if (!settings.granted) {
    await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowSound: true,
        allowBadge: true,
      },
    });
  }
  if (!settings.granted) {
    console.log('Notification permissions not granted');
    return;
  }

  console.log('Notification permissions granted');

}

// Function to schedule a notification
export async function scheduleNotification() {
  console.log("Scheduling notification...");
  const categoryIdentifier = 'turn-off-actions';

  // First, define the actions if they haven't been defined yet
  await Notifications.setNotificationCategoryAsync(categoryIdentifier, [
    {
      identifier: 'turn-off-action',
      buttonTitle: 'Turn Off Now',
      options: { opensAppToForeground: true },
    },
    {
      identifier: 'dismiss-action',
      buttonTitle: 'Dismiss',
      options: { isDestructive: true, opensAppToForeground: true },
    }
  ]);

  // Then schedule the notification with the category identifier
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Noti Reminder: Turn Off Pango",
      body: "You've moved from your parking spot. Don't forget to turn off Pango to avoid unnecessary charges.",
      categoryIdentifier, // Make sure the actions are attached to the notification
    },
    trigger: null,
  });
}


