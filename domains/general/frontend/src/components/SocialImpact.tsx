import Card from "./../../../../../libraries/ui-libraries/components/Card";
import socialImpactImg from "../assets/social_impact_img.svg";

export default function SocialImpact() {
  return (
    <div
      id="social-impact"
      className="md:grid md:grid-cols-10 flex flex-col gap-8 md:p-8 bg-[#f5f8f3]"
    >
      <div className="flex flex-col text-center md:col-span-6 gap-2">
        <div>
          <Card
            className="px-5 md:p-10"
            titleClassName="font-bold text-3xl md:text-4xl font-sans px-5"
            contentClassName="font-regular text-lg sm:text-xl md:text-2xl text-gray-400 my-5 px-5"
            title="Real Impact, Real Results"
            content="From student succes to smarter construction- AlikoHub is making digital progress visible."
          />
          <div className="flex flex-col md:bg-white rounded-4xl p-4 gap-4 text-center md:grid md:grid-cols-5 md:grid-rows-2">
            <Card
              className="bg-[#E0EEF7] rounded-lg md:rounded-3xl col-span-2 p-4"
              title="30+"
              titleClassName="text-purple-500 font-semibold text-4xl"
              content="Industry-Ready Tech Courses"
              contentClassName="font-semibold my-3 text-lg"
            >
              <p className="text-gray-400 text-base">
                From beginner to advanced- build real-world skills.
              </p>
            </Card>
            <Card
              className="bg-[#E0EEF7] md:col-span-3 w-full rounded-lg md:rounded-3xl p-4"
              title="4,000+"
              titleClassName="text-purple-500 font-semibold text-4xl"
              contentClassName="font-semibold my-3 text-lg"
              content="Global Visas Processed"
            >
              <p className="text-gray-400 text-base">
                Supporting global journeys with expert consulting.
              </p>
            </Card>
            <Card
              className="bg-[#E0EEF7] col-span-3 w-full rounded-lg md:rounded-3xl p-4"
              titleClassName="text-purple-500 font-semibold text-4xl"
              contentClassName="font-semibold my-3 text-lg"
              title="23+"
              content="Construction Projects Digitally Managed"
            >
              <p className="text-gray-400 text-base">
                Transforming African infrastructure with smart tools.",
              </p>
            </Card>
            <Card
              className="bg-[#E0EEF7] col-span-2 w-full rounded-lg md:rounded-3xl p-4"
              titleClassName="text-purple-500 font-semibold text-4xl"
              contentClassName="font-semibold my-3 text-lg"
              title="90%"
              content="Partner Satisfaction Rate"
            >
              <p className="text-gray-400 text-base">
                Trusted by universities, companies, and organizations worldwide.
              </p>
            </Card>
          </div>
        </div>
      </div>
      <img
        className="w-full h-full flex justify-center items-center col-span-4 rounded-bl-3xl not-md:hidden"
        src={socialImpactImg}
        alt="impact-show board"
      />
    </div>
  );
}
