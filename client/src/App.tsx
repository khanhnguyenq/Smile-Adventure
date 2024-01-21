import './App.css';
import { useState } from 'react';
import { NavBar, NavBarLanding } from './components/NavBar';
import { SignInForm } from './components/SignInForm';
import { SignUpForm } from './components/SignUpForm';
import { LandingCarousel } from './components/LandingCarousel';
// import { FetchParks } from './components/FetchParks';

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

export default function App() {
  const [view, setView] = useState('landing');

  return (
    // <FetchParks />
    <>
      {view === 'landing' && (
        <div className="flex flex-col">
          <NavBarLanding
            signup="Sign-Up"
            signin="Sign-In"
            onClickOne={() => setView('sign-up')}
            onClickTwo={() => setView('sign-in')}
          />
          <LandingCarousel images={images} />
          <div className="h-610 flex flex-col justify-around bg-secondary">
            <p className="text-center">
              Smile and Soar: Thrill Awaits, No Lines in your Way!
            </p>
            <p className="text-center">
              Find Wait Times for your favorite rides!
            </p>
          </div>
        </div>
      )}
      {view === 'sign-up' && (
        <>
          <NavBar content="Sign-In" onClick={() => setView('sign-in')} />
          <SignUpForm />
        </>
      )}
      {view === 'sign-in' && (
        <>
          <NavBar content="Sign-Up" onClick={() => setView('sign-up')} />
          <SignInForm />
        </>
      )}
    </>
  );
}
