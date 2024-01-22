export function LoggedIn() {
  const user = localStorage.getItem('user');
  if (!user) throw new Error('User does not exist.');
  const parsedUser = JSON.parse(user);
  const displayName = parsedUser.replace(
    `${parsedUser[0]}`,
    `${parsedUser[0].toUpperCase()}`
  );

  return (
    <div className="h-[850px] bg-secondary flex flex-col flex-wrap content-center">
      <p className="text-black text-center font-2">
        Welcome back, {displayName}!
      </p>
      <p className="text-black text-center font-1">
        Where are we heading today?
      </p>
      <div className="flex justify-center py-5">
        <label className="block text-black text-center font-1">
          Search for a park below:
          <input
            type="text"
            placeholder="Type a Park Here"
            name="username"
            className="input input-bordered w-48 h-8 max-w-xs bg-gray-200 block"
          />
        </label>
      </div>
      <p className="text-black text-center font-1">
        Or Select One of these Parks:
      </p>
    </div>
  );
}
