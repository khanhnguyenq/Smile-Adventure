import { LandingCarousel } from '../components/LandingCarousel';
import { Link } from 'react-router-dom';
import { RollerCoaster } from '../components/RollerCoaster';

const images = [
  {
    src: 'images/1.jpg',
    alt: 'checking',
    caption: 'Check Wait Times',
  },
  {
    src: 'images/2.jpg',
    alt: 'planning',
    caption: 'Plan Your Day!',
  },
  {
    src: 'images/3.jpg',
    alt: 'enjoying',
    caption: 'Enjoy the Thrill!',
  },
];

export function LandingPage() {
  return (
    <div>
      <LandingCarousel images={images} />
      <div className="flex flex-col bg-secondary h-screen">
        <p className="text-center text-black font-2 basis-1/6 items-center flex justify-center">
          Smile and Soar: Thrill Awaits, No Lines in your Way!
        </p>
        <p className="text-center text-black font-2 basis-1/6 items-center flex justify-center">
          Find Wait Times for your favorite rides!
        </p>
        <div className="text-center basis-1/6 items-center flex justify-center">
          <Link to="/sign-in" className="btn btn-ghost text-black">
            Sign-In
          </Link>
          <span className="text-black">/</span>
          <Link to="/sign-up" className="btn btn-ghost text-black">
            Sign-Up
          </Link>
        </div>
        <div className="flex justify-center content-end flex-wrap">
          <RollerCoaster />
        </div>
      </div>
    </div>
  );
}
