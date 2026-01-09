
import contractor from "../assets/contractor1.png"; // replace with your image path
import bg from "../assets/Bg3.png"; // replace with your image path
const ConstructionSection = () => {
  return (
    <section className="flex flex-col h-1/2 md:flex-row md:justify-center items-center bg-cover md:bg-contain p-6 md:pl-2 md:pr-12 md:pt-20 md:pb-36 rounded-lg shadow-md" style={{ backgroundImage: `url(${bg})` }}>
      {/* Text Content */}
      <div className="md:w-1/2 mb-6 ml-4 mr-4 md:mb-0 md:ml-2 ">        
        <p className="text-black text-2xl md:mt-8 ">
          We build strong foundations and innovative spaces designed to last for generations. 
          Our team combines modern technology with skilled craftsmanship to bring every project to life.
        </p>
      </div>

      {/* Image/Person */}
      <div className="hidden md:flex md:w-1/3 md:justify-center">
        <div className="absolute top-150 z-10 w-[40rem] h-[29rem] md:overflow-hidden">
          <img
            src={contractor}
            alt="Construction Worker"
            className="w-full h-full object-contain "
          />
        </div>
      </div>
    </section>
  );
};

export default ConstructionSection;
