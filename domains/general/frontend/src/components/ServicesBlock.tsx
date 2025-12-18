import Card from "../../../../../libraries/ui-libraries/components/Card";
import Button from "../../../../../libraries/ui-libraries/components/Button";

interface ServiceBlockProps {
  title: string;
  description: string;
  img: string;
  reverse?: boolean;
  align?: "left" | "right";
  onClick?: () => void;
  refProp?: React.RefObject<HTMLDivElement | null>;
}

const ServiceBlock = ({
  title,
  description,
  img,
  reverse = false,
  align = "left",
  onClick,
  refProp,
}: ServiceBlockProps) => {
  return (
    <div ref={refProp} className="md:mx-8">
      <Card
        img={img}
        className={`flex flex-col ${
          reverse ? "md:flex-row-reverse" : "md:flex-row"
        } md:items-start space-y-4 md:space-y-0`}
        imgClassName={`w-full h-60 mt-6 md:mt-0 md:h-96 md:w-96 ${
          reverse ? "md:ml-8" : "md:mr-8"
        }`}
      >
        <div className="flex flex-col md:w-2/3 gap-10 md:gap-14">
          <div
            className={`flex justify-center ${
              align === "right" ? "md:justify-end" : "md:justify-start"
            }`}
          >
            <h5>
              <span className="inline-block transform skew-x-[20deg] bg-[#FFC107]/66 rounded-xl px-6 py-2">
                <span className="block transform -skew-x-[20deg] text-2xl md:text-4xl text-[#494444] font-outfit font-bold">
                  {title}
                </span>
              </span>
            </h5>
          </div>

          <p className="text-lg md:text-left">{description}</p>
          <div className="md:self-end">
            <Button
              label="View site"
              onClick={onClick}
              className="w-40 h-8 text-sm hover:scale-110 bg-gradient-to-r from-[#E6D600] to-[#F2F296] text-black rounded-4xl font-semibold"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ServiceBlock;
