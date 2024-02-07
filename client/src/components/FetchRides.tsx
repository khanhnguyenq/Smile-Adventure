import { useEffect, useState } from 'react';
import {
  fetchAllRides,
  fetchParkInformation,
  insertToFavorite,
  removeFromFavorite,
} from '../data';
import { FavoriteButton } from './FavoriteButton';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  const [view, setView] = useState<string>('Name');
  const { user, favoriteRides, removeAttraction, addAttraction } = useUser();
  const navigate = useNavigate();
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
  }, [clickedParkId]);

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
  }, [clickedParkId]);

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
        await removeFromFavorite(deleteId);
        removeAttraction(deleteId);
      } else {
        const updatedFavorite = await insertToFavorite(favoriteRideData);
        addAttraction(updatedFavorite);
      }
    } catch (err) {
      setError(err);
    }
  }

  function handleRideClick(parkId, rideId) {
    navigate(`/ride/${parkId}/${rideId}`);
  }

  const sortLongest = openRides
    .slice()
    .sort((a, b) => b.queue.STANDBY.waitTime - a.queue.STANDBY.waitTime);

  const sortShortest = openRides
    .slice()
    .sort((a, b) => a.queue.STANDBY.waitTime - b.queue.STANDBY.waitTime);

  const sortName = openRides.slice().sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });

  const rideIdArray: string[] = [];
  for (let i = 0; i < favoriteRides.length; i++) {
    rideIdArray.push(favoriteRides[i].attractionId);
  }

  let sortType;
  view === 'Name'
    ? (sortType = sortName)
    : view === 'Longest'
    ? (sortType = sortLongest)
    : (sortType = sortShortest);

  const displayList = sortType.map((i, index) => (
    <div
      className=" bg-white shadow-md p-4 text-black m-2 rounded-lg w-2/3 flex flex-col lg:w-1/4 md:w-1/3 justify-between"
      key={index}>
      <div className="flex justify-between w-full">
        <p
          className="cursor-pointer hover:text-2xl font-1 pb-3"
          onClick={() => handleRideClick(clickedParkId, i.id)}>
          {i.name}
        </p>
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
      <div className="flex justify-between content-end">
        <p className="font-serif text-xs flex pt-[3px]">
          Status:{' '}
          <span className="rounded-md bg-green-200 text-green-600 border border-green-600 mt-1 hidden sm:contents md:contents lg:contents">
            Operating
          </span>
          <span className="rounded-full h-4 w-4 bg-green-200 flex flex-wrap justify-center content-center sm:hidden md:hidden lg:hidden">
            <span className="rounded-full bg-green-600 h-2 w-2"></span>
          </span>
        </p>
        <p className="font-serif text-xs">
          Smile Time:{' '}
          <span
            className="font-bold text-sm"
            style={{
              color:
                i.queue.STANDBY.waitTime >= 60
                  ? 'red'
                  : i.queue.STANDBY.waitTime >= 30
                  ? 'orange'
                  : 'green',
            }}>
            {i.queue.STANDBY.waitTime === null ? '0' : i.queue.STANDBY.waitTime}
          </span>{' '}
          Mins
        </p>
      </div>
    </div>
  ));

  // const displayList = openAttractionsArray.map((i, index) => (
  //   <div
  //     className=" bg-white shadow-md p-4 text-black m-2 rounded-lg w-2/3 flex flex-col lg:w-1/4 md:w-1/3"
  //     key={index}>
  //     <div className="flex justify-between w-full">
  //       <p
  //         className="cursor-pointer hover:text-2xl font-1"
  //         onClick={() => handleRideClick(clickedParkId, i.id)}>
  //         {i.name}
  //       </p>
  //       {rideIdArray.includes(i.id) ? (
  //         <FavoriteButton
  //           favorite="Yes"
  //           onSelect={() => {
  //             handleSelect(i.id, i.name);
  //           }}
  //         />
  //       ) : (
  //         <FavoriteButton
  //           favorite="No"
  //           onSelect={() => {
  //             handleSelect(i.id, i.name);
  //           }}
  //         />
  //       )}
  //     </div>
  //     <div className="flex justify-between">
  //       <p className="font-serif text-xs">
  //         Status:{' '}
  //         {i.status === 'OPERATING' ? (
  //           <span className="rounded-md p-1 bg-green-200 text-green-600">
  //             Operating
  //           </span>
  //         ) : (
  //           <span className="rounded-md p-1 bg-red-200 text-red-600">
  //             Closed
  //           </span>
  //         )}
  //         {/* <span className="rounded-md p-1 bg-green-200 text-green-600">
  //           Operating
  //         </span> */}
  //       </p>
  //       <p className="font-serif text-xs">
  //         Smile Time:{' '}
  //         {i.status === 'OPERATING'
  //           ? i.queue.STANDBY.waitTime === null
  //             ? '0'
  //             : i.queue.STANDBY.waitTime
  //           : '0'}
  //       </p>
  //       {/* <p className="font-serif text-xs">
  //         Smile Time:{' '}
  //         {i.queue.STANDBY.waitTime === null ? '0' : i.queue.STANDBY.waitTime}{' '}
  //         Minutes
  //       </p> */}
  //     </div>
  //   </div>
  // ));

  return (
    <div>
      <div className="dropdown dropdown-bottom w-full flex justify-center">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-sm bg-secondary text-black font-1 hover:bg-white">{`Sort by: ${view}`}</div>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow bg-white rounded-box w-52 ">
          <li className="text-black font-1 hover:bg-white">
            <a onClick={() => setView('Name')}>Name</a>
          </li>
          <li className="text-black font-1 hover:bg-white">
            <a onClick={() => setView('Longest')}>Longest Wait Time</a>
          </li>
          <li className="text-black font-1 hover:bg-white">
            <a onClick={() => setView('Shortest')}>Shortest Wait Time</a>
          </li>
        </ul>
      </div>
      <div className="flex flex-wrap justify-center pt-6">{displayList}</div>
    </div>
  );
}
