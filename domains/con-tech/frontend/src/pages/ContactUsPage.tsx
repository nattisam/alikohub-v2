import ContactForm from "../components/ContactForm";
import Contacts from "../components/Contacts";
import Hero from "../components/Hero";

import bg from "../assets/services2Bg.png"

const ContactUsPage = () => {
  return (
    <main>
      <Hero style={{ backgroundImage: `url(${bg})` }} className="bg-cover">
        <div className="h-full w-full flex items-center justify-center relative z-5">
          <h1 className="text-white text-4xl md:text-6xl font-bold">
            Contact Us
          </h1>
        </div>
      </Hero>
      <Contacts />
      <section className="bg-cover bg-center  pt-10 pl-14 pb-16" style={{ backgroundImage:`url(${bg})` }}>
        <p className="text-3xl text-white font-bold mb-15 mx-5">Or Fill out the Form Below</p>
        <ContactForm />
      </section>
    </main>
  );
};
export default ContactUsPage;
