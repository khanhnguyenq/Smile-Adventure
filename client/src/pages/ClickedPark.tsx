import { useEffect, useState } from 'react';
import { fetchParkHours } from '../data';
import { useUser } from '../components/useUser';
import { FetchRides } from '../components/FetchRides';

export type Schedule = {
  date: string;
  type: string;
  closingTime: string;
  openingTime: string;
};

export function ClickedPark() {
  const { clickedParkId, clickedParkName } = useUser();
  const [parkHours, setParkHours] = useState<Schedule>();
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    async function getParkOperatingHours() {
      try {
        const result = await fetchParkHours('' + clickedParkId);
        setParkHours(result);
      } catch (err) {
        setError(err);
      }
    }
    getParkOperatingHours();
  }, []);

  const openingTime = parkHours?.openingTime.split('T')[1].slice(0, 5);
  const closingTime = parkHours?.closingTime.split('T')[1].slice(0, 5);

  if (error)
    return (
      <div>
        Error: {error instanceof Error ? error.message : 'Unknown Error'}
      </div>
    );

  return (
    <div>
      <p>{clickedParkName}</p>
      <p>Today's Date: {parkHours?.date}</p>
      <p>
        Operating Hours: {openingTime} - {closingTime}
      </p>
      <FetchRides />
    </div>
  );
}
