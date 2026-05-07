import { Check } from 'lucide-react';
import type { FoodItem } from '../../types';
import { formatCalories } from '../../utils/formatters';
import { Input } from '../ui/Input';

type FoodCardProps = {
  food: FoodItem;
  selected: boolean;
  portionGrams: number;
  onToggle: () => void;
  onPortionChange: (value: number) => void;
};

export function FoodCard({ food, selected, portionGrams, onToggle, onPortionChange }: FoodCardProps) {
  return (
    <article className={`food-card ${selected ? 'selected' : ''}`}>
      <button type="button" className="food-select" onClick={onToggle} aria-pressed={selected}>
        <span>
          <span className="badge badge-green">{food.categoryLabel}</span>
          <strong>{food.name}</strong>
          <small>{formatCalories(food.caloriesPer100g)}/100g</small>
        </span>
        <img src={food.image} alt={food.name} loading="lazy" />
        {selected ? <Check aria-hidden="true" className="check-icon" /> : null}
      </button>
      {selected ? (
        <Input
          id={`portion-${food.id}`}
          label="Porção em gramas"
          min={10}
          type="number"
          value={portionGrams}
          onChange={(event) => onPortionChange(Number(event.target.value))}
        />
      ) : null}
    </article>
  );
}
