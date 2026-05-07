import type { IngredientRequirement } from '../../types';
import { formatCalories, formatGrams } from '../../utils/formatters';

type ReportTableProps = {
  items: IngredientRequirement[];
};

export function ReportTable({ items }: ReportTableProps) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Ingrediente</th>
            <th>Categoria</th>
            <th>Porção</th>
            <th>Total produzido</th>
            <th>Total calórico</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.food.id}>
              <td><strong>{item.food.name}</strong></td>
              <td>{item.food.categoryLabel}</td>
              <td>{formatGrams(item.portionGrams)}</td>
              <td>{formatGrams(item.totalGrams)}</td>
              <td>{formatCalories(item.totalCalories)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
