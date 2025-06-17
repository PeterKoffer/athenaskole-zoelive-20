
import { useEffect, useState } from 'react';

interface PreloadedImage {
  url: string;
  loaded: boolean;
}

export const useImagePreloader = (imageUrls: string[]) => {
  const [preloadedImages, setPreloadedImages] = useState<PreloadedImage[]>([]);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = imageUrls.map((url) => {
        return new Promise<PreloadedImage>((resolve) => {
          const img = new Image();
          img.onload = () => resolve({ url, loaded: true });
          img.onerror = () => resolve({ url, loaded: false });
          img.src = url;
        });
      });

      const results = await Promise.all(imagePromises);
      setPreloadedImages(results);
      setAllImagesLoaded(results.every(img => img.loaded));
    };

    if (imageUrls.length > 0) {
      preloadImages();
    }
  }, [imageUrls]);

  return { preloadedImages, allImagesLoaded };
};

// Hook specifically for preloading all classroom images
export const useClassroomImagePreloader = () => {
  const classroomImageUrls = [
    '/lovable-uploads/5f9c6e95-d949-47f5-bb3a-08f0c1c84d72.png', // mathematics
    '/lovable-uploads/9159860b-6b0b-413c-abd0-a9eba4d31423.png', // english
    '/lovable-uploads/ab7502b0-78bd-4d20-8254-3e5a2c355bfd.png', // science
    '/lovable-uploads/bb51f857-f561-4049-8eac-9f9d6868d1ee.png', // computer-science
    '/lovable-uploads/4f04a56b-d49f-4093-b974-e56c182dbefd.png', // music
    '/lovable-uploads/aa5d1c92-da37-4dc9-b296-97e3a8959445.png', // creative-arts
    '/lovable-uploads/c8289e41-3209-4615-9d1c-a88a36d97a9d.png', // language
    '/lovable-uploads/55794c6e-a3ae-477d-8b33-91c38b59faac.png', // geography
    '/lovable-uploads/187b1fdd-cc92-4f4b-a966-804b5b76ea3a.png', // music-advanced
  ];

  return useImagePreloader(classroomImageUrls);
};
