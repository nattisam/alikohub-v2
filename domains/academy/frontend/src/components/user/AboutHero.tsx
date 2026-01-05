import image1 from "../../assets/image1.png";
import blur from "../../assets/Blur1.png";
import outdoor from "../../assets/outdoor.jpg";
import joyful from "../../assets/joyful.jpg";
import man from "../../assets/man.png";
import lovely from "../../assets/lovely.jpg";
import side from "../../assets/side-view.png";
import { FiPlay } from "react-icons/fi";

const AboutHero = () => {
  return (
    <section className="overflow-y-hidden max-h-[95vh] bg-gradient-to-t from-[#000000ea] to-[#f0f0f01a] md:bg-none relative flex justify-center items-center pt-10 md:pt-0">
      <div className="absolute top-0 left-0 h-full hidden md:block">
        <img
          src={blur}
          className="absolute top-0  left-0 w-1/2 h-3/4 object-cover"
        />
        <img src={image1} className="left-0 h-full w-3/4" />
      </div>
      <h1
        className="absolute top-2/3 md:top-1/2 left-1/6 md:left-2/5 text-6xl  md:text-6xl font-[800] text-white  md:text-[#1C1800]"
        style={{ textShadow: "2px 2px 4px gray", letterSpacing: "1px" }}
      >
        About Us
      </h1>
      <img src={blur} className="absolute -right-20 -top-52 rotate-180"/>
      <div className="grid grid-cols-3 md:grid-cols-2 w-full md:w-fit gap-4 -z-10 md:translate-x-[130%]">
        <div className="animate-scroll-up-merged ">
          <div className="grid grid-cols-10 grid-rows-3 w-[calc(100vw/4)] md:w-[8rem]">
            <img
              className="col-span-8  object-cover rounded-full h-[15rem] md:h-[20rem] my-5"
              src={side}
              alt="A Young man carrying his laptop"
            />
            <div className="col-span-2 flex justify-start">
              <FiPlay
                size={30}
                color="white"
                fill={"white"}
                className="self-center mx-auto p-1 bg-[#bdbbbba5] rounded-full -left-8"
              />
            </div>
            <img
              className="col-span-8 object-cover rounded-full h-[15rem] md:h-[20rem] my-5"
              src={lovely}
              alt="A lady carrying her class materials"
            />
            <div className="col-span-2 relative flex justify-end -left-4">
              <FiPlay
                size={40}
                color="white"
                fill={"white"}
                className="self-start mx-auto p-2 bg-[#bdbbbba5] rounded-full -left-8"
              />
            </div>
            <img
              className="col-span-8 object-cover rounded-full h-[15rem] md:h-[20rem] my-5"
              src={outdoor}
              alt="A lady taking note on outdoor"
            />
          </div>
          <div className="grid grid-cols-10 grid-rows-3 w-[calc(100vw/4)] md:w-[8rem]">
            <img
              className="col-span-8 object-cover rounded-full h-[15rem] md:h-[20rem] my-5"
              src={side}
              alt="A Young man carrying his laptop"
            />
            <div className="col-span-2 relative flex justify-end -left-8">
              <FiPlay
                size={40}
                color="white"
                fill={"white"}
                className="self-center mx-auto p-1 bg-[#bdbbbba5] rounded-full"
              />
            </div>
            <img
              className="col-span-8 object-cover rounded-full h-[15rem] md:h-[20rem] my-5"
              src={lovely}
              alt="A lady taking note on outdoor"
            />
            <div className="col-span-2 relative flex justify-start">
              <FiPlay
                size={40}
                color="white"
                fill={"white"}
                className="self-center mx-auto p-1 bg-[#bdbbbba5] rounded-full -left-8"
              />
            </div>
            <img
              className="col-span-8 object-cover rounded-full h-[15rem] md:h-[20rem] my-5"
              src={outdoor}
              alt="A lady carrying her class materials"
            />
          </div>
        </div>
        <div className="animate-scroll-down-merged">
          <div className="grid grid-cols-10 grid-rows-3 w-[calc(100vw/4)] md:w-[8rem]">
            <img
              className="col-span-8 object-cover rounded-full h-[15rem] md:h-[20rem] my-5"
              src={man}
              alt="A Young man looking at laptop"
            />
            <img
              className="col-span-8 object-cover rounded-full h-[15rem] md:h-[20rem] my-5"
              src={lovely}
              alt="A lady carrying her class materials"
            />
            <div className="col-span-2 flex relative justify-end -left-8">
              <FiPlay
                size={40}
                color="white"
                fill={"white"}
                className="self-center mx-auto p-1 bg-gray-300 rounded-full"
              />
            </div>
            <img
              className="col-span-8 object-cover rounded-full h-[15rem] md:h-[20rem] my-5"
              src={joyful}
              alt="A joyful lady"
            />
          </div>
          <div className="grid grid-cols-10 grid-rows-3 w-[calc(100vw/4)] md:w-[8rem]">
            <img
              className="col-span-8 object-cover rounded-full h-[15rem] md:h-[20rem] my-5"
              src={man}
              alt="A Young man looking at laptop"
            />
            <img
              className="col-span-8 object-cover rounded-full h-[15rem] md:h-[20rem] my-5"
              src={lovely}
              alt="A lady carrying her class materials"
            />
            <div className="col-span-2 flex justify-start">
              <FiPlay
                size={40}
                color="white"
                fill={"white"}
                className="self-center mx-auto p-1 bg-[#bdbbbba5] rounded-full -left-8"
              />
            </div>
            <img
              className="col-span-8 object-cover rounded-full h-[15rem] md:h-[20rem] my-5"
              src={joyful}
              alt="A joyful lady unpacking her back-pack"
            />
            <div className="relative top-5 w-20 h-16 mx-5 bg-pink-200 rounded-full"></div>
          </div>
        </div>
        <div className="animate-scroll-up-merged md:hidden">
          <div className="grid grid-cols-10 grid-rows-3 w-[calc(100vw/4)] md:w-[8rem]">
            <img
              className="col-span-8 object-cover rounded-full h-[15rem] md:h-[20rem] my-5"
              src={joyful}
            />
            <img
              className="col-span-8 object-cover rounded-full h-[15rem] md:h-[20rem] my-5"
              src={man}
              alt="Young man looking onto his laptop"
            />
            <img
              className="col-span-8 object-cover rounded-full h-[15rem] md:h-[20rem] my-5"
              src={outdoor}
              alt="A lady taking note on outdoor"
            />
          </div>
          <div className="grid grid-cols-10 grid-rows-3 w-[calc(100vw/4)] md:w-[8rem]">
            <img
              className="col-span-8 object-cover rounded-full h-[15rem] md:h-[20rem] my-5"
              src={joyful}
            />
            <img
              className="col-span-8 object-cover rounded-full h-[15rem] md:h-[20rem] my-5"
              src={man}
              alt="Young man looking onto his laptop"
            />
            <img
              className="col-span-8 object-cover rounded-full h-[15rem] md:h-[20rem] my-5"
              src={outdoor}
              alt="A lady taking note on outdoor"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
export default AboutHero;
