import phone from "../assets/phone-call.png";
import onMapLocation from "../assets/location_on_map.png";
import openMail from "../assets/email_open.png";
import sectionBg from "../assets/bg2.png";

const Contacts = () => {
  return (
    <section
      className="flex flex-col md:flex-row items-stretch md:items-center justify-around gap-6 md:gap-0 p-6 md:p-10 bg-cover bg-center"
      style={{ backgroundImage: `url(${sectionBg})` }}
    >
      {/* Location */}
      <div className="flex flex-col items-center justify-center md:justify-around w-full md:w-1/4 px-4 py-6 md:py-2
                      border-b md:border-b-0 md:border-l border-amber-600 text-center">
        <img
          src={onMapLocation}
          alt="Location pin"
          className="w-20 md:w-[6rem] mb-4 p-2 bg-gray-300/30 backdrop-blur-md rounded-lg"
        />
        <p className="text-sm leading-relaxed">
          Bole Dembel, Tigis building 12th floor <br />
          Addis Ababa, Ethiopia
        </p>
      </div>

      {/* Phone */}
      <div className="flex flex-col items-center justify-center md:justify-around w-full md:w-1/4 px-4 py-6 md:py-2
                      border-b md:border-b-0 md:border-l border-amber-600 text-center">
        <img
          src={phone}
          alt="Phone call"
          className="w-16 md:w-[4rem] mb-4 p-2 bg-gray-300/30 backdrop-blur-md rounded-lg"
        />
        <p className="text-sm leading-relaxed">
          +2519845976 <br />
          +2519845976 <br />
          +2519845976
        </p>
      </div>

      {/* Email */}
      <div className="flex flex-col items-center justify-center md:justify-around w-full md:w-1/4 px-4 py-6 md:py-2
                      md:border-l border-amber-600 text-center">
        <img
          src={openMail}
          alt="email icon"
          className="w-16 md:w-[4rem] mb-4 p-2 bg-gray-300/30 backdrop-blur-md rounded-lg"
        />
        <p className="text-sm break-words">
          alikohub@gmail.com
        </p>
      </div>
    </section>
  );
};

export default Contacts;
