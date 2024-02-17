type BackButtonProps = {
  displayText: string;
};

export function BackButton({ displayText }: BackButtonProps) {
  return (
    <button
      onClick={() => window.history.go(-1)}
      className="btn btn-ghost absolute flex text-black font-1 text-center">
      {displayText}
    </button>
  );
}
