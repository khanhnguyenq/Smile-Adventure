import './App.css';
import { NavBar } from './components/NavBar';
import { SignInForm, tokenKey } from './pages/SignInForm';
import { SignUpForm } from './pages/SignUpForm';
import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoggedIn } from './pages/LoggedIn';
import { NotFound } from './pages/NotFound';
import { useEffect, useState } from 'react';
import { Auth, User } from './lib/api';
import { UserProvider } from './components/AppContext';
// import { ParksByDistance } from './components/ParksByDistance';
// import { GetLocation } from './components/GetLocation';
// import { FetchParks } from './components/FetchParks';
// import { FetchLocation } from './components/FetchLocation';

export default function App() {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string>();
  const [isAuthorizing, setIsAuthorizing] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem(tokenKey);
    if (auth) {
      const a = JSON.parse(auth) as Auth;
      setUser(a.user);
      setToken(a.token);
    }
    setIsAuthorizing(false);
  }, []);

  if (isAuthorizing) return null;

  const contextValue = { user, token };

  return (
    <UserProvider value={contextValue}>
      <Routes>
        <Route path="/" element={<NavBar />}>
          <Route index element={<LandingPage />} />
          <Route path="/sign-up" element={<SignUpForm />} />
          <Route path="/sign-in" element={<SignInForm />} />
          <Route path="/logged-in" element={<LoggedIn />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </UserProvider>

    // <GetLocation />
    // <FetchParks />
    // <FetchLocation />
    // <ParksByDistance />
  );
}
