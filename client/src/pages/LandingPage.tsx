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
    <div className="container min-h-screen">
      <LandingCarousel images={images} />
      <div className="flex flex-col bg-secondary">
        <p className="text-center text-black font-2 items-center flex justify-center py-12 text-2xl">
          Smile and Soar: Thrill Awaits, No Lines in your Way!
        </p>
        <p className="text-center text-black font-2 items-center flex justify-center py-12 bg-primary text-xl">
          Find Wait Times for your favorite rides!
        </p>
        <div className="text-center items-center flex justify-center py-12">
          <Link to="/sign-in" className="btn btn-ghost text-black text-lg">
            Sign-In
          </Link>
          <span className="text-black">/</span>
          <Link to="/sign-up" className="btn btn-ghost text-black text-lg">
            Sign-Up
          </Link>
        </div>
        <div className="flex justify-center items-end pt-20">
          <RollerCoaster />
        </div>
      </div>
    </div>
  );
}
