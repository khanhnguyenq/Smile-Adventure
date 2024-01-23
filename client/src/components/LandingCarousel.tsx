import { useEffect, useState } from 'react';

type Pictures = {
  caption: string;
  src: string;
  alt: string;
};

type LandingCarouselProps = {
  images: Pictures[];
};

export function LandingCarousel({ images }: LandingCarouselProps) {
  const [currentImage, setCurrentImage] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      if (currentImage >= images.length - 1) {
        setCurrentImage(0);
      } else {
        setCurrentImage(currentImage + 1);
      }
    }, 5000);
    return () => clearInterval(id);
  }, [currentImage, images]);

  return <ImageCarousel images={images} currentImage={currentImage} />;
}

type ImageCarouselProps = {
  images: LandingCarouselProps['images'];
  currentImage: number;
};

function ImageCarousel({ images, currentImage }: ImageCarouselProps) {
  return (
    <div>
      <div className="w-full h-60 md:h-96">
        <img
          className="w-full h-full"
          src={images[currentImage].src}
          alt={images[currentImage].alt}
        />
      </div>
      <p className="text-center bg-secondary text-black font-1 text-2xl">
        {images[currentImage].caption}
      </p>
    </div>
  );
}
