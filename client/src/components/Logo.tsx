import { useNavigate } from 'react-router-dom';

export function Logo() {
  const navigate = useNavigate();
  return (
    <div>
      <img
        style={{ cursor: 'pointer' }}
        onClick={() => navigate('/')}
        className="w-20"
        src="/images/logo.png"
        alt="logo"
      />
    </div>
  );
}
