import { LandingCarousel } from '../components/LandingCarousel';
import { Link } from 'react-router-dom';
import { useUser } from '../components/useUser';

const images = [
  {
    src: 'images/1.jpg',
    alt: 'checking',
    caption: 'Check Wait Times!',
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
  const { user } = useUser();
  return (
    <div className="min-h-screen pt-[63px]">
      <LandingCarousel images={images} />
      <div className="flex flex-col bg-secondary">
        <p className="text-center text-black font-2 p-12 text-2xl">
          Smile and Soar: Thrill Awaits, No Lines in your Way!
        </p>
        <p className="text-center text-black font-2 p-12 bg-primary text-xl">
          Find Wait Times for your favorite rides!
        </p>
        {user ? (
          <div className="text-center items-center flex justify-center py-12">
            <Link to="/logged-in" className="btn btn-ghost text-black text-lg">
              Search Parks
            </Link>
          </div>
        ) : (
          <div className="text-center items-center flex justify-center py-12">
            <Link to="/sign-in" className="btn btn-ghost text-black text-lg">
              Sign-In
            </Link>
            <span className="text-black">/</span>
            <Link to="/sign-up" className="btn btn-ghost text-black text-lg">
              Sign-Up
            </Link>
          </div>
        )}
        <div className="flex justify-center items-end pt-20"></div>
      </div>
    </div>
  );
}
