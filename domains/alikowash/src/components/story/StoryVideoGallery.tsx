import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Maximize2, X, ChevronLeft, ChevronRight, Film, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import thumbnails
import airaHospital1 from "@/assets/stories/aira-hospital-1.jpg";
import airaHospital2 from "@/assets/stories/aira-hospital-2.jpg";
import danka1 from "@/assets/stories/danka-1.jpg";
import danka2 from "@/assets/stories/danka-2.jpg";
import danka3 from "@/assets/stories/danka-3.jpg";
import danka4 from "@/assets/stories/danka-4.jpg";
import danka5 from "@/assets/stories/danka-5.jpg";
import danka6 from "@/assets/stories/danka-6.jpg";
import danka7 from "@/assets/stories/danka-7.jpg";
import danka8 from "@/assets/stories/danka-8.jpg";

interface ProjectVideo {
  id: string;
  projectName: string;
  year: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail?: string;
}

// Video data organized by project - easy to add more later
const projectVideos: ProjectVideo[] = [
  // Aira Hospital Project
  {
    id: "aira-hospital-1",
    projectName: "Aira Hospital",
    year: "2024",
    title: "Aira General Hospital WASH Project",
    description: "Bringing clean water and sanitation infrastructure to healthcare facilities.",
    videoUrl: "/videos/aira-hospital-1.mp4",
    thumbnail: airaHospital1,
  },
  {
    id: "aira-hospital-2",
    projectName: "Aira Hospital",
    year: "2024",
    title: "Hospital WASH Infrastructure",
    description: "Essential water systems for patient care and medical operations.",
    videoUrl: "/videos/aira-hospital-2.mp4",
    thumbnail: airaHospital2,
  },
  // Danka WASH Project - Ordered by construction steps
  {
    id: "danka-wash-2",
    projectName: "Danka WASH Project",
    year: "2019",
    title: "Before Project Implementation",
    description: "Site assessment and community consultation before project begins.",
    videoUrl: "/videos/danka-wash-2.mp4",
    thumbnail: danka1,
  },
  {
    id: "danka-wash-4",
    projectName: "Danka WASH Project",
    year: "2019",
    title: "Before Project Implementation",
    description: "Community gathering and planning phase before construction.",
    videoUrl: "/videos/danka-wash-4.mp4",
    thumbnail: danka3,
  },
  {
    id: "danka-wash-3",
    projectName: "Danka WASH Project",
    year: "2019",
    title: "Foundation Construction",
    description: "Laying the groundwork and foundation for water infrastructure.",
    videoUrl: "/videos/danka-wash-3.mp4",
    thumbnail: danka2,
  },
  {
    id: "danka-wash-5",
    projectName: "Danka WASH Project",
    year: "2019",
    title: "Reservoir Construction",
    description: "Building the water reservoir for community water storage.",
    videoUrl: "/videos/danka-wash-5.mp4",
    thumbnail: danka4,
  },
  {
    id: "danka-wash-1",
    projectName: "Danka WASH Project",
    year: "2019",
    title: "Danka Community Water Initiative",
    description: "Transforming water access for the Danka community through sustainable solutions.",
    videoUrl: "/videos/danka-wash-1.mp4",
    thumbnail: danka5,
  },
  {
    id: "danka-wash-6",
    projectName: "Danka WASH Project",
    year: "2019",
    title: "Hygiene Education Programs",
    description: "Teaching proper hygiene practices to prevent waterborne diseases.",
    videoUrl: "/videos/danka-wash-6.mp4",
    thumbnail: danka6,
  },
  {
    id: "danka-wash-7",
    projectName: "Danka WASH Project",
    year: "2019",
    title: "Students Enjoying Water",
    description: "Students enjoying clean water from the newly built well.",
    videoUrl: "/videos/danka-wash-7.mp4",
    thumbnail: danka7,
  },
  {
    id: "danka-wash-8",
    projectName: "Danka WASH Project",
    year: "2019",
    title: "Milestone Celebration",
    description: "Celebrating the successful completion of the water project.",
    videoUrl: "/videos/danka-wash-8.mp4",
    thumbnail: danka8,
  },
];

// Group videos by project
const groupedVideos = projectVideos.reduce((acc, video) => {
  if (!acc[video.projectName]) {
    acc[video.projectName] = [];
  }
  acc[video.projectName].push(video);
  return acc;
}, {} as Record<string, ProjectVideo[]>);

