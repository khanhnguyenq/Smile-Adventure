import { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export const tokenKey = 'user';

export function SignInForm() {
  const navigate = useNavigate();
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const userData = Object.fromEntries(formData.entries());
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
      if (!user || !token) throw new Error('invalid user');
      localStorage.setItem(tokenKey, JSON.stringify({ token, user }));
      navigate('/logged-in');
    } catch (err) {
      alert(`Error signing-in user: ${err}`);
    }
  }

  return (
    <div className="h-[850px] bg-secondary flex flex-col flex-wrap content-center">
      <p className="text-black my-12 text-center font-2">
        Let's get your adventure started!
      </p>
      <p className="text-black text-center font-1">Sign-in below!</p>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center py-5">
          <label className="block text-black text-center font-1">
            Username:
            <input
              type="text"
              name="username"
              className="input input-bordered w-48 h-8 max-w-xs bg-gray-200 block"
            />
          </label>
        </div>
        <div className="flex justify-center py-5">
          <label className="block text-black text-center font-1">
            Password:
            <input
              type="password"
              name="password"
              className="input input-bordered w-48 h-8 max-w-xs bg-gray-200 block"
            />
          </label>
        </div>
        <div className="flex justify-center py-5">
          <button className="btn btn-md text-white">Login</button>
        </div>
      </form>
    </div>
  );
}
