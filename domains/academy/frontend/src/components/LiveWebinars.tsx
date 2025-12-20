import WebinarsCard from "./WebinarsCard";
import thumbnail from "../assets/lectureThumbnail.png"
const LiveWebinars = () => {
  return (
    <section className="flex flex-col items-center">
      <h2 className="font-extrabold text-center text-4xl">
        Live Webinar Sessions
      </h2>
      <p className="text-center w-[70%] md:w-[50%] mx-auto">
        Join our live interactive sessions with cloud experts. Ask questions in
        real-time get immediate answers.
      </p>
      <div className="w-[80%] px-10 mx-auto">
        <WebinarsCard
          thumbnail={thumbnail}
          title="Certified Azure Operations"
          hostId="1"
          description="Lorem ipsum dolor sit amet consectetur. Elit aenean pharetra vulputate morbi. Odio eu sapien cras lobortis tincidunt egestas maecenas rhoncus orci. Odio eu sapien cras lobortis tincidunt egestas maecenas rhoncus orci."
          webinarlink=""
        />
      </div>
    </section>
  );
};
export default LiveWebinars;
