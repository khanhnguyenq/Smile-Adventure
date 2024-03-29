import { useEffect, useState } from 'react';
import { fetchParks } from '../data';

export type ParkLocation = {
  parkName: string;
  parkId: string;
  longitude: number;
  latitude: number;
};

type ParkComparison = {
  distance: number;
  parkName: string;
  parkId: string;
};

type ParksByDistanceProps = {
  lat: number | undefined;
  long: number | undefined;
  onParkClick: (parkId: string, parkName: string) => void;
};

export function ParksByDistance({
  lat,
  long,
  onParkClick,
}: ParksByDistanceProps) {
  const [parkDetails, setParkDetails] = useState<ParkLocation[]>();

  useEffect(() => {
    async function getParkDetails() {
      try {
        const result = await fetchParks();
        setParkDetails(result);
      } catch (err) {
        console.log(err);
      }
    }
    getParkDetails();
  }, []);

  function getDistanceFromLatLonInMi(lat1, lon1, lat2, lon2, parkName, parkId) {
    const result: ParkComparison = {
      distance: 0,
      parkName: '',
      parkId: '',
    };
    const R = 3958.75; // Radius of the earth in mi
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in mi
    result.distance = d;
    result.parkName = parkName;
    result.parkId = parkId;
    return result;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  const userLat = lat;
  const userLong = long;

  const park = parkDetails?.map((i) =>
    getDistanceFromLatLonInMi(
      userLat,
      userLong,
      i.latitude,
      i.longitude,
      i.parkName,
      i.parkId
    )
  );

  const sortedPark = park?.sort((a, b) => a.distance - b.distance);
  const namesOfSortedPark = sortedPark?.slice(0, 10).map((i, index) => (
    <button
      onClick={() => onParkClick(i.parkId, i.parkName)}
      className="btn btn-ghost btn-md text-base"
      key={index}>
      {i.parkName}
    </button>
  ));

  return (
    <div className="flex justify-center flex-col py-5 font-1 text-black">
      {namesOfSortedPark}
    </div>
  );
}
