import { useState, useEffect } from "react";

import eventImg from "../assets/mask_group.png";
import eventBg from "../assets/Rectangle.png";

const EventBanner = ({
  title = "Africa Tech Festival 2024",
  description = "We're excited to announce that AlikoHub will be showcasing its innovative visa and opportunity-matching platform at Africa Tech Festival 2024, Africa's largest and most influential tech event. Join us in Cape Town to explore how AlikoHub is revolutionizing access to global education, travel, and work.",
  targetDate = new Date("2025-11-12"),
  eventBgImg = eventBg,
  eventThumb = eventImg,
}) => {
  const calculateTimeLeft = () => {
    const difference = +targetDate - +new Date();
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);
  
  const [winWidth, setWinWidth] = useState(window.innerWidth);
  useEffect(() => {
    const resetWidthState = () => {
      setWinWidth(window.innerWidth);
    };
    window.addEventListener("resize", resetWidthState);
    return () => {
      window.removeEventListener("resize", resetWidthState);
    };
  });

  return (
    <section className="">
      <div
        className="flex flex-col md:flex-row gap-4 items-center justify-between  bg-cover bg-center"
        style={{
          backgroundImage: `url(${winWidth < 700 ? eventThumb : eventBgImg})`,
        }}
      >
        <img
          src={eventImg}
          alt={title}
          className="md:block hidden md:w-2/5 md:h-[20rem]"
        />
        <div className="w-full not-md:bg-black/40">
          <div className="p-4">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            <p>{description}</p>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-5 p-8 text-center mt-4 md:mt-0">
            <div className="px-2 md:px-6 border-2 border-gray-500 rounded flex justify-center space-x-4">
              <div className="text-white py-2 rounded">
                <span className="text-lg md:text-2xl font-bold ">
                  {timeLeft.days}
                </span>
                <br />
                Days
              </div>
              <span className="text-lg md:text-2xl font-bold py-2"> : </span>
              <div className="text-white py-2">
                <span className="text-lg md:text-2xl font-bold">
                  {timeLeft.hours}
                </span>
                <br />
                Hours
              </div>
              <span className="text-lg md:text-2xl font-bold py-2"> : </span>
              <div className="text-white py-2 rounded">
                <span className="text-lg md:text-2xl font-bold ">
                  {timeLeft.minutes}
                </span>
                <br />
                Minutes
              </div>
              <span className="text-lg md:text-2xl font-bold py-2"> : </span>
              <div className="text-white py-2 rounded">
                <span className="text-lg md:text-2xl font-bold">
                  {timeLeft.seconds}
                </span>
                <br />
                Seconds
              </div>
            </div>
            <button className="bg-[#1376C0] text-white px-3 py-1 rounded m hover:bg-blue-400 transition">
              Register Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventBanner;
