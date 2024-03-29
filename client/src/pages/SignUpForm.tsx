import { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export function SignUpForm() {
  const navigate = useNavigate();
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const inputData = Object.fromEntries(formData.entries());
      const userData = {
        name: inputData.name,
        username: inputData.username.toString().toLowerCase(),
        password: inputData.password,
      };
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      };
      const res = await fetch('/api/auth/sign-up', req);
      if (!res.ok) {
        throw new Error(`fetch Error ${res.status}`);
      }
      const user = await res.json();
      const displayName = user.name.replace(
        `${user.name[0]}`,
        `${user.name[0].toUpperCase()}`
      );
      alert(`Thank you for registering ${displayName}!`);
      navigate('/sign-in');
    } catch (err) {
      alert(`Error registering user: ${err}`);
    }
  }

  return (
    <div className="bg-secondary flex flex-col content-center pt-[67px] h-screen">
      <p className="text-center text-black font-2 items-center flex justify-center py-12 text-2xl">
        Let's get your adventure started!
      </p>
      <p className="text-center text-black font-1 items-center flex justify-center py-12 text-2xl">
        Sign-up for an account below!
      </p>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center py-5">
          <label className="block text-black text-center font-1 text-lg">
            Name:
            <input
              required
              type="text"
              name="name"
              className="input input-bordered w-48 h-8 max-w-xs bg-gray-200 block"
            />
          </label>
        </div>
        <div className="flex justify-center py-5">
          <label className="block text-black text-center font-1 text-lg">
            Username:
            <input
              required
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
              required
              type="password"
              name="password"
              className="input input-bordered w-48 h-8 max-w-xs bg-gray-200 block"
            />
          </label>
        </div>
        <div className="flex justify-center py-5">
          <button className="btn btn-sm text-white">Register</button>
        </div>
      </form>
    </div>
  );
}
