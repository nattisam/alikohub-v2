import { useNavigate } from "react-router-dom";
import WebinarsCard from "./WebinarsCard";
import thumbnail from "../assets/lectureThumbnail.png"

const UpcomingWebinars = () => {
  const navigate = useNavigate();
  
  // Sample time data - in a real app this would come from an API
  const sampleStartTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 1 week from now
  const sampleEndTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(); // 1 week from now + 2 hours

  const handleCardClick = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <section className="flex flex-col items-center">
      <h2 className="font-bold text-center text-3xl">
        Upcoming Webinar Sessions
      </h2>
      <p className="text-center w-[70%] md:w-[50%]">
        Join our live interactive sessions with cloud experts. Ask questions in
        real-time get immediate answers.
      </p>
      <div className="w-[80%] px-10 mx-auto">
        {/* Make the card clickable */}
        <div 
          onClick={() => handleCardClick("1")} 
          className="cursor-pointer hover:opacity-90 transition-opacity"
        >
          <WebinarsCard
            thumbnail={thumbnail}
            title="Certified AWS Operations"
            hostId="1"
            description="Lorem ipsum dolor sit amet consectetur. Elit aenean pharetra vulputate morbi. Odio eu sapien cras lobortis tincidunt egestas maecenas rhoncus orci. Odio eu sapien cras lobortis tincidunt egestas maecenas rhoncus orci."
            webinarlink=""
            startTime={sampleStartTime}
            endTime={sampleEndTime}
          />
        </div>
      </div>
    </section>
  );
};

export default UpcomingWebinars;