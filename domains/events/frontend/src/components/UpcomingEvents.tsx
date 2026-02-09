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
    <section className="py-24 px-10 text-white">
      <h2 className="text-3xl font-semibold mb-10 text-black">Upcoming Events</h2>
      <div className="flex gap-8">
        {events.map((event, index) => (
          <EventCard key={index} event={event} />
        ))}
      </div>
    </section>
  );
}
