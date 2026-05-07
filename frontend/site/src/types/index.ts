export type FoodCategory = 'carboidrato' | 'salada' | 'proteina';

export type FoodItem = {
  id: string;
  name: string;
  category: FoodCategory;
  categoryLabel: string;
  caloriesPer100g: number;
  defaultPortionGrams: number;
  unit: 'g' | 'ml' | 'unidade';
  image: string;
};

export type SelectedPortion = {
  food: FoodItem;
  portionGrams: number;
  totalCalories: number;
};

export type Cardapio = {
  id: string;
  date: string;
  portions: SelectedPortion[];
  totalCalories: number;
  isValid: boolean;
};

export type IngredientRequirement = {
  food: FoodItem;
  portionGrams: number;
  totalGrams: number;
  totalCalories: number;
};

export type ProducaoConfig = {
  platesToProduce: number;
  surplusPercent: number;
  totalPlates: number;
  ingredientsList: IngredientRequirement[];
};

export type ValidationResult = {
  isValid: boolean;
  messages: string[];
};
