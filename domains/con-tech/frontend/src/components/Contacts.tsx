import phone from "../assets/phone-call.png";
import onMapLocation from "../assets/location_on_map.png";
import openMail from "../assets/email_open.png";
import sectionBg from "../assets/bg2.png";
const Contacts = () => {
  return (
    <section
      className="flex flex-col md:flex-row items-center justify-around p-10 bg-cover bg-center"
      style={{ backgroundImage: `url(${sectionBg})` }}
    >
      <div className="flex flex-col items-center justify-center md:justify-around w-1/4 h-full px-4 py-2 md:pr-[10%] border-l-1 border-b-1 border-amber-600">
        <img
          src={onMapLocation}
          aria-label="Location"
          alt="Location pin"
          className="w-[6rem] mb-5 p-2 bg-gray-300/30 backdrop-blur-md"
        />
        <p>Bole Dembel, Tigis building 12th floor| Addis Ababa | Ethiopia</p>
      </div>
      <div className="flex flex-col items-center justify-center md:justify-around w-1/4 h-[12rem]  px-4 md:pr-[10%] border-l-1 border-b-1 border-amber-600">
        <img
          src={phone}
          alt="Phone call"
          aria-label="Phone Numbers"
          className="w-[4rem] mb-5 p-2 bg-gray-300/30 backdrop-blur-md"
        />
        <p>
          +2519845976
          <br /> +2519845976
          <br /> +2519845976
        </p>
      </div>
      <div className="flex flex-col items-center justify-center md:justify-around w-1/4 h-[12rem] px-4 md:pr-[10%] border-l-1 border-b-1 border-amber-600">
        <img
          src={openMail}
          aria-label={"Email address"}
          alt="email icon"
          className="w-[4rem] mb-5 p-2 bg-gray-300/30 backdrop-blur-md"
        />
        <p>alikohub@gmail.com</p>
      </div>
    </section>
  );
};
export default Contacts;