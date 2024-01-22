import { LandingCarousel } from '../components/LandingCarousel';
import { Link } from 'react-router-dom';

const images = [
  {
    src: '/src/images/1.jpg',
    alt: 'checking',
    caption: 'Check Wait Times',
  },
  {
    src: '/src/images/2.jpg',
    alt: 'planning',
    caption: 'Plan Your Day!',
  },
  {
    src: '/src/images/3.jpg',
    alt: 'enjoying',
    caption: 'Enjoy the Thrill!',
  },
];

export function LandingPage() {
  return (
    <div>
      <LandingCarousel images={images} />
      <div className="h-610 flex flex-col justify-around bg-secondary">
        <p className="text-center text-black font-2">
          Smile and Soar: Thrill Awaits, No Lines in your Way!
        </p>
        <p className="text-center text-black font-2">
          Find Wait Times for your favorite rides!
        </p>
        <div className="text-center">
          <Link to="/sign-in" className="btn btn-ghost text-black">
            Sign-In
          </Link>
          <span className="text-black">/</span>
          <Link to="/sign-up" className="btn btn-ghost text-black">
            Sign-Up
          </Link>
        </div>
      </div>
    </div>
  );
}
