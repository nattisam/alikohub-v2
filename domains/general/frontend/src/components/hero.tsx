import { FaChevronDown, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import Button from "./../../../../../libraries/ui-libraries/components/Button.tsx";
import type { HTMLAttributes } from "react";

type HeroCard = {
  img: string;
  title: string;
  scrollTo?: string;
  subdomain?: string;
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
  const getSubdomainUrl = (subdomain?: string) => {
    if (!subdomain) return null;
    return `https://${subdomain}.alikohub.com`;
  };

  const handleCardClick = (
    e: React.MouseEvent,
    scrollTo?: string,
    subdomain?: string,
  ) => {
    const url = getSubdomainUrl(subdomain);
    if (url) {
      e.preventDefault();
      window.open(url, "_blank");
    } else if (scrollTo) {
      // Handle internal scroll if no subdomain
      const element = document.getElementById(scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <main
      className={`relative w-full min-h-screen bg-gradient-to-r from-[#F5F8F3] via-[#F5F8F3] to-[#B0DAFE] ${className}`}
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

          <div className="flex flex-col gap-6 mt-8">
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

      {/* Horizontal Carousel */}
      {cards.length > 0 && (
        <div className="relative w-full overflow-x-auto no-scrollbar pb-12 mt-4 md:mt-8 group z-20">
          <div className="flex gap-6 sm:gap-8 px-6 sm:px-10 md:px-16 min-w-max">
            {cards.map(({ img, title, scrollTo, subdomain }, i) => (
              <Link
                key={i}
                to={getSubdomainUrl(subdomain) ? "#" : "/"}
                state={scrollTo ? { scrollTo } : undefined}
                onClick={(e) => handleCardClick(e, scrollTo, subdomain)}
                className="block transform transition-all duration-500 hover:scale-105"
              >
                <div className="relative w-64 h-40 sm:w-72 sm:h-44 md:w-80 md:h-48 rounded-3xl overflow-hidden border-2 border-white shadow-2xl group/card">
                  <img
                    src={img}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover/card:opacity-80 transition-opacity" />
                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <h3 className="text-white font-bold text-lg md:text-xl drop-shadow-lg mb-1">
                      {title}
                    </h3>
                    <div className="w-8 h-1 bg-[#38A1FF] rounded-full transform origin-left transition-all duration-300 group-hover/card:w-16" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

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
