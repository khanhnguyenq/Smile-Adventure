import { useEffect, useState } from 'react';

type ParkDetail = {
  parkName: string;
  longitude: number;
  latitude: number;
};

export function ParksByDistance() {
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

  console.log(parkDetails);

  // function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  //   const R = 3958.75; // Radius of the earth in mi
  //   const dLat = deg2rad(lat2 - lat1); // deg2rad below
  //   const dLon = deg2rad(lon2 - lon1);
  //   const a =
  //     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //     Math.cos(deg2rad(lat1)) *
  //       Math.cos(deg2rad(lat2)) *
  //       Math.sin(dLon / 2) *
  //       Math.sin(dLon / 2);
  //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //   const d = R * c; // Distance in mi
  //   return d;
  // }

  // function deg2rad(deg) {
  //   return deg * (Math.PI / 180);
  // }
  const park = parkDetails?.map((i) => <li key={i.parkName}>{i.parkName}</li>);

  return (
    <div className="flex justify-center py-5">
      <ul className="text-black text-center font-1">{park}</ul>
    </div>
  );
}
