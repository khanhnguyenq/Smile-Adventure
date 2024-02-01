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
      <div className="w-full h-60 sm:h-72 md:h-96 lg:h-screen">
        <img
          className="w-full h-full"
          src={images[currentImage].src}
          alt={images[currentImage].alt}
        />
        <p className="text-center text-white font-1 absolute top-60 right-8 text-3xl sm:top-[17rem] sm:text-4xl md:top-[22rem] md:text-5xl lg:top-[36rem] lg:text-6xl">
          {images[currentImage].caption}
        </p>
      </div>
    </div>
  );
}
