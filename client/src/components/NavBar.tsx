import { Link, Outlet } from 'react-router-dom';
import { Logo } from './Logo';
import { useUser } from './useUser';
import { GuestBtn } from './GuestBtn';

export function NavBar() {
  const { user, handleSignOut } = useUser();
  return (
    <div>
      <div className="navbar bg-primary fixed top-0 z-50">
        <div className="navbar-start">
          <div className="drawer w-fit">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content w-5 cursor-pointer">
              <label htmlFor="my-drawer" className="text-black drawer-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </label>
            </div>
            <div className="drawer-side">
              <label
                htmlFor="my-drawer"
                aria-label="close sidebar"
                className="drawer-overlay"></label>
              <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                <li>
                  <Link to="/">Home Page</Link>
                </li>
                <li>
                  <Link to={user ? '/logged-in' : '/not-found'}>
                    Search Parks
                  </Link>
                </li>
                <li>
                  <Link to="/favorite">Favorite Rides</Link>
                </li>
                <li>
                  <Link to="/all-parks">All Available Parks</Link>
                </li>
              </ul>
            </div>
          </div>
          <GuestBtn />
        </div>
        <Logo />
        <div className="navbar-end">
          {user && (
            <>
              <div>
                <Link to="/logged-in" className="btn btn-ghost text-black">
                  Search Parks
                </Link>
              </div>
              <button
                onClick={handleSignOut}
                className="btn btn-ghost text-black">
                Sign-Out
              </button>
            </>
          )}
          {user === undefined && (
            <>
              <Link to="/sign-in" className="btn btn-ghost text-black">
                Sign-In
              </Link>
              <Link to="/sign-up" className="btn btn-ghost text-black">
                Sign-Up
              </Link>
            </>
          )}
        </div>
      </div>
      <Outlet />
    </div>
  );
}
