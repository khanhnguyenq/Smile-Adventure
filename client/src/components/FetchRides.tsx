import { useEffect, useState } from 'react';
import {
  fetchAllFavoriteRides,
  fetchAllRides,
  fetchParkInformation,
  insertToFavorite,
  removeFromFavorite,
} from '../data';
import { FavoriteButton } from './FavoriteButton';
import { useSearchParams } from 'react-router-dom';
import { useUser } from './useUser';
import { FavoriteRideInfo } from '../pages/FavoriteRides';

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
  const [favoriteRides, setFavoriteRides] = useState<FavoriteRideInfo[]>([]);
  const [rideInfo, setRideInfo] = useState<RideInfo[]>([]);
  const [parkInfo, setParkInfo] = useState<Partial<LiveAPIResult>>();
  const [rideIdArray, setRideIdArray] = useState<string[]>([]);
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);
  const [params] = useSearchParams();
  const { user } = useUser();
  const clickedParkId = params.get('id');

  useEffect(() => {
    const data = localStorage.getItem('entryIdArray');
    if (data) {
      const entryIdArray: string[] = JSON.parse(data ?? '');
      setRideIdArray(entryIdArray);
    } else {
      setRideIdArray([]);
    }
  }, []);

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

  useEffect(() => {
    async function getFavoriteRidesInfo() {
      try {
        const result = await fetchAllFavoriteRides();
        setFavoriteRides(result);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    getFavoriteRidesInfo();
  }, []);

  if (error)
    return (
      <div>
        Error: {error instanceof Error ? error.message : 'Unknown Error'}
      </div>
    );

  if (isLoading) return <div>Loading!</div>;

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

  async function handleSelect(attractionId, attractionName) {
    try {
      const userId = user?.userId;
      const parkId = parkInfo?.id;
      const parkName = parkInfo?.name;
      const rideName = attractionName;
      const favoriteRideData = {
        userId,
        attractionId,
        parkId,
        parkName,
        rideName,
      };
      const foundItem = favoriteRides.find(
        (item) =>
          item.userId === userId &&
          item.attractionId === attractionId &&
          item.parkId === parkId
      );
      const deleteId = foundItem?.entryId;
      if (deleteId) {
        const updatedFavorite = favoriteRides.filter(
          (item) => item.entryId !== deleteId
        );
        const updatedEntryIdArray = rideIdArray.filter(
          (item) => item !== attractionId
        );
        await removeFromFavorite(deleteId);
        setFavoriteRides(updatedFavorite);
        setRideIdArray(updatedEntryIdArray);
        localStorage.setItem(
          'entryIdArray',
          JSON.stringify(updatedEntryIdArray)
        );
      } else {
        const result: FavoriteRideInfo = await insertToFavorite(
          favoriteRideData
        );
        setFavoriteRides([...favoriteRides, result]);
        const newEntryIdArray = [...rideIdArray, result.attractionId];
        setRideIdArray(newEntryIdArray);
        localStorage.setItem('entryIdArray', JSON.stringify(newEntryIdArray));
      }
    } catch (err) {
      setError(err);
    }
  }

  const sortLongest = openRides.sort(
    (a, b) => b.queue.STANDBY.waitTime - a.queue.STANDBY.waitTime
  );

  const ridesListLongest = sortLongest.map((i, index) => (
    <div
      className="p-4 font-1 text-black border-black border-solid border-2 m-2 rounded w-1/2"
      key={index}>
      <div className="flex justify-between">
        <p>{i.name}</p>
        {rideIdArray.includes(i.id) ? (
          <FavoriteButton
            favorite="Yes"
            onSelect={() => {
              handleSelect(i.id, i.name);
            }}
          />
        ) : (
          <FavoriteButton
            favorite="No"
            onSelect={() => {
              handleSelect(i.id, i.name);
            }}
          />
        )}
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
