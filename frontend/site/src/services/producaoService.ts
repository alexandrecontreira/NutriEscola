import type { SelectedPortion } from '../types';
import { buildIngredientsList } from '../utils/cardapioUtils';

export function gerarListaProducao(portions: SelectedPortion[], platesToProduce: number, surplusPercent: number) {
  return buildIngredientsList(portions, platesToProduce, surplusPercent);
}
