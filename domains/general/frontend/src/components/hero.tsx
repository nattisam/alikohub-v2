import { FaChevronDown, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import Card from "./../../../../../libraries/ui-libraries/components/Card.tsx";
import Button from "./../../../../../libraries/ui-libraries/components/Button.tsx";
import type { HTMLAttributes } from "react";

type HeroCard = {
  img: string;
  title: string;
  scrollTo?: string;
  position: string;
};

type FloatingImage = {
  src: string;
  className: string;
  style?: React.CSSProperties;
};

type HeroProps = {
  heading?: string;
  subheading?: string;
  backgroundImage?: string;
  blurOverlay?: string;
  floatingImages?: FloatingImage[];
  cards?: HeroCard[];
  showButtons?: boolean;
  buttonOneText?: string;
  buttonTwoText?: string;
  buttonClassName?: HTMLAttributes<string>["className"];
  showSearch?: boolean;
  showExplore?: boolean;
  showImage?: boolean;
  imageSrc?: string;
  onGetStartedClick?: () => void;
  onLoginClick?: () => void;
  onExploreClick?: () => void;
  customContent?: React.ReactNode;
  className?: HTMLAttributes<string>["className"];
  sectionClassName?: HTMLAttributes<string>["className"];
  contentClassName?: HTMLAttributes<string>["className"];
  imageWrapperClassName?: HTMLAttributes<string>["className"];
};

const Hero = ({
  heading = "Empowering Africa's Next Generation of Innovators.",
  subheading,
  backgroundImage,
  blurOverlay,
  floatingImages = [],
  cards = [],
  showButtons = false,
  buttonOneText,
  buttonTwoText,
  buttonClassName,
  showSearch = false,
  showExplore = false,
  showImage = false,
  imageSrc,
  onGetStartedClick,
  onLoginClick,
  onExploreClick,
  className = "",
  sectionClassName = "",
  contentClassName = "",
  imageWrapperClassName = "",
  customContent,
}: HeroProps) => {
  return (
    <main
      className={`relative w-full min-h-screen overflow-hidden bg-gradient-to-r from-[#F5F8F3] via-[#F5F8F3] to-[#B0DAFE] ${className}`}
    >
      <section
        className={`relative px-6 sm:px-10 md:px-16 pt-20 md:pt-32 flex flex-col lg:flex-row items-center justify-between z-10 ${sectionClassName}`}
      >
        <div
          className={`flex flex-col gap-6 max-w-full md:max-w-[700px] move-in-from-left ${contentClassName}`}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-black leading-none uppercase">
            {heading}
          </h1>

          {subheading && (
            <p className="text-[#1A202c]/45 text-sm sm:text-base md:text-lg lg:text-xl leading-snug">
              {subheading}
            </p>
          )}

          {(showExplore || showSearch) && (
            <div className="flex items-center gap-4 mt-6">
              {showExplore && (
                <Button
                  label="Explore"
                  onClick={onExploreClick}
                  variant="primary"
                  icon={<FaChevronDown />}
                  iconPosition="right"
                  className="h-10 px-4 rounded-l-full bg-[#38A1FF] text-white"
                />
              )}
              {showSearch && (
                <div className="flex items-center bg-[#9C9C9C]/76 h-10 w-72 px-4 rounded-r-xl">
                  <input
                    className="bg-transparent flex-grow placeholder:text-white outline-none placeholder:text-sm"
                    placeholder="Search for courses"
                  />
                  <FaSearch className="text-black" />
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-col gap-6">
            {/* Buttons */}
            {showButtons && (
              <div
                className={
                  buttonClassName ||
                  "flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8"
                }
              >
                <Button
                  label={buttonOneText || "Get Started"}
                  onClick={onGetStartedClick}
                  variant="primary"
                  className="w-full sm:w-32"
                />
                <Button
                  label={buttonTwoText || "Log In"}
                  onClick={onLoginClick}
                  variant="secondary"
                  className="w-full sm:w-32 border-2 border-[#E6D600]"
                />
              </div>
            )}

            {cards.length > 0 && (
              <div className="relative mb-8 lg:mt-4 w-full max-w-[520px] h-[220px]">
                {cards.map(({ img, title, scrollTo, position }, i) => (
                  <Link
                    key={i}
                    to="/"
                    state={scrollTo ? { scrollTo } : undefined}
                  >
                    <div
                      className={`${position} w-40 lg:w-44 lg:h-44 h-40 mr-10 sm:w-36 sm:h-36`}
                    >
                      <div className="relative w-full h-full border-2 border-white rounded-bl-3xl rounded-tr-2xl rounded-tl-md rounded-br-md shadow-lg shadow-black overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105 hover:z-[99]">
                        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
                        <Card
                          img={img}
                          imgClassName="w-full h-full object-cover"
                          title={title}
                          className="w-full h-full"
                          titleClassName="absolute text-[#FFC107] font-bold text-[9px] lg:text-xs bottom-3 left-2 z-20"
                        />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {showImage && imageSrc && (
          <div
            className={`hidden lg:flex justify-center items-center mt-10 lg:-mt-30 w-full lg:w-auto ${imageWrapperClassName}`}
          >
            <img
              src={imageSrc}
              alt="Hero visual"
              className="w-[600px] h-auto max-h-[981px] lg:w-[700px] object-contain move-in-from-right"
            />
          </div>
        )}
      </section>
      {customContent}
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt="Background"
          className="absolute top-40 left-0 -z-30"
        />
      )}
      {blurOverlay && (
        <img
          src={blurOverlay}
          alt="Blur Overlay"
          className="absolute top-0 left-0 -z-20"
        />
      )}

      {floatingImages.map(({ src, className, style }, i) => (
        <div
          key={i}
          className={`${className} bg-no-repeat bg-cover`}
          style={{
            backgroundImage: `url(${src})`,
            ...style,
          }}
        />
      ))}
    </main>
  );
};

export default Hero;
