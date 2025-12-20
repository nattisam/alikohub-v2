import { useState } from "react";
import { FaEdit, FaCheck } from "react-icons/fa";


interface MessageProps {
  name: string;
  time: string;
  message: string;
  onReply: () => void;
  onEdit: (newMessage: string) => void;
  onMarkAsRead?: () => void;
  id: number;
  profilePic: string;
}

const Message: React.FC<MessageProps> = ({
  name,
  time,
  message,
  profilePic,
  onReply,
  onEdit,
  onMarkAsRead,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(message);

  const handleEditSubmit = () => {
    onEdit(editedMessage);
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-200 p-4 rounded-lg shadow-md mb-4 flex items-start">
      <img
        src={profilePic}
        alt="Profile"
        className="w-8 h-8 rounded-full mr-2"
      />
      <div className="flex-1">
        <p className="text-sm">
          <strong>{name}</strong> <span className="text-gray-500">{time}</span>
        </p>
        {isEditing ? (
          <div className="flex space-x-2">
            <input
              type="text"
              value={editedMessage}
              onChange={(e) => setEditedMessage(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button
              onClick={handleEditSubmit}
              className="bg-green-500 text-white px-2 py-1 rounded"
            >
              <FaCheck />
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-2 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex flex-row justify-between">
          <p className="text-gray-700">{message}</p>
          <div className="mt-2 space-x-2">
          <button onClick={() => onReply()} className="text-blue-500">
            Reply
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="text-yellow-500"
          >
            <FaEdit />
          </button>
          {onMarkAsRead && (
            <button
              onClick={onMarkAsRead}
              className="text-green-500"
            >
              Mark as Read
            </button>
          )}
        </div>
        </div>
        )}
        
      </div>
    </div>
  );
};

export default Message;
