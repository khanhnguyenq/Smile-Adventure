import { Logo } from './logo';

type NavBarProps = {
  content: string;
  onClick: () => void;
};

export function NavBar({ content, onClick }: NavBarProps) {
  return (
    <div className="flex bg-primary">
      <div className="basis-1/2 flex flex-nowrap">
        <Logo />
      </div>
      <div className="basis-1/2 flex flex-nowrap justify-end items-center">
        <a onClick={onClick}>{content}</a>
      </div>
    </div>
  );
}

type NavBarLandingProps = {
  signup: string;
  signin: string;
  onClickOne: () => void;
  onClickTwo: () => void;
};

export function NavBarLanding({
  signup,
  signin,
  onClickOne,
  onClickTwo,
}: NavBarLandingProps) {
  return (
    <div className="flex bg-primary">
      <div className="basis-1/2 flex flex-nowrap">
        <Logo />
      </div>
      <div className="basis-1/2 flex flex-nowrap justify-end items-center">
        <a onClick={onClickOne}>{`${signup} `}</a>/
        <a onClick={onClickTwo}>{` ${signin}`}</a>
      </div>
    </div>
  );
}