function VideoCard({ video, onClick, index }: { video: ProjectVideo; onClick: () => void; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    videoRef.current?.play();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateY: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
      className="relative group cursor-pointer perspective-1000"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-2 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        animate={isHovered ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <div className="relative overflow-hidden rounded-xl bg-card border border-border/50 shadow-lg group-hover:shadow-2xl transition-all duration-500 transform-gpu group-hover:scale-[1.02]">
        {/* Video Preview Container */}
        <div className="relative aspect-video overflow-hidden">
          {/* Thumbnail image (shown when not hovered) */}
          {video.thumbnail && (
            <img
              src={video.thumbnail}
              alt={video.title}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
            />
          )}
                  <video
                    ref={videoRef}
                    src={video.videoUrl}
                    className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${video.thumbnail && !isHovered ? 'opacity-0' : 'opacity-100'}`}
                    muted
                    loop
                    playsInline
                    style={{ imageRendering: 'auto' }}
                  />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Play button */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: isHovered ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30"
              whileHover={{ scale: 1.1 }}
              animate={isHovered ? {} : { scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Play className="w-7 h-7 text-white fill-white ml-1" />
            </motion.div>
          </motion.div>

          {/* Hover action button */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold flex items-center gap-2 shadow-lg"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Maximize2 className="w-4 h-4" />
              Watch Full Video
            </motion.div>
          </motion.div>

          {/* Year badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full bg-accent/90 text-accent-foreground text-sm font-bold backdrop-blur-sm">
              {video.year}
            </span>
          </div>

          {/* Film strip decoration */}
          <div className="absolute top-4 right-4 flex items-center gap-1 text-white/60">
            <Film className="w-4 h-4" />
            <span className="text-xs font-medium">VIDEO</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h4 className="font-display text-lg font-bold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {video.title}
          </h4>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {video.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function VideoLightbox({ 
  video, 
  isOpen, 
  onClose, 
  onNext, 
  onPrev, 
  hasNext, 
  hasPrev 
}: { 
  video: ProjectVideo | null;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && video && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Content */}
          <div className="relative z-10 w-full max-w-6xl mx-4">
            {/* Header */}
            <motion.div
              className="flex items-center justify-between mb-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div>
                <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-bold mb-2 inline-block">
                  {video.year}
                </span>
                <h3 className="text-white text-2xl font-display font-bold mt-2">
                  {video.title}
                </h3>
                <p className="text-white/60 mt-1">{video.description}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/10"
              >
                <X className="w-6 h-6" />
              </Button>
            </motion.div>

            {/* Video Player */}
            <motion.div
              className="relative rounded-2xl overflow-hidden bg-black shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            >
              <video
                ref={videoRef}
                src={video.videoUrl}
                className="w-full aspect-video object-contain bg-black"
                autoPlay
                loop
                playsInline
                style={{ imageRendering: 'auto', maxHeight: '80vh' }}
              />

              {/* Video Controls */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={togglePlay}
                      className="text-white hover:bg-white/20 w-12 h-12"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6 ml-0.5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleMute}
                      className="text-white hover:bg-white/20"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </Button>
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onPrev}
                      disabled={!hasPrev}
                      className="text-white hover:bg-white/20 disabled:opacity-30"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onNext}
                      disabled={!hasNext}
                      className="text-white hover:bg-white/20 disabled:opacity-30"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function StoryVideoGallery() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [lightboxVideo, setLightboxVideo] = useState<ProjectVideo | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const allVideos = projectVideos;

  const openLightbox = (video: ProjectVideo) => {
    const index = allVideos.findIndex((v) => v.id === video.id);
    setLightboxIndex(index);
    setLightboxVideo(video);
  };

  const closeLightbox = () => {
    setLightboxVideo(null);
  };

  const goToNext = () => {
    if (lightboxIndex < allVideos.length - 1) {
      const nextIndex = lightboxIndex + 1;
      setLightboxIndex(nextIndex);
      setLightboxVideo(allVideos[nextIndex]);
    }
  };

  const goToPrev = () => {
    if (lightboxIndex > 0) {
      const prevIndex = lightboxIndex - 1;
      setLightboxIndex(prevIndex);
      setLightboxVideo(allVideos[prevIndex]);
    }
  };

  return (
    <section ref={ref} className="relative py-24 overflow-hidden bg-gradient-to-b from-muted/30 via-background to-muted/30">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1], 
            opacity: [0.3, 0.5, 0.3],
            x: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2], 
            opacity: [0.3, 0.5, 0.3],
            x: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        {/* Floating film reels decoration */}
        <motion.div
          className="absolute top-40 right-20"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <Film className="w-8 h-8 text-primary/20" />
        </motion.div>
        <motion.div
          className="absolute bottom-40 left-20"
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <Sparkles className="w-6 h-6 text-accent/30" />
        </motion.div>
      </div>

      <div className="container-main relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Film className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Video Gallery</span>
          </motion.div>

          <motion.h2
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            See Our{" "}
            <span className="text-gradient bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Impact in Action
            </span>
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Watch real stories of transformation from our WASH projects across Ethiopia
          </motion.p>
        </motion.div>

        {/* Video Grid by Project */}
        {Object.entries(groupedVideos).map(([projectName, videos], groupIndex) => (
          <motion.div
            key={projectName}
            className="mb-16 last:mb-0"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 + groupIndex * 0.1 }}
          >
            {/* Project Name Header */}
            <div className="flex items-center gap-4 mb-8">
              <motion.div
                className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
              <h3 className="font-display text-xl md:text-2xl font-bold text-foreground px-4 whitespace-nowrap">
                {projectName}
              </h3>
              <motion.div
                className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </div>

            {/* Videos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video, index) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  index={index}
                  onClick={() => openLightbox(video)}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <VideoLightbox
        video={lightboxVideo}
        isOpen={!!lightboxVideo}
        onClose={closeLightbox}
        onNext={goToNext}
        onPrev={goToPrev}
        hasNext={lightboxIndex < allVideos.length - 1}
        hasPrev={lightboxIndex > 0}
      />
    </section>
  );
}
