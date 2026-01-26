import React, { useState, useEffect } from 'react';
import { useUser } from '../hooks';
import { useProjects } from '../queries/projects';
import { useInspections } from '../queries/inspections';
import type { ExtendedCurrentUser } from '../components/types';

interface ProgressGalleryProps {
  className?: string;
}

const ProgressGallery: React.FC<ProgressGalleryProps> = ({ className = '' }) => {
  const { currentUser } = useUser() as { currentUser: ExtendedCurrentUser };
  const [images, setImages] = useState<{url: string, caption: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: projects = [] } = useProjects();
  const { data: inspections = [] } = useInspections();

  useEffect(() => {
    if (currentUser) {
      fetchProgressImages();
    }
  }, [currentUser]);

  const fetchProgressImages = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      // Fetch projects first
      const response: any = await projectsService.findAll({}, currentUser);
      const projects = Array.isArray(response) ? response : (response.items || []);
      
      // For each project, fetch inspections which may contain images
      const allImages: {url: string, caption: string}[] = [];
      
      for (const project of projects.slice(0, 3)) {
        try {
          const inspections = await inspectionsService.getProjectInspections(project.id, currentUser);
          // Extract images from inspections (this is a simplified example)
          inspections.slice(0, 2).forEach((inspection: any) => {
            // In a real implementation, you would extract actual image URLs from the inspection
            // For now, we'll use placeholder images with meaningful captions
            allImages.push({
              url: `https://placehold.co/600x400/cccccc/969696?text=Project+${project.id}+Inspection`,
              caption: `${project.name} - ${new Date(inspection.createdAt).toLocaleDateString()}`
            });
          });
        } catch (err) {
          console.error(`Error fetching inspections for project ${project.id}:`, err);
        }
      }
      
      // If no images found, use placeholder data
      if (allImages.length === 0) {
        setImages([
          { url: 'https://placehold.co/600x400/cccccc/969696?text=Progress+1', caption: 'Site Preparation' },
          { url: 'https://placehold.co/600x400/cccccc/969696?text=Progress+2', caption: 'Foundation Work' },
          { url: 'https://placehold.co/600x400/cccccc/969696?text=Progress+3', caption: 'Structural Framing' },
        ]);
      } else {
        setImages(allImages.slice(0, 3)); // Limit to 3 images
      }
    } catch (err) {
      console.error("Error fetching progress images:", err);
      // Fallback to static data
      setImages([
        { url: 'https://placehold.co/600x400/cccccc/969696?text=Progress+1', caption: 'Site Preparation' },
        { url: 'https://placehold.co/600x400/cccccc/969696?text=Progress+2', caption: 'Foundation Work' },
        { url: 'https://placehold.co/600x400/cccccc/969696?text=Progress+3', caption: 'Structural Framing' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className={`bg-white p-4 rounded-lg shadow-md ${className}`}>
        <h2 className="text-lg font-bold mb-4">Progress Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((index) => (
            <div key={index} className="w-full h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={`bg-white p-4 rounded-lg shadow-md ${className}`}>
      <h2 className="text-lg font-bold mb-4">Progress Gallery</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index}>
            <img 
              src={image.url} 
              alt={`Progress ${index + 1}`} 
              className="w-full h-32 object-cover rounded" 
            />
            <p className="text-center text-sm mt-1 text-gray-600">{image.caption}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProgressGallery;