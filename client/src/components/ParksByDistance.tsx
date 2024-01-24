import { useEffect, useState } from 'react';
// import { Location } from './GetUserLocation';

type ParkDetail = {
  parkName: string;
  longitude: number;
  latitude: number;
};

type ParkComparison = {
  distance: number;
  parkName: string;
};

type ParksByDistanceProps = {
  lat: number | undefined;
  long: number | undefined;
};

export function ParksByDistance({ lat, long }: ParksByDistanceProps) {
  const [parkDetails, setParkDetails] = useState<ParkDetail[]>();

  useEffect(() => {
    async function getParkDetails() {
      try {
        const res = await fetch('/api/parks');
        if (!res.ok) throw new Error(`${res.status}: Unable to get parks`);
        const result = (await res.json()) as ParkDetail[];
        setParkDetails(result);
      } catch (err) {
        console.log(err);
      }
    }
    getParkDetails();
  }, []);

  function getDistanceFromLatLonInMi(lat1, lon1, lat2, lon2, parkName) {
    const result: ParkComparison = {
      distance: 0,
      parkName: '',
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
      i.parkName
    )
  );

  const sortedPark = park?.sort((a, b) => a.distance - b.distance);
  const sortedParkNames = sortedPark?.map((i, index) => (
    <li key={index}>{i.parkName}</li>
  ));

  return (
    <div className="flex justify-center py-5">
      <ul className="text-black text-center font-1">{sortedParkNames}</ul>
    </div>
  );
}
