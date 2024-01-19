import { FormEvent } from 'react';

export function SignInForm() {
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
      console.log('Logged in!', user, '; token:', token);
    } catch (err) {
      alert(`Error registering user: ${err}`);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label className="block">
          Username:
          <input className="bg-gray-200 block" type="text" name="username" />
        </label>
      </div>
      <div>
        <label className="block">
          Password:
          <input
            className="bg-gray-200 block"
            type="password"
            name="password"
          />
        </label>
      </div>
      <div>
        <button>Login</button>
      </div>
    </form>
  );
}
