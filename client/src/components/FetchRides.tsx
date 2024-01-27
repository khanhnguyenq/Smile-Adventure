import { useEffect, useState } from 'react';
import { fetchAllRides, fetchParkInformation } from '../data';
import { FavoriteButton } from './FavoriteButton';
import { useSearchParams } from 'react-router-dom';
import { useUser } from './useUser';

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
  id: string;
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

export function FetchRides() {
  const [rideInfo, setRideInfo] = useState<RideInfo[]>([]);
  const [parkInfo, setParkInfo] = useState<Partial<LiveAPIResult>>();
  const [error, setError] = useState<unknown>();
  const [params] = useSearchParams();
  const { user } = useUser();

  const clickedParkId = params.get('id');

  useEffect(() => {
    async function getRidesInfo() {
      try {
        const result = await fetchAllRides(clickedParkId ?? '');
        setRideInfo(result);
      } catch (err) {
        setError(err);
      }
    }
    getRidesInfo();
  }, []);

  useEffect(() => {
    async function getParkInfo() {
      try {
        const result = await fetchParkInformation(clickedParkId ?? '');
        setParkInfo(result);
      } catch (err) {
        setError(err);
      }
    }
    getParkInfo();
  }, []);

  if (error)
    return (
      <div>
        Error: {error instanceof Error ? error.message : 'Unknown Error'}
      </div>
    );

  if (!rideInfo) throw new Error('Error obtaining all rides');

  const openAttractionsArray: RideInfo[] = [];
  for (let i = 0; i < rideInfo.length; i++) {
    if (
      rideInfo[i].entityType === 'ATTRACTION' &&
      rideInfo[i].status === 'OPERATING'
    ) {
      openAttractionsArray.push(rideInfo[i]);
    }
  }
  const openRides: RideInfo[] = [];
  for (let i = 0; i < openAttractionsArray.length; i++) {
    if (openAttractionsArray[i].queue) {
      openRides.push(openAttractionsArray[i]);
    }
  }

  const sortLongest = openRides.sort(
    (a, b) => b.queue.STANDBY.waitTime - a.queue.STANDBY.waitTime
  );

  async function handleSelect(attractionId) {
    try {
      const userId = user?.userId;
      const parkId = parkInfo?.id;
      const favoriteRideData = { userId, attractionId, parkId };
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(favoriteRideData),
      };
      const res = await fetch('/api/heart', req);
      if (!res.ok) throw new Error('Error inserting into favorite table');
    } catch (err) {
      setError(err);
    }
  }

  const ridesListLongest = sortLongest.map((i, index) => (
    <div
      className="p-4 font-1 text-black border-black border-solid border-2 m-2 rounded w-1/2"
      key={index}>
      <div className="flex justify-between">
        <p>{i.name}</p>
        <FavoriteButton
          onSelect={() => {
            handleSelect(i.id);
          }}
        />
      </div>
      <p>Status: Operating</p>
      <p>
        {`Wait time: ${
          i.queue.STANDBY.waitTime === null ? '0' : i.queue.STANDBY.waitTime
        } Minutes`}
      </p>
    </div>
  ));

  return (
    <div className="flex flex-col content-center flex-wrap">
      {ridesListLongest}
    </div>
  );
}