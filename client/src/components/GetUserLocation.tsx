import { useState } from 'react';
import { RollerCoaster } from './RollerCoaster';

export type Location = {
  lat: number;
  long: number;
};

type GetUserLocationProps = {
  onObtainedLocation: (location: Location) => void;
};

export function GetUserLocation({ onObtainedLocation }: GetUserLocationProps) {
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleLocationClick() {
    setIsLoading(true);
    if (!navigator.geolocation) throw new Error('Geolocation is not supported');
    navigator.geolocation.getCurrentPosition(success, error);
  }

  function success(position) {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    onObtainedLocation({ lat, long });
    setLocation({ lat, long });
    setIsLoading(false);
  }

  function error() {
    throw new Error('Unable to obtain location');
  }

  if (isLoading)
    return (
      <div>
        <RollerCoaster />
      </div>
    );

  return (
    <div className="flex flex-col">
      <div>
        {location && (
          <div className="block text-black text-center font-1">
            Got your location!
          </div>
        )}
      </div>
      <div className="flex justify-center py-5">
        <button className="btn btn-md text-white" onClick={handleLocationClick}>
          {location ? 'Update my location' : 'Get my Location'}
        </button>
      </div>
    </div>
  );
}
