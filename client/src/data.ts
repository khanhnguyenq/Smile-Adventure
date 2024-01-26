import { ParkLocation } from './components/ParksByDistance';
import { Schedule } from './pages/ClickedPark';

type ScheduleAPIResult = {
  id: string;
  name: string;
  entityType: string;
  timezone: string;
  schedule: Schedule[];
};

export async function fetchParks(): Promise<ParkLocation[]> {
  const res = await fetch('/api/parks');
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return await res.json();
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

export type ForecastDetails = {
  time: string;
  waitTime: number;
};

export type WaitTime = {
  waitTime: number;
};

export type STANDBY = {
  STANDBY: WaitTime;
};

export type RideInfo = {
  name: string;
  entityType: string;
  status: string;
  queue: STANDBY;
  forecast: ForecastDetails[];
};

export type LiveAPIResult = {
  id: string;
  name: string;
  entityType: string;
  timezone: string;
  liveData: RideInfo[];
};

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
