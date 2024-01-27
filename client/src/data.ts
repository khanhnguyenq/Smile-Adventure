import { LiveAPIResult, RideInfo } from './components/FetchRides';
import { ParkLocation } from './components/ParksByDistance';
import { Schedule, ScheduleAPIResult } from './pages/ClickedPark';
import { FavoriteRideInfo } from './pages/FavoriteRides';

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

export async function fetchParkHours(
  parkId: ParkLocation['parkId']
): Promise<Schedule> {
  const date = new Date();
  const day = date.getDate();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  const currentDate = `${year}-${month}-${day}`;
  let result = {} as Schedule;
  const res = await fetch(
    `https://api.themeparks.wiki/v1/entity/${parkId}/schedule`
  );
  if (!res.ok)
    throw new Error(`${res.status}: Unable to fetch operating hours`);
  const resJSON = (await res.json()) as ScheduleAPIResult;
  for (let i = 0; i < resJSON.schedule.length; i++) {
    if (
      resJSON.schedule[i].date === currentDate &&
      resJSON.schedule[i].type === 'OPERATING'
    ) {
      result = resJSON.schedule[i];
    }
  }
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
  const res = await fetch('/api/heart');
  if (!res.ok) throw new Error(`${res.status}: Unable to fetch favorite rides`);
  const resJSON = (await res.json()) as FavoriteRideInfo[];
  return resJSON;
}
