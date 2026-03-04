import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

const ConsultancyEvents = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-6">
          <motion.h1
            className="font-heading text-4xl font-bold text-foreground sm:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Consultancy & Events
          </motion.h1>
          <motion.p
            className="mt-4 max-w-2xl text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Career pathways, employer matchmaking, investor forums, and
            innovation events connecting youth to opportunity.
          </motion.p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ConsultancyEvents;
