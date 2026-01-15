import WarehouseImage from "/src/assets/warehouse.jpg";
import bg from "../assets/Bg3.png";
const AboutService = () => {
    return(
      <section
       className="relative -top-10 md:-top-4 flex flex-col md:flex-row items-center justify-between bg-cover bg-center pt-20 -z-10 px-8 md:px-20 gap-8"
       style={{ backgroundImage: `url(${bg})` }}
       >
        <div className="md:w-1/2 mb-6 mx-4 md:mb-0 md:ml-2 relative z-10">
          <p className="text-black text-2xl">
            We build strong foundations and innovative spaces designed to last
            for generations. Our team combines modern technology with skilled
            craftsmanship to bring every project to life. We build strong
            foundations and innovative spaces designed to last for generations.
            Our team combines modern technology with skilled craftsmanship to
            bring every project to life.
          </p>
        </div>

        <div className="md:w-1/2 flex justify-center md:justify-end relative z-10">
          <img
            src={WarehouseImage}
            alt="Tech Illustration"
            className="h-64 w-auto md:h-80 hidden md:block"
          />
        </div>
      </section>
    )
}
export default AboutService;