import { CALORIE_LIMIT } from '../../constants';
import { getCalorieStatus } from '../../utils/cardapioUtils';
import { formatCalories } from '../../utils/formatters';
import { Badge } from '../ui/Badge';

type CalorieBarProps = {
  totalCalories: number;
};

export function CalorieBar({ totalCalories }: CalorieBarProps) {
  const percent = Math.min((totalCalories / CALORIE_LIMIT) * 100, 100);
  const status = getCalorieStatus(totalCalories);

  return (
    <div className="calorie-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Semáforo calórico</span>
          <h2>Total da refeição</h2>
        </div>
        <Badge tone={status.tone}>{status.label}</Badge>
      </div>
      <div className="calorie-total">{formatCalories(totalCalories)}</div>
      <div className="calorie-bar" aria-label="Uso do limite calórico">
        <span className={`calorie-fill ${status.tone}`} style={{ width: `${percent}%` }} />
      </div>
      <div className="scale">
        <span>0 kcal</span>
        <span>Limite: {formatCalories(CALORIE_LIMIT)}</span>
      </div>
    </div>
  );
}
