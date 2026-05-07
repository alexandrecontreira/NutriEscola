import type { FoodItem } from '../types';
import arrozBrancoImage from '../assets/images/arroz-branco.png';
import arrozIntegralImage from '../assets/images/arroz-integral.png';
import macarraoImage from '../assets/images/macarrao.png';
import batataCozidaImage from '../assets/images/batata-cozida.png';
import saladaMixImage from '../assets/images/salada-mix.png';
import cenouraRaladaImage from '../assets/images/cenoura-ralada.png';
import frangoGrelhadoImage from '../assets/images/frango-grelhado.png';
import carneBovinaImage from '../assets/images/carne-bovina.png';
import ovoCozidoImage from '../assets/images/ovo-cozido.png';
import feijaoImage from '../assets/images/feijao.png';

export const alimentos: FoodItem[] = [
  { id: 'arroz-branco', name: 'Arroz branco', category: 'carboidrato', categoryLabel: 'Carboidrato', caloriesPer100g: 128, defaultPortionGrams: 110, unit: 'g', image: arrozBrancoImage },
  { id: 'arroz-integral', name: 'Arroz integral', category: 'carboidrato', categoryLabel: 'Carboidrato', caloriesPer100g: 123, defaultPortionGrams: 120, unit: 'g', image: arrozIntegralImage },
  { id: 'macarrao', name: 'Macarrão', category: 'carboidrato', categoryLabel: 'Carboidrato', caloriesPer100g: 131, defaultPortionGrams: 100, unit: 'g', image: macarraoImage },
  { id: 'batata-cozida', name: 'Batata cozida', category: 'carboidrato', categoryLabel: 'Carboidrato', caloriesPer100g: 86, defaultPortionGrams: 100, unit: 'g', image: batataCozidaImage },
  { id: 'salada-mix', name: 'Salada mix', category: 'salada', categoryLabel: 'Salada', caloriesPer100g: 25, defaultPortionGrams: 80, unit: 'g', image: saladaMixImage },
  { id: 'cenoura-ralada', name: 'Cenoura ralada', category: 'salada', categoryLabel: 'Salada', caloriesPer100g: 41, defaultPortionGrams: 60, unit: 'g', image: cenouraRaladaImage },
  { id: 'frango-grelhado', name: 'Frango grelhado', category: 'proteina', categoryLabel: 'Proteína', caloriesPer100g: 165, defaultPortionGrams: 110, unit: 'g', image: frangoGrelhadoImage },
  { id: 'carne-bovina', name: 'Carne bovina', category: 'proteina', categoryLabel: 'Proteína', caloriesPer100g: 250, defaultPortionGrams: 90, unit: 'g', image: carneBovinaImage },
  { id: 'ovo-cozido', name: 'Ovo cozido', category: 'proteina', categoryLabel: 'Proteína', caloriesPer100g: 155, defaultPortionGrams: 60, unit: 'g', image: ovoCozidoImage },
  { id: 'feijao-carioca', name: 'Feijão carioca', category: 'proteina', categoryLabel: 'Proteína', caloriesPer100g: 76, defaultPortionGrams: 90, unit: 'g', image: feijaoImage },
];
