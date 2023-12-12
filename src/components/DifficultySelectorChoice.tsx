interface Props {
  label: string;

  onclick: (label: string) => void;
  clickableButtons: boolean;
}
const DifficultySelectorChoice = ({
  label,
  onclick,
  clickableButtons,
}: Props) => {
  return (
    <div
      className={`flex items-center justify-around rounded border border-emerald-200 bg-emerald-700 shadow-md px-5 h-10 cursor-pointer ${
        !clickableButtons ? 'opacity-50' : ''
      } `}
      onClick={() => onclick(label)}
    >
      {label}
    </div>
  );
};

export default DifficultySelectorChoice;
