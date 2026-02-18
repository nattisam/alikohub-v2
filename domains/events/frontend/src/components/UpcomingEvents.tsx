import { useQuery } from "@tanstack/react-query";
import { getPublishedPostsByType } from "../services/post-service";
import { PostType } from "../types/post";
import type { Event } from "./data/events";
import EventCard from "./EventCard";

export default function UpcomingEvents() {
  const { data: postsData = [], isLoading } = useQuery({
    queryKey: ["published-posts", "upcoming"],
    queryFn: () => getPublishedPostsByType(PostType.EVENT),
  });

  const posts = Array.isArray(postsData) ? postsData : [];

  // Limit to 3 upcoming events
  const events: Event[] = posts.slice(0, 3).map((post) => ({
    id: post.id,
    title: post.title,
    location: post.location || "Online",
    date: post.eventDate || post.createdAt,
    manager: post.createdByName || "Admin",
    status: "UPCOMING" as const,
    description: post.shortDescription,
    image: post.coverImage || "/images/event-placeholder.jpg",
  }));

  if (isLoading) return null; // Or a skeleton
  if (events.length === 0) return null;

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
            <EventCard key={index} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
