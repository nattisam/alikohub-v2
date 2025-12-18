import Card from "../../../../../libraries/ui-libraries/components/Card";
import type { TestimonyCardProps } from "./types.d";

const TestimonyCard = ({
  image,
  name,
  testimony,
  className,
  cardColor,
  style,
}: TestimonyCardProps) => {
  return (
    <div className={className + " wiggling"} style={style}>
      <img
        src={image}
        alt="user profile"
        className="relative top-4 md:top-8 -left-4 md:-left-8 w-[3rem] md:w-[5rem] rounded-full"
      />
      <p className="relative left-[10rem] md:left-[12rem] -top-7 md:-top-10 h-0 font-serif text-[4rem] md:text-[6rem]">
        ‘‘
      </p>
      <Card
        className="w-[12rem] md:w-[15rem] p-3 text-center rounded-2xl"
        title={name}
        style={{
          backgroundColor: cardColor,
        }}
        titleClassName={
          "font-semibold md:font-bold text-sm md:text-base text-center"
        }
        content={testimony}
        contentClassName={`md:font-semibold text-xs md:text-sm text-brown-100`}
      />
    </div>
  );
};
export default TestimonyCard;
