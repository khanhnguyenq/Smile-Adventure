import './App.css';
import { useState } from 'react';
import { NavBar, NavBarLanding } from './components/NavBar';
import { SignInForm } from './components/SignInForm';
import { SignUpForm } from './components/SignUpForm';

export default function App() {
  const [view, setView] = useState('landing');

  return (
    <>
      {view === 'landing' && (
        <>
          <NavBarLanding
            signup="Sign-Up"
            signin="Sign-In"
            onClickOne={() => setView('sign-up')}
            onClickTwo={() => setView('sign-in')}
          />
          <span>Smile and Soar: Thrill Awaits, No Lines in your Way! </span>
          <span>Find Wait Times for your favorite rides!</span>
        </>
      )}
      {view === 'sign-up' && (
        <>
          <NavBar content="Login" onClick={() => setView('sign-in')} />
          <SignUpForm />
        </>
      )}
      {view === 'sign-in' && (
        <>
          <NavBar content="Sign-up" onClick={() => setView('sign-up')} />
          <SignInForm />
        </>
      )}
    </>
  );
}
