import { ParkLocation } from './components/ParksByDistance';

export async function fetchParks(): Promise<ParkLocation[]> {
  const res = await fetch('/api/parks');
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return await res.json();
}
