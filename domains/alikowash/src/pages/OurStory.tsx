import { Layout } from "@/components/layout/Layout";
import { StoryHero } from "@/components/story/StoryHero";
import { StoryTimeline } from "@/components/story/StoryTimeline";
import { StoryChapter } from "@/components/story/StoryChapter";
import { StoryVideoGallery } from "@/components/story/StoryVideoGallery";
import { StoryCTA } from "@/components/story/StoryCTA";
import { useEffect, useState } from "react";

// Story images imports
import galano4 from "@/assets/stories/galano-4.jpg";
import galano6 from "@/assets/stories/galano-6.jpg";
import galano9 from "@/assets/stories/galano-9.jpg";
import galano11 from "@/assets/stories/galano-11.jpg";

import airaHospital1 from "@/assets/stories/aira-hospital-1.jpg";
import airaHospital2 from "@/assets/stories/aira-hospital-2.jpg";

import gabaRobii1 from "@/assets/stories/gaba-robii-1.jpg";
import gabaRobii2 from "@/assets/stories/gaba-robii-2.jpg";
import gabaRobii3 from "@/assets/stories/gaba-robii-3.jpg";
import gabaRobii4 from "@/assets/stories/gaba-robii-4.jpg";

import danka1 from "@/assets/stories/danka-1.jpg";
import danka3 from "@/assets/stories/danka-3.jpg";
import danka5 from "@/assets/stories/danka-5.jpg";
import danka7 from "@/assets/stories/danka-7.jpg";
import danka8 from "@/assets/stories/danka-8.jpg";

export const storyChapters = [
  {
    id: "1995",
    year: 1995,
    title: "Galano Water Project",
    subtitle: "Where It All Began",
    description: "The Galano Water Project marks the foundational chapter of our WASH journey. Starting with Galano Primary School and extending to public water points, this project laid the groundwork for decades of community-centered water infrastructure development.",
    tags: ["Historic", "Foundation", "Community Water"],
    images: [
      { src: galano4, caption: "Project Development" },
      { src: galano6, caption: "Water Distribution" },
      { src: galano9, caption: "Water System" },
      { src: galano11, caption: "Project Completion" },
    ],
    theme: "sepia",
  },
  {
    id: "2019",
    year: 2019,
    title: "Gaba Robii Project",
    subtitle: "Resilience During COVID",
    badge: "COVID TIME",
    description: "During the unprecedented challenges of the COVID-19 pandemic, we remained committed to serving communities. The Gaba Robii Project demonstrated our resilience and dedication to providing clean water access even in the most difficult times.",
    tags: ["Resilience", "Pandemic Response", "Community Support"],
    images: [
      { src: gabaRobii3, caption: "Project Completed" },
      { src: gabaRobii1, caption: "Project Construction" },
      { src: gabaRobii2, caption: "Success Joy" },
      { src: gabaRobii4, caption: "Milestone Celebration" },
    ],
    theme: "urgent",
  },
  {
    id: "2024",
    year: 2024,
    title: "Aira General Hospital WASH Project",
    subtitle: "Healthcare & Dignity",
    description: "Bringing clean water and sanitation infrastructure to Aira General Hospital, ensuring that healthcare facilities have the essential WASH services needed for patient care, hygiene, and medical operations.",
    tags: ["Healthcare", "Hospital WASH", "Medical Infrastructure"],
    images: [
      { src: airaHospital2, caption: "WASH Infrastructure" },
      { src: airaHospital1, caption: "Hospital Water System" },
    ],
    theme: "clinical",
  },
  {
    id: "2025",
    year: 2025,
    title: "Danka WASH Project",
    subtitle: "Building the Future",
    description: "Built in partnership with Catholic Diocese of Stockholm Sweden, Danka Daughters of Charity Dambi Dollo, and WEFTA USA, the Danka WASH Project represents our continued commitment to sustainable water infrastructure and community development.",
    tags: ["Future", "Partnership", "Sustainable Development"],
    images: [
      { src: danka1, caption: "Project Foundation" },
      { src: danka3, caption: "Infrastructure Development" },
      { src: danka5, caption: "Partnership Celebration" },
      { src: danka7, caption: "Project Progress" },
      { src: danka8, caption: "Completion Milestone" },
    ],
    theme: "hopeful",
  },
];

export default function OurStory() {
  const [activeChapter, setActiveChapter] = useState("1995");

  useEffect(() => {
    const handleScroll = () => {
      const chapters = storyChapters.map((ch) => ({
        id: ch.id,
        element: document.getElementById(`chapter-${ch.id}`),
      }));

      for (const chapter of chapters.reverse()) {
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
  }, []);

  const scrollToChapter = (id: string) => {
    const element = document.getElementById(`chapter-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Layout>
      <StoryHero />
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
      <StoryVideoGallery />
      <StoryCTA />
    </Layout>
  );
}
