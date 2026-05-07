import { useCardapioDerived, useCardapioStore } from '../store/cardapioStore';

export function useProducao() {
  const setPlatesToProduce = useCardapioStore((state) => state.setPlatesToProduce);
  const setSurplusPercent = useCardapioStore((state) => state.setSurplusPercent);
  const derived = useCardapioDerived();

  return { ...derived, setPlatesToProduce, setSurplusPercent };
}
