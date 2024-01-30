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

export const tokenKey = 'user';

export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string>();
  const [favoriteRides, setFavoriteRides] = useState<FavoriteRideInfo[]>([]);
  const [isAuthorizing, setIsAuthorizing] = useState(true);
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);

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
      } finally {
        setIsLoading(false);
      }
    }
    getFavoriteRidesInfo();
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
    favoriteRides,
    removeAttraction,
    addAttraction,
  };

  return (
    <UserProvider value={contextValue}>
      <Routes>
        <Route path="/" element={<NavBar onSignOut={handleSignOut} />}>
          <Route index element={<LandingPage />} />
          <Route path="/sign-up" element={<SignUpForm />} />
          <Route
            path="/sign-in"
            element={<SignInForm onSignIn={handleSignIn} />}
          />
          <Route path="/favorite" element={<FavoriteRides />} />
          <Route path="/logged-in" element={<LoggedIn />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/park" element={<ClickedPark />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </UserProvider>
  );
}
