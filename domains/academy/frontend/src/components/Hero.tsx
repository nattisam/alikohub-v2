import image1 from "../assets/image1.png";
import blur from "../assets/Blur1.png";
import blur2 from "../assets/Blur2.png";
import lovely1 from "../assets/lovely.jpg";
import outdoor from "../assets/outdoor.jpg";
import joyful from "../assets/joyful.jpg";
import man from "../assets/man.png";
import lovely from "../assets/lovely.jpg";
import side from "../assets/side-view.png";
type HeroProps = {
  children?: React.ReactNode;
};

const Hero = ({ children }: HeroProps) => {
  return (
    <main className="relative w-full max-h-screen lg:min-h min-h-[90vh]-screen overflow-hidden pt-0 lg:-top-20">
      <div className="flex flex-col lg:flex-row w-full max-h-screen lg:min-h-screen">
        {/* Left Section */}
        <section className="relative lg:w-[60%] xl:w-[60%] flex items-center max-h-screen lg:min-h-screen justify-center px-4 lg:px-12 xl:px-20 lg:py-0">
          <div className="absolute inset-0 lg:hidden z-0 flex flex-row animate-scroll-up-merged">
            {/* Column 1 */}
            <div className="flex flex-col w-1/3">
              {/* Row 1 */}
              <div className="h-1/2">
                <img
                  src={side}
                  alt="Side"
                  className="w-3/4 ml-10 h-96 rounded-full mt-24 object-cover"
                />
              </div>
              {/* Row 2 */}
              <div className="h-1/2 flex gap-4">
                <img
                  src={outdoor}
                  alt="Outdoor 1"
                  className="w-1/4 h-8 object-cover rounded-full"
                />
                <img
                  src={outdoor}
                  alt="Outdoor 2"
                  className="w-3/4 h-96 rounded-full mt-7 object-cover"
                />
              </div>
            </div>
            {/* Column 2 */}*{" "}
            <div className="w-1/3 h-full flex items-center justify-center">
              <img
                src={lovely}
                alt="Lively"
                className="w-3/4 rounded-full h-96 object-cover"
              />
            </div>
            {/* Column 3 */}*{" "}
            <div className="flex flex-col w-1/3">
              {/* Row 1 */}*{" "}
              <div className="h-1/2 flex">
                <img
                  src={joyful}
                  alt="Joyful 1"
                  className="w-3/4 h-96 mt-24 rounded-full object-cover"
                />
                <img
                  src={joyful}
                  alt="Joyful 2"
                  className="w-1/4 h-8 mt-20 bg-cover rounded-full"
                />
              </div>
              {/* Row 2 */}*{" "}
              <div className="h-1/2 flex">
                <img
                  src={man}
                  alt="Man 1"
                  className="w-3/4 h-96 rounded-full mt-7 object-cover"
                />
                <img
                  src={man}
                  alt="Man 2"
                  className="w-1/4 h-8 object-cover rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Gradient Overlay for Mobile */}
          <div className="absolute inset-0 h-full lg:hidden z-10 "></div>
          {/* Background for Desktop */}
          <img
            src={image1}
            alt="Background"
            className="hidden lg:block absolute top-0 left-0 w-full h-full object-cover -z-30"
          />
          <img
            src={blur}
            alt="Blur"
            className="hidden lg:block absolute top-0 left-0 w-full h-full object-cover -z-20"
          />
          {children}
        </section>

        {/* Right Section */}
        <section className="relative lg:w-[40%] xl:w-[40%] max-h-screen lg:h-screen">
          <div
            className="absolute top-0 left-0 w-full h-full hidden lg:block bg-cover bg-no-repeat blur-md -z-10"
            style={{
              backgroundImage: `url(${blur2})`,
              backgroundPosition: "center",
            }}
          />
          <div className="w-full absolute top-0 h-fit hidden lg:flex justify-center items-center">
            {/* Image columns */}
            <div className="flex w-full h-full">
              {/* New Column 1 (scroll-up) */}
              <div className="flex flex-col space-y-4 items-center w-1/2 animate-scroll-up-merged">
                {/* Original Content */}
                <div
                  className="h-68 w-32 bg-cover ml-10 bg-no-repeat rounded-full"
                  style={{
                    backgroundImage: `url(${side})`,
                    backgroundPosition: "center right",
                  }}
                ></div>
                <div className="flex gap-4">
                  <div
                    className="h-8 w-8 bg-no-repeat rounded-full"
                    style={{
                      backgroundImage: `url(${outdoor})`,
                      backgroundPosition: "center top",
                    }}
                  ></div>
                  <div
                    className="h-68 w-32 bg-cover bg-no-repeat rounded-full"
                    style={{
                      backgroundImage: `url(${outdoor})`,
                      backgroundPosition: "center",
                    }}
                  ></div>
                </div>
                {/* Duplicated Content */}
                <div
                  className="h-68 w-32 bg-cover ml-10 bg-no-repeat rounded-full"
                  style={{
                    backgroundImage: `url(${side})`,
                    backgroundPosition: "center right",
                  }}
                ></div>
                <div className="flex gap-4">
                  <div
                    className="h-8 w-8 bg-no-repeat rounded-full"
                    style={{
                      backgroundImage: `url(${outdoor})`,
                      backgroundPosition: "center top",
                    }}
                  ></div>
                  <div
                    className="h-68 w-32 bg-cover bg-no-repeat rounded-full"
                    style={{
                      backgroundImage: `url(${outdoor})`,
                      backgroundPosition: "center",
                    }}
                  ></div>
                </div>
                <div
                  className="h-68 w-32 bg-cover ml-10 bg-no-repeat rounded-full"
                  style={{
                    backgroundImage: `url(${side})`,
                    backgroundPosition: "center right",
                  }}
                ></div>
                <div className="flex gap-4">
                  <div
                    className="h-8 w-8 bg-no-repeat rounded-full"
                    style={{
                      backgroundImage: `url(${outdoor})`,
                      backgroundPosition: "center top",
                    }}
                  ></div>
                  <div
                    className="h-68 w-32 bg-cover bg-no-repeat rounded-full"
                    style={{
                      backgroundImage: `url(${outdoor})`,
                      backgroundPosition: "center",
                    }}
                  ></div>
                </div>
              </div>
              {/* New Column 2 (scroll-down) */}
              <div className="flex flex-col items-center space-y-4 w-1/2 py-4 animate-scroll-down-merged">
                {/* Duplicated Content First */}
                <div className="flex gap-4">
                  <div
                    className="h-72 w-32 mr-12 bg-cover bg-no-repeat rounded-full"
                    style={{
                      backgroundImage: `url(${lovely})`,
                      backgroundPosition: "center 50%",
                    }}
                  ></div>
                  <div
                    className="h-8 w-8 mt-60  bg-no-repeat rounded-full"
                    style={{
                      backgroundImage: `url(${lovely1})`,
                      backgroundPosition: "left",
                    }}
                  ></div>
                </div>
                <div className="flex gap-4">
                  <div
                    className="h-72 w-32 bg-cover bg-no-repeat rounded-full"
                    style={{
                      backgroundImage: `url(${man})`,
                      backgroundPosition: "left center",
                    }}
                  ></div>
                  <div
                    className="h-18 w-24 mt-38 mr-8 mb-9 bg-no-repeat rounded-full"
                    style={{
                      backgroundImage: `url(${man})`,
                      backgroundPosition: "right 70%",
                    }}
                  ></div>
                </div>
                <div className="flex gap-4">
                  <div
                    className="h-72 w-32 bg-cover bg-no-repeat rounded-t-full rounded-full"
                    style={{
                      backgroundImage: `url(${joyful})`,
                      backgroundPosition: "center",
                    }}
                  ></div>
                  <div
                    className="h-10 w-18 mb-16 mr-8 bg-no-repeat rounded-full"
                    style={{
                      backgroundImage: `url(${joyful})`,
                      backgroundPosition: "center right",
                    }}
                  ></div>
                </div>
                {/* Original Content */}
                <div className="flex gap-4">
                  <div
                    className="h-72 w-32  mr-12 bg-cover bg-no-repeat rounded-full"
                    style={{
                      backgroundImage: `url(${lovely})`,
                      backgroundPosition: "center 50%",
                    }}
                  ></div>
                  <div
                    className="h-8 w-8 mt-60  bg-no-repeat rounded-full"
                    style={{
                      backgroundImage: `url(${lovely1})`,
                      backgroundPosition: "left",
                    }}
                  ></div>
                </div>
                <div className="flex gap-4">
                  <div
                    className="h-72 w-32 mr-3 bg-cover bg-no-repeat rounded-full"
                    style={{
                      backgroundImage: `url(${man})`,
                      backgroundPosition: "left center",
                    }}
                  ></div>
                  <div
                    className="h-18 w-24 mt-28 mr-8 mb-9 bg-no-repeat rounded-full"
                    style={{
                      backgroundImage: `url(${man})`,
                      backgroundPosition: "right 70%",
                    }}
                  ></div>
                </div>
                <div className="flex gap-4">
                  <div
                    className="h-72 w-32 bg-cover bg-no-repeat rounded-t-full rounded-full"
                    style={{
                      backgroundImage: `url(${joyful})`,
                      backgroundPosition: "center left",
                    }}
                  ></div>
                  <div
                    className="h-10 w-18 mb-16 mr-8 bg-no-repeat rounded-l-full"
                    style={{
                      backgroundImage: `url(${joyful})`,
                      backgroundPosition: "center right",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Hero;
