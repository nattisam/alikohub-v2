import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import WebinarsCard from "../components/WebinarsCard";
import thumbnail from "../assets/lectureThumbnail.png";

// Define types
type Host = {
  id: string;
  name: string;
  avatar: string;
  qualification: string;
};

type EventDetails = {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  host: Host;
  webinarlink: string;
};

const EventDetailsPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState<Partial<EventDetails>>({});

  // Mock data - in a real app this would come from an API
  useEffect(() => {
    // Simulate API call to fetch event details
    const fetchEventDetails = async () => {
      // Mock data
      const mockEvent: EventDetails = {
        id: eventId || "1",
        title: "Certified AWS Operations",
        description: "Lorem ipsum dolor sit amet consectetur. Elit aenean pharetra vulputate morbi. Odio eu sapien cras lobortis tincidunt egestas maecenas rhoncus orci. Odio eu sapien cras lobortis tincidunt egestas maecenas rhoncus orci.",
        startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // 1 week from now + 2 hours
        host: {
          id: "1",
          name: "John Doe",
          avatar: `https://avatar.iran.liara.run/public/12`,
          qualification: "Cloud Expert",
        },
        webinarlink: "",
      };
      
      setEventDetails(mockEvent);
      setEditedEvent(mockEvent);
    };

    fetchEventDetails();
  }, [eventId]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // In a real app, this would make an API call to save the changes
    if (eventDetails) {
      setEventDetails({
        ...eventDetails,
        ...editedEvent,
      } as EventDetails);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset the edited event to the original values
    if (eventDetails) {
      setEditedEvent(eventDetails);
    }
    setIsEditing(false);
  };

  const handleChange = (field: keyof EventDetails, value: string) => {
    setEditedEvent(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!eventDetails) {
    return <div>Loading event details...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-4 text-blue-500 hover:text-blue-700"
      >
        ← Back to Events
      </button>
      
      <h1 className="text-3xl font-bold mb-6">Event Details</h1>
      
      {!isEditing ? (
        <div>
          <WebinarsCard
            thumbnail={thumbnail}
            title={eventDetails.title}
            hostId={eventDetails.host.id}
            description={eventDetails.description}
            webinarlink={eventDetails.webinarlink}
            startTime={eventDetails.startTime}
            endTime={eventDetails.endTime}
          />
          
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Edit Event
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Edit Event</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={editedEvent.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={editedEvent.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows={4}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startTime">
              Start Time
            </label>
            <input
              id="startTime"
              type="datetime-local"
              value={editedEvent.startTime ? new Date(editedEvent.startTime).toISOString().slice(0, 16) : ""}
              onChange={(e) => handleChange("startTime", new Date(e.target.value).toISOString())}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endTime">
              End Time
            </label>
            <input
              id="endTime"
              type="datetime-local"
              value={editedEvent.endTime ? new Date(editedEvent.endTime).toISOString().slice(0, 16) : ""}
              onChange={(e) => handleChange("endTime", new Date(e.target.value).toISOString())}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailsPage;