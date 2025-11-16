import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Notification channels
export enum NotificationChannel {
  REMINDERS = 'reminders',
  ENGAGEMENT = 'engagement',
}

// Initialize notification channels for Android
export async function initializeNotificationChannels() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(NotificationChannel.REMINDERS, {
      name: 'Purchase Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#4CAF50',
      description: 'Notifications for your "Let Me Think" purchase reminders',
    });

    await Notifications.setNotificationChannelAsync(NotificationChannel.ENGAGEMENT, {
      name: 'Engagement Reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250],
      lightColor: '#4CAF50',
      description: 'Gentle reminders to use Save Up',
    });
  }
}

// Request notification permissions
export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    console.error('Push notifications only work on physical devices');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.error('Failed to get push notification permissions');
    return null;
  }

  // Get the Expo push token (optional - for remote notifications)
  // const token = (await Notifications.getExpoPushTokenAsync()).data;
  // return token;

  return 'local-only'; // We're using local notifications only
}

// Schedule a "Let Me Think" reminder notification
export async function scheduleReminderNotification(
  itemName: string,
  itemPrice: number,
  remindAt: Date,
  reminderId: string
): Promise<string | null> {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ Time to Decide!',
        body: `Ready to decide on "${itemName}" ($${itemPrice.toFixed(2)})?`,
        data: { 
          type: 'reminder',
          reminderId,
          itemName,
          itemPrice,
        },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        categoryIdentifier: NotificationChannel.REMINDERS,
      },
      trigger: {
        date: remindAt,
        channelId: NotificationChannel.REMINDERS,
      },
    });

    return notificationId;
  } catch (error) {
    console.error('Error scheduling reminder notification:', error);
    return null;
  }
}

// Cancel a specific reminder notification
export async function cancelReminderNotification(notificationId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
}

// Cancel all reminder notifications for a specific reminder
export async function cancelAllReminderNotifications(): Promise<void> {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    const reminderNotifications = scheduledNotifications.filter(
      (notif) => notif.content.data?.type === 'reminder'
    );

    for (const notif of reminderNotifications) {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier);
    }
  } catch (error) {
    console.error('Error canceling all reminder notifications:', error);
  }
}

// Schedule periodic "Save Up" engagement notifications
export async function scheduleEngagementNotifications(enabled: boolean): Promise<void> {
  try {
    // Cancel any existing engagement notifications
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    const engagementNotifications = scheduledNotifications.filter(
      (notif) => notif.content.data?.type === 'engagement'
    );

    for (const notif of engagementNotifications) {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier);
    }

    if (!enabled) return;

    // Schedule engagement notifications (twice per week)
    const messages = [
      "💰 Ready to make smarter spending decisions?",
      "🎯 Check your savings progress!",
      "💡 Before you buy, calculate the true cost",
      "⏱ How many work hours is that purchase worth?",
      "📊 See how much you've saved this month",
    ];

    // Schedule 2 notifications per week at different times
    const daysUntilNotification = [3, 7]; // Every 3 and 7 days
    
    for (let i = 0; i < daysUntilNotification.length; i++) {
      const triggerDate = new Date();
      triggerDate.setDate(triggerDate.getDate() + daysUntilNotification[i]);
      triggerDate.setHours(19, 0, 0, 0); // 7 PM

      await Notifications.scheduleNotificationAsync({
        content: {
          title: '💚 Hey, Save Up!',
          body: messages[i % messages.length],
          data: { 
            type: 'engagement',
          },
          sound: true,
          priority: Notifications.AndroidNotificationPriority.DEFAULT,
          categoryIdentifier: NotificationChannel.ENGAGEMENT,
        },
        trigger: {
          date: triggerDate,
          channelId: NotificationChannel.ENGAGEMENT,
          repeats: true,
        },
      });
    }
  } catch (error) {
    console.error('Error scheduling engagement notifications:', error);
  }
}

// Get all scheduled notifications (for debugging)
export async function getScheduledNotifications() {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
}

// Handle notification tap/press
export function addNotificationResponseListener(
  callback: (response: Notifications.NotificationResponse) => void
) {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

// Handle notification received while app is in foreground
export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void
) {
  return Notifications.addNotificationReceivedListener(callback);
}
