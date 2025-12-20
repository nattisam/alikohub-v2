import { FaBell } from "react-icons/fa";

interface NotificationProps {
  message: string;
}

const Notification: React.FC<NotificationProps> = ({ message }) => (
  <div className="bg-yellow-100 p-4 rounded-lg shadow-md flex items-center">
    <FaBell className="text-yellow-500 mr-2" />{" "}
    <span className="text-gray-700">{message}</span>
  </div>
);

export default Notification;
