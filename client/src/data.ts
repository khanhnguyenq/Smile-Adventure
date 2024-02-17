import { LiveAPIResult, RideInfo } from './components/FetchRides';
import { ParkLocation } from './components/ParksByDistance';
import { Schedule, ScheduleAPIResult } from './pages/ClickedPark';
import { FavoriteRideInfo } from './pages/FavoriteRides';
import { ChildrenAPIResult } from './pages/SelectedRide';

export async function fetchParks(): Promise<ParkLocation[]> {
  const res = await fetch('/api/parks');
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return await res.json();
}
export async function fetchParkInformation(
  parkId: ParkLocation['parkId']
): Promise<ScheduleAPIResult> {
  let result = {} as ScheduleAPIResult;
  const res = await fetch(
    `https://api.themeparks.wiki/v1/entity/${parkId}/schedule`
  );
  if (!res.ok)
    throw new Error(`${res.status}: Unable to fetch operating hours`);
  const resJSON = (await res.json()) as ScheduleAPIResult;
  result = resJSON;
  return result;
}

export async function fetchRideLocation(
  parkId: ParkLocation['parkId']
): Promise<ChildrenAPIResult> {
  let result = {} as ChildrenAPIResult;
  const res = await fetch(
    `https://api.themeparks.wiki/v1/entity/${parkId}/children`
  );
  if (!res.ok) throw new Error(`${res.status}: Unable to fetch park children`);
  const resJSON = (await res.json()) as ChildrenAPIResult;
  result = resJSON;
  return result;
}

export async function fetchParkHours(
  parkId: ParkLocation['parkId']
): Promise<Schedule> {
  let result = {} as Schedule;
  const res = await fetch(
    `https://api.themeparks.wiki/v1/entity/${parkId}/schedule`
  );
  if (!res.ok)
    throw new Error(`${res.status}: Unable to fetch operating hours`);
  const resJSON = (await res.json()) as ScheduleAPIResult;
  const operatingArray: Schedule[] = [];
  for (let i = 0; i < resJSON.schedule.length; i++) {
    if (resJSON.schedule[i].type === 'OPERATING') {
      operatingArray.push(resJSON.schedule[i]);
    }
  }
  result = operatingArray[0];
  return result;
}

export async function fetchAllRides(
  parkId: ParkLocation['parkId']
): Promise<RideInfo[]> {
  const res = await fetch(
    `https://api.themeparks.wiki/v1/entity/${parkId}/live`
  );
  if (!res.ok)
    throw new Error(`${res.status}: Unable to fetch rides from park`);
  const resJSON = (await res.json()) as LiveAPIResult;
  return resJSON.liveData;
}

export async function fetchAllFavoriteRides(): Promise<FavoriteRideInfo[]> {
  const req = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };
  const res = await fetch('/api/favorite', req);
  if (!res.ok) throw new Error(`${res.status}: Unable to fetch favorite rides`);
  const resJSON = (await res.json()) as FavoriteRideInfo[];
  return resJSON;
}

export async function insertToFavorite(
  favoriteRideData
): Promise<FavoriteRideInfo> {
  const req = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(favoriteRideData),
  };
  const res = await fetch('/api/heart', req);
  if (!res.ok) throw new Error('Error inserting into favorite table');
  const resJSON = await res.json();
  return resJSON;
}

export async function removeFromFavorite(
  favoriteRideEntry: number
): Promise<void> {
  const req = {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };
  const res = await fetch(`/api/heart/${favoriteRideEntry}`, req);
  if (!res.ok) throw new Error('Error removing ride from favorite');
}

export function getView() {
  let viewData = localStorage.getItem('view');
  if (!viewData) viewData = 'Name';
  return viewData;
}
