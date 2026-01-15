import React, { useState, useEffect, useRef } from "react";
import { Play } from "lucide-react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import testimonialThumbnail1 from "../assets/testimony_thumbnail.png";
import testimonialThumbnail2 from "../assets/testimony_thumbnail2.png";
interface Story {
  id: number;
  name: string;
  text: string;
  avatar: string;
  image: string;
}

const stories: Story[] = [
  {
    id: 1,
    name: "Daniel Alexandar",
    text: "Aliko transformed how we work. Even when we’re offline on site, the mobile app syncs back later. I finally feel in control, and our clients trust us more. It’s not just tech—it’s smart construction for Africa.",
    avatar: "https://i.pravatar.cc/100?img=1",
    image: testimonialThumbnail1,
  },
  {
    id: 2,
    name: "Sophia Johnson",
    text: "The platform boosted our efficiency by 40%. Communication and trust with clients have never been better.",
    avatar: "https://i.pravatar.cc/100?img=2",
    image: testimonialThumbnail2,
  },
  {
    id: 3,
    name: "Michael Lee",
    text: "Even in remote locations, syncing works flawlessly. This is the future of smart construction.",
    avatar: "https://i.pravatar.cc/100?img=3",
    image: testimonialThumbnail1,
  },
  {
    id: 4,
    name: "Emily Davis",
    text: "Aliko's tools have made project management a breeze. We're hitting deadlines like never before.",
    avatar: "https://i.pravatar.cc/100?img=4",
    image: testimonialThumbnail2,
  },
];

/**
 * CustomerStories component displays a carousel of customer testimonials with animated transitions.
 *
 * Layout & Responsiveness:
 * - Occupies a fixed-height section suitable for both desktop (md breakpoint) and mobile.
 * - On desktop: Text on the left, testimonial image with play icon on the right.
 * - On mobile: The right image column is hidden.
 *
 * Transitions:
 * - Animated slide transition (from right to left) whenever the current testimonial changes, achieved using refs and transition styles in a useEffect.
 * - Auto-advances every 5 seconds (via interval).
 *
 * Interaction:
 * - Left/right arrow buttons to change testimonial; onClick these both change the slide and reset the interval.
 * - Dots navigation at the bottom: Clicking a dot sets the corresponding testimonial (`onClick` on the span).
 * - "See all stories" link navigates to a full stories page.
 */
const CustomerStories: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const intervalId = useRef<null | number>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  // Auto-scroll to side way
  useEffect(() => {
    intervalId.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % stories.length);
    }, 5000);
    return () => {
      if (intervalId.current) clearInterval(intervalId.current);
    };
  }, []);

  useEffect(() => {
    if (storyRef.current) {
      // slide the whole story container in from right to left when `current` changes
      const el = storyRef.current as HTMLDivElement;
      // start off to the right and invisible
      el.style.transition = "none";
      el.style.transform = "translateX(100%)";
      el.style.opacity = "0";
      // force reflow so the browser acknowledges the starting position
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      el.offsetHeight;
      // animate to the natural position
      requestAnimationFrame(() => {
        el.style.transition = "transform 500ms ease, opacity 300ms ease";
        el.style.transform = "translateX(0)";
        el.style.opacity = "1";
      });
      // cleanup inline styles after animation completes
      const onEnd = (e: TransitionEvent) => {
        if (e.target === el) {
          el.style.transition = "";
          el.style.transform = "";
          el.style.opacity = "";
          el.removeEventListener("transitionend", onEnd);
        }
      };
      el.addEventListener("transitionend", onEnd);
    }
  }, [current]);
  const resetInterval = () => {
    if (intervalId.current) clearInterval(intervalId.current);
    intervalId.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % stories.length);
    }, 5000);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % stories.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + stories.length) % stories.length);
  };

  return (
    <section className="static w-[95%] max-w-full mx-auto flex flex-col items-center justify-center my-5 h-[30rem] md:h-[80vh]">
      <div className="mx-auto h-[90%] w-full">
        <div className="w-[100%] relative h-0 translate-y-[13rem] md:translate-y-[calc(0.5*80vh)] z-20 flex items-center justify-between">
          <button
            className="h-fit w-fit rounded-full bg-[#FFFFFF7D] p-2"
            // Left arrow: Slide to previous testimonial and reset auto-advance interval
            onClick={() => {
              prevSlide();
              resetInterval();
            }}
          >
            <FiArrowLeft size={30} color="#000000F7" />
          </button>

          <button
            className="h-fit w-fit rounded-full bg-[#FFFFFF7D] p-2"
            // Right arrow: Slide to next testimonial and reset auto-advance interval
            onClick={() => {
              nextSlide();
              resetInterval();
            }}
          >
            <FiArrowRight size={30} color="#000000F7" />
          </button>
        </div>
        <div
          ref={storyRef}
          className="flex flex-row not-md:items-stretch my-2 min-h-full max-h-full min-w-full"
        >
          <div className="w-full md:w-1/2 min-h-full flex flex-col justify-start text-white bg-[#333130] p-5">
            <h2 className="font-semibold text-4xl justify-self-start my-5">
              Customer Story
            </h2>
            <div className="flex gap-3 flex-row items-end my-5">
              <img
                src={stories[current].avatar}
                alt={stories[current].name}
                className="rounded-full w-16 h-16"
              />
              <h3 className="font-semibold text-2xl">
                {stories[current].name}
              </h3>
            </div>
            <p className="text-xl pl-10">"{stories[current].text}"</p>
          </div>
          <div
            className="min-h-full hidden md:w-1/2 md:flex items-center justify-center rounded-0 overflow-hidden"
            style={{
              backgroundImage: `url(${stories[current].image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="w-fit h-fit rounded-full border-6 border-[#EBAD22] p-3 flex justify-center items-center">
              <Play size={50} strokeWidth={5} color="#EBAD22" />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-4 flex justify-center items-center my-2 not-md:my-4">
        {stories.map((_, index) => (
          <span
            key={index}
            className={`inline-block w-2 h-2 mx-1 rounded-full ${
              current === index ? "bg-yellow-500" : "bg-gray-300"
            }`}
            // Dot: Jump to a testimonial and reset auto-advance interval
            onClick={() => {
              setCurrent(index);
              resetInterval();
            }}
          ></span>
        ))}
      </div>
      <a
        href="/stories"
        className="flex flex-row items-center text-sm text-yellow-500"
      >
        See all stories <FiArrowRight size={20} className="mx-2" />
      </a>
    </section>
  );
};

export default CustomerStories;
