import { useEffect, useState } from 'react';
import { useUser } from '../components/useUser';
import { RideInfo, fetchAllRides } from '../data';

export function FetchRides() {
  const { clickedParkId } = useUser();
  const [rideInfo, setRideInfo] = useState<RideInfo[]>([]);
  const [error, setError] = useState<unknown>();
  // const [view, setView] = useState('longest');

  useEffect(() => {
    async function getRidesInfo() {
      try {
        const result = await fetchAllRides('' + clickedParkId);
        setRideInfo(result);
      } catch (err) {
        setError(err);
      }
    }
    getRidesInfo();
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

  // const sortShortest = openRides.sort(
  //   (a, b) => a.queue.STANDBY.waitTime - b.queue.STANDBY.waitTime
  // );

  const sortLongest = openRides.sort(
    (a, b) => b.queue.STANDBY.waitTime - a.queue.STANDBY.waitTime
  );

  // const ridesListShortest = sortShortest.map((i, index) => (
  //   <div
  //     className="p-4 font-1 text-black border-black border-solid border-2 m-2 rounded w-1/2"
  //     key={index}>
  //     <div className="flex justify-between">
  //       <p>{i.name}</p>
  //       <p>F</p>
  //     </div>
  //     <p>Status: Operating</p>
  //     <p>
  //       {`Wait time: ${
  //         i.queue.STANDBY.waitTime === null ? '0' : i.queue.STANDBY.waitTime
  //       } Minutes`}
  //     </p>
  //   </div>
  // ));

  const ridesListLongest = sortLongest.map((i, index) => (
    <div
      className="p-4 font-1 text-black border-black border-solid border-2 m-2 rounded w-1/2"
      key={index}>
      <div className="flex justify-between">
        <p>{i.name}</p>
        <p>F</p>
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
