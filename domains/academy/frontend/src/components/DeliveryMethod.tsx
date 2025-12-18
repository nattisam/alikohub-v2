import user from "../assets/user.svg";
import users from "../assets/users.svg";
import alumni from "../assets/chalkboard-user.svg";
import certificate from "../assets/diploma.svg";
import image from "../assets/image 4.png";
const DeliveryMethod = () => {
  const deliveries = [
    {
      icon: users,
      description: "Cohort-based Learning",
    },
    {
      icon: user,
      description: "Self-paced learning",
    },
    {
      icon: certificate,
      description: "Certification upon completion",
    },
    {
      icon: alumni,
      description: "Access to Dedicated Alumni",
    },
  ];
  return (
    <section className="p-4 my-4 bg-[#E0EEF7]">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold">Delivery Method</h2>
        <p className="text-gray-400 text-center">
          AlikoHub is building Africa’s digital future—uniting education, global
          consultancy, and smart construction tools under one seamless platform
        </p>
      </div>
      <div className="flex flex-col items-center sm:grid sm:grid-cols-2 sm:gap-2 md:gap-30 lg:gap-20 p-10 h-fit">
        <div className="flex flex-col gap-3 items-start">
          {deliveries.map((item, index) => (
            <div
              key={index}
              className="flex flex-row items-center w-full gap-4 border-b-1 border-gray-300 pb-2 "
            >
              <img src={item.icon} alt={item.description} />
              <p>{item.description}</p>
            </div>
          ))}
          <button className="rounded-3xl bg-gradient-to-r from-[#E6D600] to-[#F2F296] self-center md:self-auto mt-5 shadow-black drop-shadow-md w-[40%] md:w-[10rem]">
            Learn More
          </button>
        </div>
        <img
          src={image}
          alt="A lady looking at laptop"
          className="rounded-bl-4xl rounded-tr-4xl w-full"
        />
      </div>
    </section>
  );
};
export default DeliveryMethod;
