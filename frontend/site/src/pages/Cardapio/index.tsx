import { Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CalorieBar } from '../../components/cardapio/CalorieBar';
import { FoodCard } from '../../components/cardapio/FoodCard';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { MIN_PORTION_GRAMS } from '../../constants';
import arrozBrancoImage from '../../assets/images/arroz-branco.png';
import saladaMixImage from '../../assets/images/salada-mix.png';
import carneBovinaImage from '../../assets/images/carne-bovina.png';
import { getAlimentos } from '../../services/cardapioService';
import { useCardapioDerived, useCardapioStore } from '../../hooks/useCardapio';
import type { FoodCategory } from '../../types';

const groups: { category: FoodCategory; label: string; title: string; image: string; alt: string }[] = [
  { category: 'carboidrato', label: 'Grupo 1', title: 'Carboidratos', image: arrozBrancoImage, alt: 'Arroz branco' },
  { category: 'salada', label: 'Grupo 2', title: 'Saladas', image: saladaMixImage, alt: 'Salada mix' },
  { category: 'proteina', label: 'Grupo 3', title: 'Proteínas', image: carneBovinaImage, alt: 'Carne bovina' },
];

export function Cardapio() {
  const alimentos = getAlimentos();
  const { selectedPortions, totalCalories, validation } = useCardapioDerived();
  const toggleFood = useCardapioStore((state) => state.toggleFood);
  const updatePortion = useCardapioStore((state) => state.updatePortion);

  return (
    <section className="section muted">
      <div className="container menu-layout">
        <div className="food-columns">
          {groups.map((group) => (
            <section key={group.category} className="food-group" aria-labelledby={`${group.category}-title`}>
              <div className="food-group-header">
                <img className="food-group-image" src={group.image} alt={group.alt} loading="lazy" />
                <div>
                  <span className="eyebrow">{group.label}</span>
                  <h2 id={`${group.category}-title`}>{group.title}</h2>
                </div>
              </div>
              <div className="food-stack">
                {alimentos.filter((food) => food.category === group.category).map((food) => {
                  const selected = selectedPortions.find((portion) => portion.food.id === food.id);
                  return (
                    <FoodCard
                      key={food.id}
                      food={food}
                      selected={Boolean(selected)}
                      portionGrams={selected?.portionGrams ?? food.defaultPortionGrams}
                      onToggle={() => toggleFood(food)}
                      onPortionChange={(value) => updatePortion(food.id, Math.max(value, MIN_PORTION_GRAMS))}
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </div>
        <aside className="side-panel sticky">
          <CalorieBar totalCalories={totalCalories} />
          <Card className="rules-card">
            <h2>Regras aplicadas</h2>
            <ul>
              {validation.messages.length > 0 ? validation.messages.map((message) => <li key={message}>{message}</li>) : <li>Cardápio dentro das regras nutricionais.</li>}
            </ul>
            <Button className="full" disabled={!validation.isValid}>
              <Save aria-hidden="true" size={18} />
              Salvar cardápio
            </Button>
            <Link
              className={`button button-primary full ${!validation.isValid ? 'disabled-link' : ''}`}
              to={validation.isValid ? '/producao' : '#'}
              aria-disabled={!validation.isValid}
            >
              Vincular com produção
            </Link>
          </Card>
        </aside>
      </div>
    </section>
  );
}
