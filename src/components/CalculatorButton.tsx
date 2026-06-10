const variants = {
  number: "bg-slate-800/50 text-white",
  op: "bg-indigo-900/40 text-indigo-400",
  accent: "bg-amber-900/30 text-amber-400",
  danger: "bg-rose-900/40 text-rose-400",
  success: "bg-emerald-900/40 text-emerald-400",
  fn: "bg-slate-800 text-slate-300",
} as const;

const spans = {
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
} as const;

interface Props {
  label: string;
  onClick(): void;
  variant: keyof typeof variants;
  span?: keyof typeof spans;
}

function CalculatorButton(props: Props) {
  return (
    <button
      onClick={props.onClick}
      className={`calc-button select-none cursor-pointer ${props.span ? spans[props.span] : ""} ${variants[props.variant]} py-4 rounded-lg`}
      type="button"
    >
      {props.label}
    </button>
  );
}

export default CalculatorButton;
