// NotificationService.ts
import * as Notifications from 'expo-notifications';

export async function scheduleNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You're going too fast!",
      body: 'Slow down, you are exceeding 40 km/h.',
    },
    trigger: null, // Immediate notification
  });
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
