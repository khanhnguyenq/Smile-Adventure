import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAllRides } from '../data';
import { RideInfo } from '../components/FetchRides';

export function SelectedRide() {
  const { parkId, rideId } = useParams();
  const [rideInfo, setRideInfo] = useState<RideInfo[]>([]);
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getRidesInfo() {
      try {
        const result = await fetchAllRides(parkId ?? '');
        setRideInfo(result);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    getRidesInfo();
  }, []);

  let matchedRide;

  for (let i = 0; i < rideInfo.length; i++) {
    if (rideInfo[i].id === rideId) {
      matchedRide = rideInfo[i];
    }
  }

  if (error)
    return (
      <div>
        Error: {error instanceof Error ? error.message : 'Unknown Error'}
      </div>
    );

  if (isLoading) return <div>Loading!</div>;

  return (
    <div className="h-screen pt-[68px] bg-secondary text-black font-1">
      <p>{matchedRide.name}</p>
      <p>
        Status:{' '}
        {matchedRide.status[0] + matchedRide.status.slice(1).toLowerCase()}
      </p>
      <p>
        {matchedRide.status === 'OPERATING' ??
          `Wait Time: ${matchedRide.queue.STANDBY.waitTime} minutes`}
      </p>
    </div>
  );
}
