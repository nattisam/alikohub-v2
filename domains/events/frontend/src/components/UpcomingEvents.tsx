import EventCard from "./EventCard";

export default function UpcomingEvents() {
  const events = [
    {
      id: 1,
      title: "FinTech Innovators 2026",
      location: "Lagos, Nigeria",
      date: "Feb 10, 2026",
      manager: "John Doe",
      status: "UPCOMING",
      description: "A meetup for fintech enthusiasts across Africa.",
      image: "/images/event1.jpg", 
    },
    {
      id: 2,
      title: "AI & Robotics Africa",
      location: "Nairobi, Kenya",
      date: "Mar 5, 2026",
      manager: "Jane Smith",
      status: "UPCOMING",
      description: "Exploring AI and robotics innovations in Africa.",
      image: "/images/event2.jpg",
    },
    {
      id: 3,
      title: "Sustainable Tech Expo",
      location: "Accra, Ghana",
      date: "Apr 12, 2026",
      manager: "Samuel Kofi",
      status: "UPCOMING",
      description: "Showcasing sustainable technology solutions.",
      image: "/images/event3.jpg",
    },
  ];

  return (
    <section
      className="relative py-24 px-6 text-white bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://media.istockphoto.com/id/935732546/photo/background-of-glowing-abstract-lines-and-spheres.jpg?s=1024x1024&w=is&k=20&c=9IRPAamDgvs-0oR1Y7SP3XQhw6qI0kqKivbGrV8Lz9Y')",
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none"></div>

      <div className="relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">
          Upcoming Events
        </h2>

        <div className="flex flex-col md:flex-row gap-8 justify-center flex-wrap">
          {events.map((event, index) => (
            <EventCard key={index} event={event} darkMode />
          ))}
        </div>
      </div>
    </section>
  );
}
