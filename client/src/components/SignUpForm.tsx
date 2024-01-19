import { FormEvent } from 'react';

export function SignUpForm() {
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
      const res = await fetch('/api/auth/sign-up', req);
      if (!res.ok) {
        throw new Error(`fetch Error ${res.status}`);
      }
      const user = await res.json();
      console.log('Registered', user);
    } catch (err) {
      alert(`Error registering user: ${err}`);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label className="block">
          Name:
          <input className="bg-gray-200 block" type="text" name="name" />
        </label>
      </div>
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
        <button>Register</button>
      </div>
    </form>
  );
}
