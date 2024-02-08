import { useUser } from './useUser';
import { useNavigate } from 'react-router-dom';

export function GuestBtn() {
  const { handleSignIn } = useUser();
  const navigate = useNavigate();
  async function handleGuestSignIn() {
    try {
      const userData = {
        username: 'test',
        password: 'test',
      };
      console.log('userData', userData);
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      };
      const res = await fetch('/api/auth/sign-in', req);
      if (!res.ok) {
        throw new Error(`fetch Error ${res.status}`);
      }
      const { user, token } = await res.json();
      localStorage.setItem('token', token);
      if (!user || !token) throw new Error('invalid user');
      handleSignIn({ user, token });
      navigate('/logged-in');
    } catch (err) {
      alert(`Error signing-in user: ${err}`);
    }
  }
  return (
    <div>
      <button className="btn btn-ghost text-black" onClick={handleGuestSignIn}>
        Guest Sign In
      </button>
    </div>
  );
}
