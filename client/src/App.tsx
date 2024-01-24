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
// import { FetchParks } from './components/FetchParks';
// import { FetchLocation } from './components/FetchLocation';

export const tokenKey = 'user';

export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string>();
  const [searchedPark, setSearchedPark] = useState<string>();
  const [value, setValue] = useState('');
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

  function handleSearch(searchPark: string) {
    setValue(searchPark);
    setSearchedPark(searchPark);
  }

  if (isAuthorizing) return null;

  const contextValue = { user, token, searchedPark };

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
          <Route
            path="/logged-in"
            element={
              <LoggedIn
                value={value}
                onSearch={(i) => {
                  handleSearch(i);
                }}
              />
            }
          />
          <Route path="/search" element={<SearchResults />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </UserProvider>

    // <FetchParks />
    // <FetchLocation />
  );
}
