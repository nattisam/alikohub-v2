import Card from "./../../../../../libraries/ui-libraries/components/Card";

export default function About() {
  return (
    <section
      id="about"
      className="grid grid-cols-2 grid-rows-4 mx-auto md:grid-cols-4 md:grid-rows-3 gap-4 md:gap-8 p-4 md:p-12 bg-[#f5f8f3] md:h-[50rem]"
    >
      <div
        style={{ backgroundImage: "url('./assets/mission-1.svg')" }}
        className="relative w-full col-span-1 row-span-1 md:row-start-1 rounded-3xl overflow-hidden bg-cover bg-center"
      >
        <Card
          className="overflow-hidden text-center md:text-left h-full font-sans px-6 py-3 rounded-3xl"
          titleClassName="font-semibold my-4 text-xs md:text-base"
          contentClassName="font-regular font-sans text-xs md:text-sm"
          title="Transforming Key Sectors"
          content="Digitize construction processes and deliver personalized educational consulting."
        />
      </div>
      <div
        style={{ backgroundImage: `url('./assets/mission-2.svg')` }}
        className="w-full col-span-1 row-span-1 col-start-2  md:row-start-1 relative rounded-3xl overflow-hidden bg-cover bg-center"
      >
        <Card
          className="text-center md:text-left font-sans px-6 py-3 rounded-3xl"
          titleClassName="font-semibold my-3 text-sm md:text-base"
          contentClassName="font-regular font-sans text-xs md:text-sm"
          title="Inclusive and Sustainable Growth"
          content="Leverage technology to drive long-term development."
        />
      </div>
      <div
        style={{ backgroundImage: "url('./assets/mission.svg')" }}
        className="relative w-full h-full col-span-2 col-start-1 row-start-1 md:row-start-2 md:row-span-2 md:p-8 rounded-3xl overflow-hidden bg-cover bg-center"
      >
        <Card
          className="overflow-hidden text-center md:text-left h-full font-sans px-6 py-3 rounded-3xl"
          titleClassName="text-lg sm:text-xl md:text-4xl font-semibold md:font-bold mb-4"
          contentClassName="font-sans font-regular text-sm md:text-xl"
          content="AlikoHub’s mission is to digitally empower African individuals and communities by bridging global opportunities and driving innovation."
          title="Mission"
        />
      </div>
      <div
        style={{ backgroundImage: "url('./assets/vision.svg')" }}
        className="relative w-full h-full row-start-2 col-span-2 md:row-span-2 md:p-8 rounded-3xl overflow-hidden bg-cover bg-center"
      >
        <Card
          className="overflow-hidden text-center md:text-left h-full font-sans px-6 py-3 rounded-3xl"
          title="Vision"
          titleClassName="md:text-4xl font-bold mb-4"
          contentClassName="lg:font-sans text-sm md:text-xl lg:font-regular lg:text-xl"
          content="AlikoHub envisions leading Africa’s digital transformation by innovating in construction, education, and consulting while fostering inclusive, sustainable progress."
        />
      </div>
      <div
        style={{ backgroundImage: "url('./assets/vision-1.svg')" }}
        className="relative w-full col-span-1 row-start-3 rounded-3xl overflow-hidden bg-cover bg-center"
      >
        <Card
          className="overflow-hidden text-center md:text-left h-full font-sans px-6 py-3 rounded-3xl"
          titleClassName="font-semibold my-3 text-sm md:text-base"
          contentClassName="font-regular font-sans text-xs md:text-sm"
          title="Empowerment Through Innovation"
          content="Foster inclusive growth and collaboration by enabling access to transformative digital solutions."
        />
      </div>
      <div
        style={{ backgroundImage: "url('./assets/vision-2.svg')" }}
        className="relative w-full col-span-1 row-span-1 row-start-3 rounded-3xl overflow-hidden bg-cover bg-center"
      >
        <Card
          className="overflow-hidden text-center md:text-left h-full font-sans px-6 py-3 rounded-3xl"
          title="Connecting Africa to the World"
          titleClassName="font-semibold my-3 text-sm md:text-base"
          contentClassName="font-regular font-sans text-xs md:text-sm"
          content="Build a seamless digital hub that links African with global opportunities."
        />
      </div>
    </section>
  );
}
