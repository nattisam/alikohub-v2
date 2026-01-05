import About from "../../components/user/About.tsx";
import heroBg from "../../assets/coursehero1.png";
import AboutHero from "../../components/user/AboutHero.tsx";
const AcademyAboutPage = () => {
  return (
    <div className="pt-16">
      <div className=" bg-[#]">
        <AboutHero />
        <section className="p-10 my-4 bg-[#E0EEF7] mt-0 top-0  w-screen">
          <div className="flex flex-col items-center sm:grid sm:grid-cols-2 sm:gap-2 md:gap-30 lg:gap-20 p-2 h-fit w-full">
            <p className="text-left">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias
              obcaecati et quo aliquam aspernatur pariatur dolores animi
              molestiae veritatis inventore minima deserunt ipsa delectus in
              officia harum distinctio, ad sit. Nemo quos quasi dolorem! Eaque
              aut reprehenderit, nesciunt odit, dicta minima quia laborum quod
              quae doloremque, soluta cum? Numquam pariatur quam laboriosam
              culpa repellat, repudiandae natus voluptatem sequi nostrum
              impedit.
            </p>
            <img
              src={heroBg}
              alt="A lady looking at laptop"
              className="rounded-bl-4xl rounded-tr-4xl w-full"
            />
          </div>
        </section>
        <About />
      </div>
    </div>
  );
};

export default AcademyAboutPage;