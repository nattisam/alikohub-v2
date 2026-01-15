import Hero from "../components/Hero";
import FeaturedEvent from "../components/FeaturedEvent";
import LatestTopics from "../components/LatestTopics";
import UpcomingEvents from "../components/UpcomingEvents";
import EventBanner from "../components/EventBanner";

const EventsHomePage = () => {
  return (
    <>
      <Hero />
      <FeaturedEvent />
      <div className="relative not-md:-top-44 -mb-32">
        <LatestTopics />
        <UpcomingEvents />
        <EventBanner />
      </div>
    </>
  );
};

export default EventsHomePage;
