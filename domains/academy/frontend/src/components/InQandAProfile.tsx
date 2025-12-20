import { useEffect, useRef, useState } from "react";

const InQandAProfile = ({
  name,
  imgUrl,
  postedAt,
  qualification,
}: {
  id: string | number;
  name: string;
  imgUrl: string;
  postedAt?: string | Date;
  qualification?: string;
}) => {
  const [postedBefore, setPostedBefore] = useState<string>("");
  const intervalId = useRef<number | null>(null);
  useEffect(() => {
    if (postedAt) {
      const getTimeDif = (): string => {
        const timeDif = (Date.now() - new Date(postedAt).valueOf()) / 1_000;
        if (timeDif < 60) {
          return "Now";
        } else if (timeDif >= 60 && timeDif < 3_600) {
          return `${Math.floor(timeDif / 60)} minutes ago`;
        } else if (timeDif >= 3_600 && timeDif < 86_400) {
          return `${Math.floor(timeDif / 3_600)} hours ago`;
        } else if (timeDif >= 86400 && timeDif < 2_592_000) {
          return `${Math.floor(timeDif / 86_400)} days ago`;
        } else if (timeDif >= 2_592_000 && timeDif < 31_557_600) {
          return `${Math.floor(timeDif / 2_592_000)} Months ago`;
        } else {
          return `${Math.floor(timeDif / 31_557_600)} years ago`;
        }
      };
      intervalId.current = setInterval(
        () => setPostedBefore(getTimeDif()),
        1000
      );
      return () => {
        if (intervalId.current) clearInterval(intervalId.current);
      };
    }
  }, [postedAt]);
  return (
    <div className="flex flex-row items-center gap-2">
      <img src={imgUrl} alt={name} className="w-8 h-8 rounded-full " />
      <div>
        <p className="font-bold text-base md:text-lg">{name}</p>
        {qualification && (
          <p className="text-gray-500 text-sm">{qualification}</p>
        )}
        <p className="text-gray-500 text-sm">{postedBefore}</p>
      </div>
    </div>
  );
};
export default InQandAProfile;
