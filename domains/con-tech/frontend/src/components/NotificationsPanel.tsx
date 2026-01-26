import NotificationCard from "./NotificationCard";
import type { Notification } from "./types";
const NotificationsPanel = ({
  notifications,
}: {
  notifications: Notification[];
}) => {
  return (
    <section className="flex-1 bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-bold mb-4">Notifications</h2>
      <div className="overflow-y-auto overflow-x-hidden">
        {notifications.map((notif, index) => (
            <NotificationCard key={index} title={notif.title} description={notif.description} time={notif.time} priority={notif.priority}/>
          )
        )}
      </div>
    </section>
  );
};

export default NotificationsPanel;