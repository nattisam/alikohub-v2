import { useEffect, useState } from "react";
import { calcAge } from "../functions";
const NotificationCard = ({
  priority,
  title,
  description,
  time,
}: {
  title: string;
  description: string;
  time: string;
  priority: string | undefined;
}) => {
  const [notifAge, setNotifAge] = useState(calcAge(time));
  useEffect(() => {
    
    const intervalId = setInterval(()=>setNotifAge(calcAge(time)), 1000);

    return () => clearInterval(intervalId);
  }, [time]);
  return (
    <div className="bg-gray-50 p-3 rounded-md mb-2 hover:bg-gray-100 transition">
      <div className="flex items-center">
        <span className="text-yellow-500 mr-2">
          {priority === "High" ? "!" : "🔔"}
        </span>
        <h4 className="font-bold">{title}</h4>
      </div>
      <p className="text-sm">{description}</p>
      <p className="text-xs text-gray-500">{notifAge}</p>
    </div>
  );
};
export default NotificationCard;

