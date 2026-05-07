import { create } from 'zustand';
import { alimentos } from '../data/alimentos';
import type { FoodItem, SelectedPortion } from '../types';
import { buildIngredientsList, buildPortion, calculateTotalCalories, calculateTotalPlates, validateCardapio } from '../utils/cardapioUtils';

type CardapioState = {
  selectedPortions: SelectedPortion[];
  platesToProduce: number;
  surplusPercent: number;
  toggleFood: (food: FoodItem) => void;
  updatePortion: (foodId: string, portionGrams: number) => void;
  setPlatesToProduce: (value: number) => void;
  setSurplusPercent: (value: number) => void;
};

const initialFoods = ['arroz-integral', 'salada-colorida', 'frango-grelhado'];

export const useCardapioStore = create<CardapioState>((set) => ({
  selectedPortions: alimentos
    .filter((food) => initialFoods.includes(food.id))
    .map((food) => buildPortion(food, food.defaultPortionGrams)),
  platesToProduce: 180,
  surplusPercent: 0.2,
  toggleFood: (food) =>
    set((state) => {
      const exists = state.selectedPortions.some((portion) => portion.food.id === food.id);
      return {
        selectedPortions: exists
          ? state.selectedPortions.filter((portion) => portion.food.id !== food.id)
          : [...state.selectedPortions, buildPortion(food, food.defaultPortionGrams)],
      };
    }),
  updatePortion: (foodId, portionGrams) =>
    set((state) => ({
      selectedPortions: state.selectedPortions.map((portion) =>
        portion.food.id === foodId ? buildPortion(portion.food, portionGrams) : portion,
      ),
    })),
  setPlatesToProduce: (value) => set({ platesToProduce: value }),
  setSurplusPercent: (value) => set({ surplusPercent: value }),
}));

export function useCardapioDerived() {
  const selectedPortions = useCardapioStore((state) => state.selectedPortions);
  const platesToProduce = useCardapioStore((state) => state.platesToProduce);
  const surplusPercent = useCardapioStore((state) => state.surplusPercent);
  const totalCalories = calculateTotalCalories(selectedPortions);
  const validation = validateCardapio(selectedPortions);
  const totalPlates = calculateTotalPlates(platesToProduce, surplusPercent);
  const ingredientsList = buildIngredientsList(selectedPortions, platesToProduce, surplusPercent);

  return { selectedPortions, totalCalories, validation, platesToProduce, surplusPercent, totalPlates, ingredientsList };
}
