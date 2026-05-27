import { Layout } from "@/components/layout/Layout";
import { StoryHero } from "@/components/story/StoryHero";
import { StoryTimeline } from "@/components/story/StoryTimeline";
import { StoryChapter } from "@/components/story/StoryChapter";
import { StoryVideoGallery } from "@/components/story/StoryVideoGallery";
import { StoryCTA } from "@/components/story/StoryCTA";
import { useEffect, useState } from "react";
import { useStories } from "@/hooks/useWash";
import { Loader2 } from "lucide-react";

export default function OurStory() {
  const { data: rawStories = [], isLoading } = useStories();
  const [activeChapter, setActiveChapter] = useState("");

  // Map raw API data to the format expected by components
  const storyChapters = rawStories
    .map((story: any) => {
      // Extract year from createdAt if year is missing
      const createdYear = story.createdAt
        ? new Date(story.createdAt).getFullYear()
        : 2024;
      const displayYear = story.year || createdYear;

      // Safely handle images by zipping photos and captions
      const photos = Array.isArray(story.photos) ? story.photos : [];
      const captions = Array.isArray(story.captions) ? story.captions : [];

      const mappedImages = photos.map((src: string, i: number) => ({
        src,
        caption: captions[i] || "Project detail",
      }));

      return {
        ...story,
        id: story.id.toString(),
        year: displayYear,
        title: story.projectName || "Our Growth & Impact",
        subtitle: story.subtitle || "A Milestone Journey",
        description:
          story.storyText || "Contributing to sustainable water access.",
        tags: Array.isArray(story.tags) ? story.tags : [],
        images: mappedImages,
        theme: story.theme || "sepia",
      };
    })
    .filter((story: any) => story.storyText); // Required field

  useEffect(() => {
    if (storyChapters.length > 0 && !activeChapter) {
      setActiveChapter(storyChapters[0].id);
    }
  }, [storyChapters, activeChapter]);

  useEffect(() => {
    if (storyChapters.length === 0) return;

    const handleScroll = () => {
      const chapters = [...storyChapters].reverse().map((ch) => ({
        id: ch.id.toString(),
        element: document.getElementById(`chapter-${ch.id}`),
      }));

      for (const chapter of chapters) {
        if (chapter.element) {
          const rect = chapter.element.getBoundingClientRect();
          if (rect.top <= 300) {
            setActiveChapter(chapter.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [storyChapters]);

  const scrollToChapter = (id: string) => {
    const element = document.getElementById(`chapter-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Layout>
      <StoryHero />

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      ) : (
        <>
          <StoryTimeline
            chapters={storyChapters}
            activeChapter={activeChapter}
            onChapterClick={scrollToChapter}
          />
          <div className="relative">
            {storyChapters.map((chapter, index) => (
              <StoryChapter key={chapter.id} chapter={chapter} index={index} />
            ))}
          </div>
        </>
      )}

      <StoryVideoGallery />
      <StoryCTA />
    </Layout>
  );
}
