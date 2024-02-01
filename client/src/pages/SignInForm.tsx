import { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/useUser';

export function SignInForm() {
  const { handleSignIn } = useUser();
  const navigate = useNavigate();
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const inputData = Object.fromEntries(formData.entries());
      const userData = {
        username: inputData.username.toString().toLowerCase(),
        password: inputData.password,
      };
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
    <div className="bg-secondary flex flex-col content-center pt-[67px]">
      <p className="text-center text-black font-2 items-center flex justify-center py-12 text-2xl">
        Let's get your adventure started!
      </p>
      <p className="text-center text-black font-1 items-center flex justify-center py-12 text-2xl">
        Sign-in below!
      </p>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center py-5">
          <label className="block text-black text-center font-1 text-lg">
            Username:
            <input
              type="text"
              name="username"
              className="input input-bordered w-48 h-8 max-w-xs bg-gray-200 block"
            />
          </label>
        </div>
        <div className="flex justify-center py-5">
          <label className="block text-black text-center font-1 text-lg">
            Password:
            <input
              type="password"
              name="password"
              className="input input-bordered w-48 h-8 max-w-xs bg-gray-200 block"
            />
          </label>
        </div>
        <div className="flex justify-center py-5">
          <button className="btn btn-sm text-white">Login</button>
        </div>
      </form>
    </div>
  );
}
