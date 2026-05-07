# Regras de Frontend React - NutriEscola

> **Projeto:** NutriEscola - Sistema de Gestao de Cardapio Escolar  
> **Stack:** React 18 + Vite + TypeScript + Tailwind CSS + Zustand  
> **Idioma da interface:** pt-BR  
> **Objetivo:** manter a interface consistente, responsiva, acessivel e fiel as regras de negocio do projeto.

---

## 1. Principios Gerais

- Construir uma SPA responsiva, clara e objetiva para nutricionistas e gestores escolares.
- Priorizar fluxos simples: montar cardapio, configurar producao e gerar relatorio.
- Manter regras de negocio fora dos componentes visuais sempre que possivel.
- Usar TypeScript de forma estrita, sem `any`.
- Exibir mensagens, labels, alertas e validacoes sempre em portugues do Brasil.
- Evitar dependencias novas sem necessidade real.

---

## 2. Organizacao de Pastas

Seguir a estrutura definida no documento de contexto:

```txt
src/
  components/
    layout/
    ui/
    cardapio/
    relatorio/
  pages/
    Dashboard/
    Cardapio/
    Producao/
    Relatorio/
  hooks/
  services/
  store/
  types/
  utils/
  constants/
  data/
```

Regras:

- Componentes reutilizaveis ficam em `components/ui`.
- Componentes especificos de dominio ficam em `components/cardapio` ou `components/relatorio`.
- Paginas devem apenas compor componentes e conectar dados principais.
- Calculos e validacoes ficam em `utils`, `hooks` ou `store`, nao espalhados no JSX.
- Constantes como `CALORIE_LIMIT` e `MAX_SURPLUS` devem ficar em `constants`.

---

## 3. Componentes React

- Criar componentes funcionais com TypeScript.
- Nomear componentes em PascalCase: `FoodCard`, `CalorieBar`, `ReportTable`.
- Nomear arquivos de componentes tambem em PascalCase quando houver um componente principal.
- Manter componentes preferencialmente abaixo de 150 linhas.
- Extrair subcomponentes quando o JSX ficar dificil de ler.
- Evitar componentes genericos demais antes de existir repeticao real.
- Nao misturar logica de calculo nutricional diretamente na camada visual.

Exemplo recomendado:

```tsx
type FoodCardProps = {
  name: string;
  caloriesPer100g: number;
  selected: boolean;
  onSelect: () => void;
};

export function FoodCard({
  name,
  caloriesPer100g,
  selected,
  onSelect,
}: FoodCardProps) {
  return (
    <button type="button" onClick={onSelect} aria-pressed={selected}>
      <strong>{name}</strong>
      <span>{caloriesPer100g} kcal/100g</span>
    </button>
  );
}
```

---

## 4. TypeScript

- Nao usar `any`.
- Centralizar tipos de dominio em `src/types`.
- Usar unions para valores fechados, como categorias de alimentos.
- Tipar props explicitamente.
- Tipar retornos de hooks quando isso melhorar a leitura.
- Preferir nomes claros: `FoodItem`, `SelectedPortion`, `Cardapio`, `ProducaoConfig`.

Tipos base:

```ts
type FoodCategory = 'carboidrato' | 'salada' | 'proteina';

type ValidationResult = {
  isValid: boolean;
  message?: string;
};
```

---

## 5. Estado e Dados

- Usar Zustand para estado global compartilhado entre paginas.
- Usar `useState` para estado local simples e temporario.
- Nao duplicar dados derivados no estado quando puderem ser calculados.
- Dados mock devem ficar em `src/data`.
- Services devem isolar acesso aos dados, mesmo quando forem mocks locais.

Exemplos de estado global:

- Cardapio ativo.
- Configuracao de producao.
- Notificacoes e estado visual global.

Exemplos de estado local:

- Campo em edicao.
- Modal aberto ou fechado.
- Aba selecionada dentro de uma pagina.

---

## 6. Regras de Negocio no Frontend

As regras abaixo devem ser refletidas na interface e nas validacoes:

- O cardapio deve ter pelo menos 1 carboidrato.
- O cardapio deve ter pelo menos 1 salada.
- O cardapio deve ter pelo menos 1 proteina.
- O total calorico nao pode ultrapassar 2.000 kcal por refeicao.
- A porcao minima por item e de 10g.
- O numero base de pratos deve ser maior ou igual a 1.
- O acrescimo de seguranca deve ficar entre 0% e 40%.

Comportamento esperado:

- Bloquear o botao de salvar quando o cardapio estiver invalido.
- Mostrar feedback visual em tempo real.
- Impedir a adicao de itens que ultrapassem o limite calorico, quando aplicavel.
- Exibir mensagens amigaveis e acionaveis.

---

## 7. Calculos

Calculos devem ficar em `utils` ou hooks dedicados, nunca soltos dentro do JSX.

Formulas oficiais:

```ts
const portionCalories = (caloriesPer100g / 100) * portionGrams;
const totalCalories = portions.reduce((total, item) => total + item.totalCalories, 0);
const totalPlates = platesToProduce * (1 + surplusPercent);
const totalIngredient = portionGrams * totalPlates;
```

