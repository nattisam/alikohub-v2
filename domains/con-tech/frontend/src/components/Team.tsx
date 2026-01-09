import owner from "../assets/owner.png";
import speciality from "../assets/speciality_contractor.png";
import general from "../assets/general_contractor.png";
import { useEffect, useRef, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const team = [
  {
    role: "General Contractor",
    img: general,
  },
  {
    role: "Owner",
    img: owner,
  },
  {
    role: "Speciality Contractor",
    img: speciality,
  },
];

/**
 * Team component displays information about three key roles: General Contractor, Owner, and Speciality Contractor.
 *
 * Layout & Responsiveness:
 * - On desktop (windowWidth >= 768px): Shows all three team roles side-by-side, each with background images and "Learn More" buttons.
 * - On mobile/tablet (windowWidth < 768px): Carousel view displays one team member at a time with navigation arrows.
 *   - User can swipe/click arrows, or carousel will auto-advance every 3 seconds.
 *   - Arrows are visible on touch devices or when the section is hovered.
 *
 * Transitions:
 * - The "current" member changes via timed interval or navigation button press, providing a slideshow/carousel effect on small screens.
 *
 * Interaction:
 * - Carousel left/right navigation is handled by onClick buttons (`handleToLeft`, `handleToRight`).
 * - "Learn More" button shown for each role, but does not trigger an event in this implementation.
 */
const Team = () => {
  const [current, setCurrent] = useState(1);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [hovered, setHovered] = useState(false);
  const intervalId = useRef<number | null>(null);
  const hasTouch = "ontouchstart" in window;

  const handleToLeft = () => {
    setCurrent((prev) => (prev === 0 ? team.length - 1 : prev - 1));
  };
  const handleToRight = () => {
    setCurrent((prev) => (prev === team.length - 1 ? 0 : prev + 1));
  };
  const resetInterval = () => {
    if (intervalId.current) clearInterval(intervalId.current);
    const id = window.setInterval(handleToRight, 3000);
    intervalId.current = id;
  };

  useEffect(() => {
    const id = window.setInterval(handleToRight, 3000);
    intervalId.current = id;
    window.addEventListener("resize", () => {
      setWindowWidth(window.innerWidth);
    });

    return () => {
      window.removeEventListener("resize", () => {
        setWindowWidth(window.innerWidth);
      });
      if (intervalId.current) clearInterval(intervalId.current);
    };
  }, []);
  return (
    <section
      className="w-full  md:bg-[#252323A1] h-fit mb-3 px-5 md:px-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex relative -left-2.5 justify-between w-[105%] translate-y-[10rem]">
      <button
        className={`${
          hasTouch && windowWidth <= 768
            ? "block"
            : hovered
            ? "block"
            : "hidden"
        } md:hidden relative bg-gradient-to-r from-[#A1A1A1] to-[#545454] rounded-full p-2`}
        // Button triggers transition to previous team member and interval reset
        onClick={() => {
          handleToLeft();
          resetInterval();
        }}
      >
        <FaAngleLeft size={30} />
      </button>
      <button
        className={`${
          hasTouch && windowWidth <= 768
            ? "block"
            : hovered
            ? "block"
            : "hidden"
        } md:hidden bg-gradient-to-r from-[#A1A1A1] to-[#545454] rounded-full p-2`}
        // Button triggers transition to next team member and interval reset
        onClick={() => {
          handleToRight();
          resetInterval();
        }}
      >
        <FaAngleRight size={30} />
      </button>
      </div>
      <div className="flex flex-row items-center justify-around md:mx-auto h-fit md:skew-x-12 bg-gradient-to-t from-[#000000A1] to-[#ffffffa1] md:w-[80%] pt-4">
        {windowWidth >= 768 &&
          team.map((member, index) => (
            <div
              key={index}
              className="md:-skew-x-12 h-[23rem] md:w-[30%] flex flex-col items-center justify-end pb-5"
              style={{
                backgroundImage: `url(${member.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="bg-[#1010104A] h-fit text-center w-fit p-2">
                <h3 className="text-lg text-white font-semibold">
                  {member.role}
                </h3>
                <button className="bg-gradient-to-r from-[#E6D600] to-[#F2F296] px-4">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        {windowWidth < 768 && (
          <div
            className="md:-skew-x-12 h-[20rem] w-[80%] md:w-[30%] flex flex-col items-center justify-end pb-5"
            style={{
              backgroundImage: `url(${team[current].img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="bg-[#1010104A] h-fit text-center w-fit p-2">
              <h3 className="text-lg text-white font-semibold">
                {team[current].role}
              </h3>
              <button className="bg-gradient-to-r from-[#E6D600] to-[#F2F296] px-4">
                Learn More
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Team;
