import { useEffect, useState } from 'react';
import { useUser } from '../components/useUser';
import { RideInfo, fetchAllRides } from '../data';

export function FetchRides() {
  const { clickedParkId } = useUser();
  const [rideInfo, setRideInfo] = useState<RideInfo[]>([]);
  const [error, setError] = useState<unknown>();

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

  console.log('openRides:', openRides);

  const openRidesList = openRides.map((i, index) => (
    <div className="p-4" key={index}>
      <p>{i.name}</p>
      <p>Status: {i.status.toLocaleLowerCase()}</p>
      <p>
        {`Wait time: ${
          i.queue.STANDBY.waitTime === null ? '0' : i.queue.STANDBY.waitTime
        } Minutes`}
      </p>
    </div>
  ));

  return <div className="pt-9">{openRidesList}</div>;
}
