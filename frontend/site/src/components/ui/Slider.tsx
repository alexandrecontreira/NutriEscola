import type { InputHTMLAttributes } from 'react';

type SliderProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  valueLabel: string;
};

export function Slider({ label, valueLabel, id, ...props }: SliderProps) {
  return (
    <label className="field" htmlFor={id}>
      <span className="field-row">
        <span>{label}</span>
        <strong>{valueLabel}</strong>
      </span>
      <input id={id} className="range" type="range" {...props} />
    </label>
  );
}
