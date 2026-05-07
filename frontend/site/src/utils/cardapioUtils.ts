import { CALORIE_LIMIT, MAX_SURPLUS, MIN_PLATES, MIN_PORTION_GRAMS } from '../constants';
import type { FoodCategory, FoodItem, IngredientRequirement, SelectedPortion, ValidationResult } from '../types';

export function calculatePortionCalories(caloriesPer100g: number, portionGrams: number): number {
  return (caloriesPer100g / 100) * portionGrams;
}

export function buildPortion(food: FoodItem, portionGrams: number): SelectedPortion {
  return {
    food,
    portionGrams,
    totalCalories: calculatePortionCalories(food.caloriesPer100g, portionGrams),
  };
}

export function calculateTotalCalories(portions: SelectedPortion[]): number {
  return portions.reduce((total, item) => total + item.totalCalories, 0);
}

export function calculateTotalPlates(platesToProduce: number, surplusPercent: number): number {
  return Math.ceil(platesToProduce * (1 + surplusPercent));
}

export function buildIngredientsList(
  portions: SelectedPortion[],
  platesToProduce: number,
  surplusPercent: number,
): IngredientRequirement[] {
  const totalPlates = calculateTotalPlates(platesToProduce, surplusPercent);

  return portions.map((portion) => ({
    food: portion.food,
    portionGrams: portion.portionGrams,
    totalGrams: portion.portionGrams * totalPlates,
    totalCalories: portion.totalCalories * totalPlates,
  }));
}

export function validateCardapio(portions: SelectedPortion[]): ValidationResult {
  const messages: string[] = [];
  const selectedCategories = new Set<FoodCategory>(portions.map((portion) => portion.food.category));
  const totalCalories = calculateTotalCalories(portions);

  if (!selectedCategories.has('carboidrato')) messages.push('Selecione pelo menos um carboidrato.');
  if (!selectedCategories.has('salada')) messages.push('Selecione pelo menos uma salada.');
  if (!selectedCategories.has('proteina')) messages.push('Selecione pelo menos uma proteína.');
  if (portions.some((portion) => portion.portionGrams < MIN_PORTION_GRAMS)) messages.push('A porção mínima é de 10g.');
  if (totalCalories > CALORIE_LIMIT) messages.push('O cardápio ultrapassa o limite de 2.000 kcal.');

  return {
    isValid: messages.length === 0,
    messages,
  };
}

export function validateProduction(platesToProduce: number, surplusPercent: number): ValidationResult {
  const messages: string[] = [];

  if (platesToProduce < MIN_PLATES) messages.push('Informe pelo menos 1 prato para calcular a produção.');
  if (surplusPercent < 0 || surplusPercent > MAX_SURPLUS) messages.push('O acréscimo deve ficar entre 0% e 40%.');

  return {
    isValid: messages.length === 0,
    messages,
  };
}

export function getCalorieStatus(totalCalories: number): { label: string; tone: 'green' | 'yellow' | 'orange' | 'red' } {
  const percent = (totalCalories / CALORIE_LIMIT) * 100;

  if (percent > 100) return { label: 'Bloqueado', tone: 'red' };
  if (percent > 85) return { label: 'Próximo do limite', tone: 'orange' };
  if (percent > 60) return { label: 'Atenção', tone: 'yellow' };
  return { label: 'Saudável', tone: 'green' };
}
