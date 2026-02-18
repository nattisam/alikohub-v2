import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPublishedPostsByType } from "../services/post-service";
import { PostType } from "../types/post";
import { LoadingState } from "../components/states/LoadingState";
import { ErrorState } from "../components/states/ErrorState";
import { PostList } from "../components/PostList";
import SearchBar from "../components/SearchBar";
import ViewToggle from "../components/ViewToggle";

export default function EventsPage() {
  const navigate = useNavigate();

  const {
    data: events = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["published-posts", "events"],
    queryFn: () => getPublishedPostsByType(PostType.EVENT),
  });

  return (
    <div
      className="min-h-screen relative bg-cover bg-center bg-no-repeat text-white"
      style={{
        backgroundImage:
          "url('https://media.istockphoto.com/id/935732546/photo/background-of-glowing-abstract-lines-and-spheres.jpg?s=1024x1024&w=is&k=20&c=9IRPAamDgvs-0oR1Y7SP3XQhw6qI0kqKivbGrV8Lz9Y=')",
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>

      {/* Page Content */}
      <div className="relative z-10">
        {/* Page Header */}
        <div className="bg-gray-800/70 border-b">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-white">Events</h1>
                <p className="text-sm text-gray-200 mt-1">
                  Upcoming and past AlikoHub ecosystem events.
                </p>
              </div>
            </div>

            {/* Search + View Controls */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mt-8">
              <SearchBar />
              <ViewToggle />
            </div>
          </div>
        </div>

        {/* Events List */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          {isLoading ? (
            <LoadingState message="Fetching events..." />
          ) : isError ? (
            <ErrorState error={error} onRetry={refetch} />
          ) : (
            <PostList
              posts={events}
              isLoading={isLoading}
              isError={isError}
              emptyMessage="No events found at the moment. Please check back soon!"
            />
          )}
        </main>
      </div>
    </div>
  );
}
