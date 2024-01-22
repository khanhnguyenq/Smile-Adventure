import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Logo } from './logo';

export function NavBar() {
  const user = localStorage.getItem('user');
  const navigate = useNavigate();
  return (
    <div>
      <div className="navbar bg-primary">
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost lg:hidden text-black">
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
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-primary rounded-box w-52 text-black">
              <li>
                <Link to="/" className="text-black">
                  Home Page
                </Link>
              </li>
            </ul>
          </div>
          <Logo />
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/" className="text-black">
                Home Page
              </Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          {user && (
            <button
              onClick={() => {
                navigate('/');
                localStorage.clear();
              }}
              className="btn btn-ghost text-black">
              Sign-Out
            </button>
          )}
          {!user && (
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
