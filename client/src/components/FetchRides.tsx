import { useEffect, useState } from 'react';
import {
  fetchAllRides,
  fetchParkInformation,
  insertToFavorite,
  removeFromFavorite,
} from '../data';
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
  const [isLoading, setIsLoading] = useState(true);
  const [params] = useSearchParams();
  const { user, favoriteRides, removeAttraction, addAttraction } = useUser();
  const clickedParkId = params.get('id');

  useEffect(() => {
    async function getRidesInfo() {
      try {
        const result = await fetchAllRides(clickedParkId ?? '');
        setRideInfo(result);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
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
      } finally {
        setIsLoading(false);
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
      // create favorite ride object based on provided data
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
      // loop through favorite rides and find any items that matches the conditionals
      // favorite ride must matches all three conditionals to be consider unique
      const foundItem = favoriteRides.find(
        (item) =>
          item.userId === userId &&
          item.attractionId === attractionId &&
          item.parkId === parkId
      );
      // get the entry id from the matched item if there is no matched item, deleteId is undefined
      const deleteId = foundItem?.entryId;
      // if deleteId exist:
      if (deleteId) {
        // remove the item from the userAttractions database
        // function is defined in data.ts line 88
        await removeFromFavorite(deleteId);
        // execute removeAttraction to update the favoriteRides state
        // function is defined in App.tsx line 65 and made available through useContext
        removeAttraction(deleteId);
        // if deleteId does not exist
      } else {
        // add the created object on line 113 to userAttraction table
        const updatedFavorite = await insertToFavorite(favoriteRideData);
        // execute addAttraction which updates the favoriteRides by
        // spreading the original array and adding the return value from above function
        // function is defined in App.tsx line 72
        addAttraction(updatedFavorite);
      }
    } catch (err) {
      setError(err);
    }
  }

  const sortLongest = openRides.sort(
    (a, b) => b.queue.STANDBY.waitTime - a.queue.STANDBY.waitTime
  );

  const rideIdArray: string[] = [];
  for (let i = 0; i < favoriteRides.length; i++) {
    rideIdArray.push(favoriteRides[i].attractionId);
  }

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
