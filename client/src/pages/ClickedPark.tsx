type ClickedParkProps = {
  parkId: string;
  parkName: string;
};

export function ClickedPark({ parkId, parkName }: ClickedParkProps) {
  return (
    <div>
      <p>{parkId}</p>
      <p>{parkName}</p>
    </div>
  );
}
