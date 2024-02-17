import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAllRides, fetchRideLocation } from '../data';
import { RideInfo } from '../components/FetchRides';
import { useUser } from '../components/useUser';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { BackButton } from '../components/BackBtn';

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
  const placeholder = {
    id: '',
    name: '',
    entityType: '',
    location: {
      longitude: 0,
      latitude: 0,
    },
  };
  const { parkId, rideId } = useParams();
  const [rideInfo, setRideInfo] = useState<RideInfo>();
  const [rideLocation, setRideLocation] = useState<Children>(placeholder);
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(true);
  const { apiKey } = useUser();

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

  const position = {
    lat: rideLocation.location.latitude,
    lng: rideLocation.location.longitude,
  };

  return (
    <APIProvider apiKey={apiKey}>
      <div className="h-screen pt-[67px] bg-secondary text-black font-1 text-center">
        <BackButton displayText="Back to Rides" />
        <p className="pt-10">{rideInfo.name}</p>
        <p className="pt-2">
          Status: {rideInfo.status[0] + rideInfo.status.slice(1).toLowerCase()}
        </p>
        <p className="py-2">
          Wait Time: {rideInfo.queue.STANDBY.waitTime} minutes
        </p>
        <div className="h-80 w-10/12 m-auto">
          <Map
            center={position}
            defaultZoom={17}
            fullscreenControl={false}
            mapTypeControl={false}
            streetViewControl={false}>
            <Marker position={position} />
          </Map>
        </div>
      </div>
    </APIProvider>
  );
}
