import { useEffect, useState } from 'react';
import { fetchParkHours, fetchParkInformation } from '../data';
import { FetchRides } from '../components/FetchRides';
import { useSearchParams } from 'react-router-dom';
import moment from 'moment-timezone';
import { BackButton } from '../components/BackBtn';

export type ScheduleAPIResult = {
  id: string;
  name: string;
  entityType: string;
  timezone: string;
  schedule: Schedule[];
};

export type Schedule = {
  date: string;
  type: string;
  closingTime: string;
  openingTime: string;
};

export type ParkInfo = {
  parkName: string;
  parkId: string;
};

export function ClickedPark() {
  const [parkInformation, setParkInformation] = useState<ScheduleAPIResult>();
  const [parkHours, setParkHours] = useState<Schedule>();
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [params] = useSearchParams();

  const clickedParkId = params.get('id');

  useEffect(() => {
    async function getParkInformation() {
      try {
        const result = await fetchParkInformation(clickedParkId ?? '');
        setParkInformation(result);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    getParkInformation();
  }, [clickedParkId]);

  useEffect(() => {
    async function getParkOperatingHours() {
      try {
        const result = await fetchParkHours(clickedParkId ?? '');
        setParkHours(result);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    getParkOperatingHours();
  }, [clickedParkId]);

  let openingTime;
  let closingTime;
  if (!parkHours?.openingTime) {
    openingTime = 'Not Available';
  } else {
    const dataFormat = parkHours.openingTime.split('T')[1];
    openingTime = dataFormat.slice(0, 5);
  }
  if (!parkHours?.closingTime) {
    closingTime = 'Not Available';
  } else {
    const dataFormat = parkHours.closingTime.split('T')[1];
    closingTime = dataFormat.slice(0, 5);
  }

  let timeAtPark;
  let dateAtPark;
  if (parkInformation) {
    timeAtPark = moment().tz(`${parkInformation.timezone}`).format('HH:mm z');
    dateAtPark = moment()
      .tz(`${parkInformation?.timezone}`)
      .format('YYYY-MM-DD');
  }

  if (isLoading)
    return (
      <div className="bg-secondary h-screen pt-[67px]">
        <p className="flex justify-center flex-col py-5 font-1 text-black text-center text-xl">
          Loading Information!
        </p>
      </div>
    );

  if (error)
    return (
      <div>
        Error: {error instanceof Error ? error.message : 'Unknown Error'}
      </div>
    );

  return (
    <div className="bg-secondary pt-[67px]">
      <BackButton displayText="Back to Search Results" />
      <div className="text-center text-black items-center flex flex-col justify-center py-6">
        <p className="font-2 pt-2 text-2xl">{parkInformation?.name}</p>
        <p className="font-1 text-sm pt-1">{parkInformation?.timezone}</p>
        <p className="font-1 text-sm pt-1">
          Current Time at Park: <span>{timeAtPark}</span>
        </p>
        <p className="font-1 py-1 text-lg">{`Today's Date (At Park): ${dateAtPark}`}</p>
        <p className="font-1 py-1 text-lg">
          {`Operating Hours: ${openingTime} - ${closingTime}`}
        </p>
      </div>
      <FetchRides />
    </div>
  );
}
