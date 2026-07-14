/* eslint-disable no-undef */
// Firebase Messaging Service Worker for background notifications
// This runs in the background even when the tab is closed

importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyCuejsEMA2RcHUojy6VGGSfmTsLQkUdRAo",
  authDomain: "aliko-auth.firebaseapp.com",
  projectId: "aliko-auth",
  storageBucket: "aliko-auth.firebasestorage.app",
  messagingSenderId: "345783285092",
  appId: "1:345783285092:web:f4380e977d6ecf743b3671",
  measurementId: "G-MEKHZLS9RP",
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("[SW] Background message received:", payload);

  const { title, body, icon } = payload.notification || {};
  const data = payload.data || {};

  const notificationTitle = title || "AlikoHub Academy";
  const notificationOptions = {
    body: body || "You have a new notification",
    icon: icon || "/academy-icon.png",
    badge: "/academy-icon.png",
    tag: data.type || "general",
    data: data,
    actions: [{ action: "open", title: "View" }],
    vibrate: [200, 100, 200],
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click — navigate based on data.type
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const data = event.notification.data || {};
  let targetUrl = "/dashboard";

  switch (data.type) {
    case "ANNOUNCEMENT":
      targetUrl = "/announcements";
      break;
    case "NEW_COURSE":
      targetUrl = data.courseId ? `/courses/${data.courseId}` : "/courses";
      break;
    case "NEW_COHORT":
      targetUrl = data.courseId ? `/courses/${data.courseId}` : "/courses";
      break;
    default:
      targetUrl = "/dashboard";
  }

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // If there's already an open window, focus it and navigate
        for (const client of clientList) {
          if ("focus" in client) {
            client.focus();
            client.postMessage({
              type: "NOTIFICATION_CLICK",
              url: targetUrl,
            });
            return;
          }
        }
        // Otherwise open a new window
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      }),
  );
});
