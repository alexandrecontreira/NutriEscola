import { BarChart3, CircleCheck, ShieldCheck, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CalorieBar } from '../../components/cardapio/CalorieBar';
import { Card } from '../../components/ui/Card';
import { useCardapioDerived } from '../../hooks/useCardapio';
import { formatCalories, formatPercent } from '../../utils/formatters';

const icons = [Utensils, BarChart3, ShieldCheck, CircleCheck];

export function Dashboard() {
  const { totalCalories, totalPlates, platesToProduce, surplusPercent, validation, selectedPortions } = useCardapioDerived();
  const cards = [
    { value: platesToProduce.toString(), label: 'Pratos base' },
    { value: formatCalories(totalCalories), label: 'kcal por refeição' },
    { value: formatPercent(surplusPercent), label: 'Acréscimo de segurança' },
    { value: validation.isValid ? 'Válido' : 'Pendente', label: 'Status do cardápio' },
  ];

  return (
    <>
      <section className="section">
        <div className="container">
          <div className="section-title">
            <span className="eyebrow">Painel do dia</span>
            <h2>Resumo do cardápio ativo</h2>
            <p>Indicadores principais para acompanhar calorias, pratos e conformidade antes da produção.</p>
          </div>
          <div className="summary-grid">
            {cards.map((card, index) => {
              const Icon = icons[index];
              return (
                <Card key={card.label} className="summary-card">
                  <Icon aria-hidden="true" />
                  <strong>{card.value}</strong>
                  <span>{card.label}</span>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section muted">
        <div className="container two-column">
          <div>
            <div className="section-title left">
              <span className="eyebrow">Cardápio sugerido</span>
              <h2>Refeição balanceada</h2>
              <p>Modelo inicial com porções controladas e total calórico dentro do limite.</p>
            </div>
            <div className="preview-grid">
              {selectedPortions.map((portion) => (
                <Card key={portion.food.id} className="preview-card">
                  <img src={portion.food.image} alt={portion.food.name} loading="lazy" />
                  <span className="badge badge-green">{portion.food.categoryLabel}</span>
                  <h3>{portion.food.name}</h3>
                  <p>{portion.portionGrams}g por prato - {formatCalories(portion.totalCalories)}</p>
                </Card>
              ))}
            </div>
          </div>
          <aside className="side-panel">
            <CalorieBar totalCalories={totalCalories} />
            <div className="production-kpi">
              <span>Total calculado</span>
              <strong>{totalPlates} pratos</strong>
            </div>
            <Link className="button button-primary full" to="/cardapio">Montar cardápio</Link>
          </aside>
        </div>
      </section>
    </>
  );
}
