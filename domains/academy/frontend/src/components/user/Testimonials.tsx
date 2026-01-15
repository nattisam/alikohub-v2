import TestimonyCard from "./TestimonyCard";
import data from "../../mock_data.json";
const Testimonials = () => {
  const colors = ["#FFDC8B", "#FFBC8C", "#C2DBDC", "#98E5E5", "#8CBBDB"];
  return (
    <section className="md:m-20 m-7">
      <h2 className="text-2xl md:text-3xl lg:text-5xl m-4 text-center font-bold">
        What Our Students Say
      </h2>
      <p className="text-gray-400 text-sm w-[80%] mx-auto text-center">
        AlikoHub is building Africa’s digital future—uniting education, global
        consultancy, and smart construction tools under one seamless platform.
      </p>
      <div className="mx-auto flex flex-col items-start md:grid md:grid-cols-3 md:grid-rows-3 gap-2 md:gap-10">
        {data.testimonies &&
          data.testimonies.map((testimonial) => {
            return (
              <TestimonyCard
                key={testimonial.id}
                image={testimonial.image}
                testimony={testimonial.testimony}
                name={testimonial.name}
                cardColor={colors[testimonial.id % 5]}
                className={`${
                  (testimonial.id === 3 ||
                    testimonial.id === 4 ||
                    testimonial.id === 3 ||
                    testimonial.id === 1) ?
                  "md:relative md:bottom-[-4rem] md:left-[2rem]":""
                } 
                  ${
                    testimonial.id % 2 === 0 ? "self-end" : ""
                  }`}
              />
            );
          })}
      </div>
    </section>
  );
};
export default Testimonials;
