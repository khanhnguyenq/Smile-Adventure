import './App.css';
import { NavBar } from './components/NavBar';
import { SignInForm } from './pages/SignInForm';
import { SignUpForm } from './pages/SignUpForm';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoggedIn } from './pages/LoggedIn';
import { NotFound } from './pages/NotFound';
import { useEffect, useState } from 'react';
import { Auth, User } from './lib/api';
import { UserProvider } from './components/AppContext';
import { SearchResults } from './pages/SearchResults';
import { ClickedPark } from './pages/ClickedPark';
import { FavoriteRideInfo, FavoriteRides } from './pages/FavoriteRides';
import { fetchAllFavoriteRides } from './data';
import { AllParks } from './pages/AllParks';
import { SelectedRide } from './pages/SelectedRide';

export const tokenKey = 'user';

export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string>();
  const [favoriteRides, setFavoriteRides] = useState<FavoriteRideInfo[]>([]);
  const [isAuthorizing, setIsAuthorizing] = useState(true);
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    const auth = localStorage.getItem(tokenKey);
    if (auth) {
      const a = JSON.parse(auth) as Auth;
      setUser(a.user);
      setToken(a.token);
    }
    setIsAuthorizing(false);
  }, []);

  useEffect(() => {
    async function getFavoriteRidesInfo() {
      try {
        const result = await fetchAllFavoriteRides();
        setFavoriteRides(result);
      } catch (err) {
        setError(err);
      }
    }
    if (token) {
      getFavoriteRidesInfo();
    }
    setIsAuthorizing(false);
    setIsLoading(false);
  }, [token]);

  useEffect(() => {
    async function getKey() {
      try {
        const res = await fetch('/api/key');
        if (!res.ok) throw new Error('Error getting api key');
        const resJSON = await res.json();
        setApiKey(resJSON);
      } catch (err) {
        setError(err);
      }
    }
    getKey();
  }, []);

  function handleSignIn(auth: Auth) {
    localStorage.setItem(tokenKey, JSON.stringify(auth));
    setUser(auth.user);
    setToken(auth.token);
  }

  function handleSignOut() {
    localStorage.clear();
    setUser(undefined);
    setToken(undefined);
    navigate('/');
  }

  function removeAttraction(deleteId) {
    const updatedFavorite = favoriteRides.filter(
      (item) => item.entryId !== deleteId
    );
    setFavoriteRides(updatedFavorite);
  }

  function addAttraction(result) {
    setFavoriteRides([...favoriteRides, result]);
  }

  if (isAuthorizing) return null;

  if (error)
    return (
      <div>
        Error: {error instanceof Error ? error.message : 'Unknown Error'}
      </div>
    );

  if (isLoading) return <div>Loading!</div>;

  const contextValue = {
    user,
    token,
    apiKey,
    favoriteRides,
    handleSignIn,
    handleSignOut,
    removeAttraction,
    addAttraction,
  };

  return (
    <UserProvider value={contextValue}>
      <Routes>
        <Route path="/" element={<NavBar />}>
          <Route index element={<LandingPage />} />
          <Route path="/sign-up" element={<SignUpForm />} />
          <Route path="/sign-in" element={<SignInForm />} />
          <Route path="/favorite" element={<FavoriteRides />} />
          <Route path="/logged-in" element={<LoggedIn />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/park" element={<ClickedPark />} />
          <Route path="/ride/:parkId/:rideId" element={<SelectedRide />} />
          <Route path="/all-parks" element={<AllParks />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </UserProvider>
  );
}
