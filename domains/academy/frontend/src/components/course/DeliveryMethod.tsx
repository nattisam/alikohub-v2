import {
  FaUsers,
  FaUser,
  FaCertificate,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DeliveryMethod = () => {
  const navigate = useNavigate();
  const deliveries = [
    {
      icon: <FaUsers className="text-4xl text-[#17469E]" />,
      title: "Cohort-based Learning",
      description:
        "Learn with peers in structured groups for collaborative experience.",
    },
    {
      icon: <FaUser className="text-4xl text-[#F47F27]" />,
      title: "Self-paced Learning",
      description: "Complete courses at your own pace, anytime and anywhere.",
    },
    {
      icon: <FaCertificate className="text-4xl text-[#0D72BA]" />,
      title: "Certification",
      description:
        "Receive a certificate upon course completion to showcase your skills.",
    },
    {
      icon: <FaChalkboardTeacher className="text-4xl text-[#00BFA6]" />,
      title: "Alumni Access",
      description:
        "Join our dedicated alumni network for guidance and networking.",
    },
  ];

  return (
    <section className="py-16 px-4 bg-[#E0EEF7]">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          How We <span className="text-[#17469E]">Deliver Learning</span>
        </h2>
        <p className="text-gray-600 text-base md:text-lg">
          AlikoHub is building Africa’s digital future—uniting education,
          consultancy, and smart construction tools under one seamless platform.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-5xl mx-auto">
        {deliveries.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl transition"
          >
            <div className="mb-4">{item.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-500">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <button
          onClick={() => navigate("/about")}
          className="px-8 py-3 bg-[#0095DA] text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          Learn More
        </button>
      </div>
    </section>
  );
};

export default DeliveryMethod;