Regras:

- Usar constantes para limites numericos.
- Padronizar arredondamentos em helpers.
- Formatar gramas, porcentagens e calorias com funcoes em `formatters.ts`.

---

## 8. Tailwind CSS e Layout

- Usar Tailwind CSS como ferramenta principal de estilizacao.
- Priorizar layouts densos, organizados e faceis de escanear.
- Evitar visual de landing page; a primeira tela deve ser util para operacao.
- Usar `md:` e `lg:` desde a primeira versao para preparar responsividade.
- Nao criar cards dentro de cards.
- Usar `gap`, `space`, `grid` e `flex` de forma consistente.
- Garantir que textos nao estourem botoes, tabelas ou cards.

Padroes recomendados:

- Dashboard: grade de resumos e historico.
- Cardapio desktop: 3 colunas para carboidratos, saladas e proteinas.
- Cardapio mobile: secoes empilhadas com navegacao simples.
- Producao: formulario compacto + tabela de ingredientes.
- Relatorio: tabela limpa, preparada para impressao.

---

## 9. Componentes de UI

Componentes base esperados:

- `Button`
- `Input`
- `Select`
- `Card`
- `Badge`
- `Modal`
- `Table`
- `Slider`
- `CalorieBar`

Regras:

- Botoes devem ter estado `disabled`, `hover`, `focus-visible` e `loading` quando necessario.
- Inputs numericos devem validar limites minimos e maximos.
- Sliders devem mostrar valor atual de forma clara.
- Badges devem indicar categoria, status ou faixa calorica.
- Tabelas devem ser legiveis em desktop e adaptaveis no mobile.

---

## 10. Icones

- Usar `lucide-react` para icones.
- Icones devem apoiar a acao, nao substituir labels importantes sem contexto.
- Botoes apenas com icone precisam de `aria-label`.
- Manter tamanho e espessura consistentes entre icones.

---

## 11. Acessibilidade

- Usar HTML semantico sempre que possivel.
- Botoes clicaveis devem ser `<button>`, nao `<div>`.
- Inputs devem ter `label` associado.
- Mensagens de erro devem ser conectadas ao campo quando possivel.
- Estados de foco devem ser visiveis.
- Cores nao podem ser o unico meio de comunicar erro ou sucesso.
- Tabelas de relatorio devem usar `thead`, `tbody`, `th` e `td` corretamente.

---

## 12. Feedback Visual

Aplicar o semaforo calorico:

| Faixa | Estado | Uso visual |
|---|---|---|
| 0% a 60% | Saudavel | Verde |
| 61% a 85% | Atencao | Amarelo |
| 86% a 100% | Proximo do limite | Laranja |
| Acima de 100% | Bloqueado | Vermelho |

Regras:

- A barra calorica deve atualizar em tempo real.
- Estados bloqueados devem explicar o motivo.
- Alertas devem ser objetivos e recuperaveis.

---

## 13. Impressao e Relatorios

- Usar `window.print()` para acionar impressao.
- Criar regras em `@media print`.
- Ocultar navegacao, botoes e controles interativos na impressao.
- Manter no relatorio: data, cardapio, totais por ingrediente, totais por categoria e total geral.
- Garantir contraste adequado em papel.

---

## 14. Responsividade e PWA

- Projetar primeiro para desktop operacional, preparando breakpoints para mobile.
- Testar larguras entre 375px e 430px na fase mobile.
- Evitar tabelas impossiveis de usar no celular; considerar cards ou linhas expansivas.
- Para PWA, manter dados mock/local storage compativeis com uso offline na fase prevista.

---

## 15. Qualidade de Codigo

Checklist antes de concluir uma fase:

```txt
[ ] Sem uso de any
[ ] Sem console.log em producao
[ ] Componentes principais com tamanho controlado
[ ] Calculos fora do JSX
[ ] Constantes centralizadas
[ ] Validacoes em pt-BR
[ ] Estados disabled e loading quando necessarios
[ ] Layout responsivo em md: e lg:
[ ] Barra calorica seguindo o semaforo
[ ] Impressao testada quando houver relatorio
```

---

## 16. Padrao de Mensagens

Mensagens devem ser curtas, claras e educadas.

Exemplos:

- `Selecione pelo menos um carboidrato.`
- `A porcao minima e de 10g.`
- `O cardapio ultrapassa o limite de 2.000 kcal.`
- `O acrescimo deve ficar entre 0% e 40%.`
- `Informe pelo menos 1 prato para calcular a producao.`

---

## 17. O Que Evitar

- Criar regra de negocio diretamente no JSX.
- Duplicar formulas em varios componentes.
- Usar `any` para acelerar implementacao.
- Criar componentes muito grandes.
- Usar textos em ingles na interface.
- Adicionar bibliotecas sem necessidade.
- Fazer layout promocional quando a tela precisa ser operacional.
- Deixar botoes ativos quando a acao ainda e invalida.

---

Este arquivo deve ser usado como referencia para qualquer implementacao React do NutriEscola e atualizado sempre que a arquitetura ou os padroes de interface mudarem.
