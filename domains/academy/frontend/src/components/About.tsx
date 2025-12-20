import Card from "./../../../../../libraries/ui-libraries/components/Card";
import img2 from "../assets/2.jpg";
import img3 from "../assets/3.jpg";
import img4 from "../assets/4.jpg";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
export default function About() {
  return (
    <section id="about" className="flex md:grid md:grid-cols-2 md:grid-rows-1 gap-8 p-12 flex-col md:h-[50rem] lg:h-fit">
      <div className=" lg:grid grid-cols-2 grid-rows-3 lg:grid-cols-2 lg:grid-rows-2 lg:gap-4 md:gap-2 ">
        <div
          style={{ backgroundImage: `url(${img4})` }}
          className="relative max-h-[15rem] w-full col-span-1 row-span-1 row-start-1 rounded-3xl overflow-hidden bg-cover bg-center"
        >
          <IoShieldCheckmarkOutline className="relative top-4 left-4 text-4xl text-black" />
          <Card
            className="overflow-hidden text-left h-full font-sans px-6 py-2 rounded-3xl"
            titleClassName="font-semibold my-4 text-lg not-sm:text-sm"
            contentClassName="font-regular font-sans text-sm"
            title="Transforming Key Sectors"
            content="Digitize construction processes and deliver personalized educational consulting."
          />
        </div>
        <div
          style={{ backgroundImage: `url(${img3})` }}
          className="flex flex-col max-h-[15rem] my-4 justify-start relative w-full rounded-3xl overflow-hidden bg-cover bg-center"
        >
          <IoShieldCheckmarkOutline className="relative top-4 left-4 text-4xl text-black" />
          <Card
            className="text-left font-sans px-6 py-3 rounded-3xl not-md:row-start-1"
            titleClassName="font-semibold my-3 text-2sm not-sm:text-sm"
            contentClassName="font-regular font-sans text-sm not-sm:text-xs"
            title="Inclusive and Sustainable Growth"
            content="Leverage technology to drive long-term development."
          />
        </div>
        <div
          style={{ backgroundImage: `url(${img2})` }}
          className="flex flex-col justify-start relative w-full col-span-2 row-span-1 my-4 p-8 rounded-3xl overflow-hidden bg-cover bg-center h-fit md:max-h-[15rem]"
        >
          <IoShieldCheckmarkOutline className="relative top-0 left-0 text-4xl text-black" />
          <Card
            className="text-left"
            titleClassName="text-4xl font-bold mb-4 not-sm:font-semibold not-md:text-3xl not-sm:text-2xl"
            contentClassName="font-sans font-regular text-xl not-md:text-lg not-sm:text-base"
            content="AlikoHub’s mission is to digitally empower African individuals and communities by bridging global opportunities and driving innovation."
            title="Mission"
          />
        </div>
      </div>
      <div className=" lg:grid grid-cols-2 grid-rows-2 lg:grid-cols-2 lg:grid-rows-2 lg:gap-4 md:gap-2 ">
        <div
          style={{ backgroundImage: `url(${img2})` }}
          className="flex flex-col justify-start relative my-4 h-full w-full col-span-2 row-span-1 p-4 rounded-3xl overflow-hidden bg-cover bg-center max-h-[15rem]"
        >
          <IoShieldCheckmarkOutline className="relative top-0 left-0 text-4xl text-black" />
          <Card
            className="text-left"
            titleClassName="text-4xl font-bold mb-4 not-sm:font-semibold not-md:text-3xl not-sm:text-2xl"
            contentClassName="font-sans font-regular text-xl not-md:text-lg not-sm:text-base"
            content="AlikoHub’s mission is to digitally empower African individuals and communities by bridging global opportunities and driving innovation."
            title="Mission"
          />
        </div>
        <div
          style={{ backgroundImage: `url(${img4})` }}
          className="relative max-h-[15rem] w-full my-4 col-span-1 row-span-1 not-md:row-start-1 rounded-3xl overflow-hidden bg-cover bg-center"
        >
          <IoShieldCheckmarkOutline className="relative top-4 left-4 text-4xl text-black" />
          <Card
            className="overflow-hidden text-left h-full font-sans px-6 py-2 rounded-3xl"
            titleClassName="font-semibold my-4 text-lg not-sm:text-sm"
            contentClassName="font-regular font-sans text-sm"
            title="Transforming Key Sectors"
            content="Digitize construction processes and deliver personalized educational consulting."
          />
        </div>
        <div
          style={{ backgroundImage: `url(${img3})` }}
          className="flex flex-col max-h-[15rem] my-4 justify-start relative w-full rounded-3xl overflow-hidden bg-cover bg-center"
        >
          <IoShieldCheckmarkOutline className="relative top-4 left-4 text-4xl text-black" />
          <Card
            className="text-left font-sans px-6 py-3 rounded-3xl not-md:row-start-1"
            titleClassName="font-semibold my-3 text-2sm not-sm:text-sm"
            contentClassName="font-regular font-sans text-sm not-sm:text-xs"
            title="Inclusive and Sustainable Growth"
            content="Leverage technology to drive long-term development."
          />
        </div>        
      </div>
    </section>
  );
}
