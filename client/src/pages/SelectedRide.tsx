import { useParams } from 'react-router-dom';

export function SelectedRide() {
  const { parkId, rideId } = useParams();

  return (
    <div>
      <p>{parkId}</p>
      <p>{rideId}</p>
    </div>
  );
}
