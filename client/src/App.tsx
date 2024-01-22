import './App.css';
import { NavBar } from './components/NavBar';
import { SignInForm } from './pages/SignInForm';
import { SignUpForm } from './pages/SignUpForm';
import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoggedIn } from './pages/LoggedIn';
import { NotFound } from './pages/NotFound';
// import { FetchParks } from './components/FetchParks';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<NavBar />}>
          <Route index element={<LandingPage />} />
          <Route path="/sign-up" element={<SignUpForm />} />
          <Route path="/sign-in" element={<SignInForm />} />
          <Route path="/logged-in" element={<LoggedIn />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>

    // <FetchParks />
  );
}
