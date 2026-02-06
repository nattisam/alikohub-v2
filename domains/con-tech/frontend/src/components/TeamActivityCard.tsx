import { useState, useEffect } from "react";
import { calcAge } from "../functions";
import type { User } from "./types";

const TeamActivityCard = ({
  avatar,
  user,
  action,
  time,
}: {
  avatar: string;
  action: string;
  time: string;
  user: User;
}) => {
  const [activityAge, setActivityAge] = useState(calcAge(time));

  useEffect(() => {
    const intervalId = setInterval(() => setActivityAge(calcAge(time)));
    return () => clearInterval(intervalId);
  });
  return (
    <div className="flex items-center bg-gray-50 p-3 rounded-md mb-2 hover:bg-gray-100 transition">
      <img
        src={avatar}
        alt={`${user.firstName} ${user.lastName}`}
        className="w-8 h-8 rounded-full mr-3"
      />
      <div>
        <p className="font-bold">
          {user.firstName} {user.lastName} {action}
        </p>
        <p className="text-xs text-gray-500">{activityAge}</p>
      </div>
    </div>
  );
};
export default TeamActivityCard;
