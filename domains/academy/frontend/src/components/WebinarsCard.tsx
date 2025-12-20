import { useEffect, useState } from "react";
import Card from "../../../../../libraries/ui-libraries/components/Card";

type Host = {
  id: string;
  name: string;
  avatar: string;
  qualification: string;
};

type Webinar = {
  id?: string;
  thumbnail: string;
  title: string;
  hostId: string;
  description: string;
  webinarlink: string;
  startTime?: string; // Add startTime property
  endTime?: string;   // Add endTime property
};

const WebinarsCard = ({
  thumbnail,
  title,
  hostId,
  description,
  webinarlink,
  startTime,
  endTime
}: Webinar) => {
  const [host, setHost] = useState<Host | null>(null);
  
  useEffect(() => {
    const fetchHostDetail = async (id: string | number) => {
      // TODO: implement fetchHostDetail
      console.log(`fetching data about ${id}`);
      setHost({
        id: "1",
        name: "John Doe",
        avatar: `https://avatar.iran.liara.run/public/12`,
        qualification: "Cloud Expert",
      });
    };
    fetchHostDetail(hostId);
  }, [hostId]);
  
  // Format the time for display
  const formatTime = (timeString?: string) => {
    if (!timeString) return "Time not specified";
    try {
      const date = new Date(timeString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return date.toLocaleString(); // This will format according to user's locale
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Invalid date";
    }
  };

  return (
    <Card
      img={thumbnail}
      title={title}
      content={description}
      actions={[
        {
          label: "Join",
          onClick: () => {
            // TODO: request to join Using the webinarlink and redirect to the live webinar
            console.log(`the webinar link is: ${webinarlink}`);
          },
          className:
            "rounded-2xl bg-gradient-to-r from-[#E6D600] to-[#F2F296] row-start-6 md:col-span-2 md:col-start-7",
        },
      ]}
      className="max-w-full max-h-[60vh] md:grid md:grid-cols-12 grid-cols-1 grid-rows-6 gap-4 py-5"
      imgClassName={"hidden md:col-start-1 md:row-start-1 md:col-span-6 md:row-span-6"}
      titleClassName={"md:col-span-6 md:row-span-1 md:col-start-6 row-start-1 font-extrabold text-lg"}
      contentClassName={"md:col-span-7 md:col-start-6 row-start-3 text-base"}
    >
      <div className="row-span-1 col-span-4 col-start-7 row-start-2 flex flex-row">
        <img className="rounded-full max-w-[3rem] max-h-[3rem]" src={host?.avatar} alt="Host Instructor" />
        <div>
          <p className="font-semibold text-sm">Instructor: {host?.name}</p>
          <p className="text-[#6B7280] text-sm">{host?.qualification}</p>
        </div>
      </div>
      
      {/* Display event time information */}
      <div className="row-span-1 col-span-6 col-start-6 row-start-5 flex flex-col">
        <p className="font-semibold text-sm">Start Time: {formatTime(startTime)}</p>
        {endTime && <p className="font-semibold text-sm">End Time: {formatTime(endTime)}</p>}
      </div>
    </Card>
  );
};

export default WebinarsCard;