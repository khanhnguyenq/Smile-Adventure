import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAllRides, fetchRideLocation } from '../data';
import { RideInfo } from '../components/FetchRides';

export type Location = {
  longitude: number;
  latitude: number;
};

export type Children = {
  id: string;
  name: string;
  entityType: string;
  location: Location;
};

export type ChildrenAPIResult = {
  id: string;
  name: string;
  timezone: string;
  children: Children[];
};

export function SelectedRide() {
  const { parkId, rideId } = useParams();
  const [rideInfo, setRideInfo] = useState<RideInfo>();
  const [rideLocation, setRideLocation] = useState<Children>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getRidesInfo() {
      try {
        let matchedRideToPark;
        const result = await fetchAllRides(parkId ?? '');
        for (let i = 0; i < result.length; i++) {
          if (result[i].id === rideId) {
            matchedRideToPark = result[i];
          }
        }
        setRideInfo(matchedRideToPark);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    getRidesInfo();
  }, [parkId, rideId]);

  useEffect(() => {
    async function getRideLocation() {
      try {
        let matchedRideLocation;
        const result = await fetchRideLocation(parkId ?? '');
        for (let i = 0; i < result?.children.length; i++) {
          if (result?.children[i].id === rideId) {
            matchedRideLocation = result?.children[i];
          }
        }
        setRideLocation(matchedRideLocation);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    getRideLocation();
  }, [parkId, rideId]);

  if (error)
    return (
      <div>
        Error: {error instanceof Error ? error.message : 'Unknown Error'}
      </div>
    );

  if (isLoading) return <div>Loading!</div>;

  if (!rideInfo) throw new Error('Ride Information did not match');

  return (
    <div className="h-screen pt-[67px] bg-secondary text-black font-1">
      <p>{rideInfo.name}</p>
      <p>
        Status: {rideInfo.status[0] + rideInfo.status.slice(1).toLowerCase()}
      </p>
      <p>
        {rideInfo.status === 'OPERATING' ??
          `Wait Time: ${rideInfo.queue.STANDBY.waitTime} minutes`}
      </p>
      <p>{rideLocation?.location.latitude}</p>
      <p>{rideLocation?.location.longitude}</p>
    </div>
  );
}
