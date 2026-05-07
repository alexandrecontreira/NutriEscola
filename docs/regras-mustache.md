# Regras Mustache - Site Template

> **Base analisada:** `fontend/sitetemplate/src`  
> **Objetivo:** documentar os padroes Mustache presentes no template para manter novas paginas, partials e dados consistentes.

---

## 1. Estrutura Geral

O template separa paginas, partials, dados e assets:

```txt
fontend/sitetemplate/src/
  *.mustache
  data/
  partials/
    public/common/
    pages/
  assets/
    css/
    js/
    images/
```

Regras:

- Paginas completas ficam na raiz de `src`, como `index.mustache`, `about.mustache`, `services.mustache`.
- Blocos reutilizaveis ficam em `partials`.
- Partials globais de estrutura ficam em `partials/public/common`.
- Conteudos completos de paginas internas ficam em `partials/pages`.
- Dados ficam em JSON dentro de `data`, com um arquivo por pagina ou contexto.

---

## 2. Paginas da Raiz

As paginas da raiz seguem o mesmo esqueleto:

- `<!DOCTYPE html>`
- `<html lang="pt-BR" class="scroll-smooth">`
- `<head>` com SEO, Open Graph, fontes, Tailwind CDN, CSS customizado e Lucide.
- `<body class="font-sans text-slate-800 bg-white antialiased">`
- `topbar`
- `header`
- `<main id="main">`
- conteudo da pagina
- `footer`
- `assets/js/main.js`

Exemplo de inclusao comum:

```mustache
{{> partials/public/common/topbar}}
{{> partials/public/common/header}}

<main id="main">
  {{> partials/pages/services_full}}
</main>

{{> partials/public/common/footer}}
```

Regras:

- Manter `topbar`, `header` e `footer` iguais entre paginas.
- Manter o conteudo principal dentro de `<main id="main">`.
- Usar page hero padrao em paginas internas.
- Usar breadcrumbs quando a pagina nao for a home.

---

## 3. Partials

Os partials sao chamados com `{{> nome_do_partial}}`.

Padroes encontrados:

```mustache
{{> hero}}
{{> about}}
{{> services}}
{{> portfolio}}
{{> products}}
{{> pricing}}
{{> contact}}
{{> partials/pages/about_full}}
```

Regras:

- Cada partial deve representar uma secao ou bloco visual coeso.
- O partial deve receber dados pelo contexto atual, sem importar dados diretamente.
- No topo do partial, manter comentario com nome da secao e chaves de dados esperadas.
- Nomes de partials devem ser em minusculo e, quando necessario, separados por `_`.

Exemplo de comentario usado no template:

```mustache
<!-- ============================================================
   SERVICES
   Data keys: services.eyebrow, services.title, services.items[]
   ============================================================ -->
```

---

## 4. Dados JSON

Os arquivos em `data` fornecem o contexto usado pelos templates.

Padroes de dados:

- `site`: dados globais da marca.
- `config`: flags para exibir ou ocultar secoes.
- `nav`: navegacao principal e CTA.
- `page`: dados de paginas internas, hero e breadcrumb.
- `footer`: links e informacoes finais.
- Objetos por secao: `hero`, `about`, `services`, `portfolio`, `products`, `pricing`, `contact`.
- Objetos de detalhes: `service`, `product`, `portfolio_item`.

Regras:

- Usar nomes em `snake_case` nos JSONs, como `company_name`, `show_products`, `cta_primary`.
- Listas devem ficar em arrays nomeados como `items`, `features`, `tags`, `plans`.
- Valores booleanos devem controlar estado visual ou exibicao.
- Classes dinamicas podem vir dos dados quando forem parte do conteudo, como `status_class` ou `category_class`.

---

## 5. Variaveis Mustache

Usar interpolacao comum para texto e atributos:

```mustache
{{site.company_name}}
{{site.description}}
{{nav.cta.label}}
{{page.hero.subtitle}}
```

Regras:

- Usar caminhos com ponto para acessar objetos aninhados.
- Usar `{{variavel}}` para conteudo seguro e escapado.
- Usar `{{.}}` dentro de arrays simples de strings.
- Evitar criar texto fixo quando ele pertence ao JSON.

Exemplo:

```mustache
{{#tags}}
  <span>{{.}}</span>
{{/tags}}
```

---

## 6. HTML Nao Escapado

O template usa triple mustache para titulos de pagina:

```mustache
{{{page.hero.title}}}
```

Regras:

- Usar `{{{...}}}` somente quando o conteudo realmente precisar conter HTML.
- Nunca usar triple mustache com texto vindo de fonte externa ou nao confiavel.
- Preferir `{{...}}` por padrao.

---

## 7. Loops

Listas sao renderizadas com secoes Mustache:

```mustache
{{#services.items}}
  <article>
    <h3>{{title}}</h3>
    <p>{{description}}</p>
  </article>
{{/services.items}}
```

Padroes comuns:

- Cards de servicos: `services.items`
- Slides do hero: `hero.slides`
- Navegacao: `nav.items`
- Links do footer: `footer.quick_links`
- Tags: `tags`
- Planos: `pricing.tab_groups[].plans`

Regras:

- O HTML do item deve ficar inteiro dentro do loop.
- Para listas de strings, usar `{{.}}`.
- Para listas de objetos, usar propriedades nomeadas.
- Evitar duplicar loops com a mesma estrutura; criar partial se houver repeticao real.

---

## 8. Condicionais

Flags booleanas sao usadas com secoes:

```mustache
{{#config.show_portfolio}}
  {{> portfolio}}
{{/config.show_portfolio}}
```

Condicionais invertidas aparecem para estados alternativos:

```mustache
{{#active}}bg-green-600 text-white{{/active}}
{{^active}}bg-slate-100 text-slate-600{{/active}}
```

Regras:

- Usar `{{#flag}}` para renderizar quando verdadeiro.
- Usar `{{^flag}}` para renderizar quando falso ou vazio.
- Para estados visuais opostos, manter os dois blocos proximos.
- Flags de exibicao global devem ficar em `config`.
- Flags de item devem ficar no proprio item, como `active`, `featured`, `is_highlight`, `is_available`.

---

## 9. Classes Condicionais

O template usa Mustache dentro de `class` para estados:

```mustache
class="pricing-tab {{#active}}bg-white text-slate-900{{/active}}{{^active}}text-slate-500{{/active}}"
```

Regras:

- Usar classes condicionais apenas para estados simples.
- Manter a classe base fora da condicional.
- Evitar condicoes longas demais dentro de `class`.
- Quando uma classe vier do JSON, nomear o campo claramente: `status_class`, `category_class`.

---

## 10. Page Hero e Breadcrumb

Paginas internas usam um hero escuro com breadcrumb:

```mustache
<nav aria-label="Breadcrumb">
  <a href="{{page.breadcrumb.home.url}}">
    {{page.breadcrumb.home.label}}
  </a>
  <span>{{page.breadcrumb.current}}</span>
</nav>

<h1>{{{page.hero.title}}}</h1>
<p>{{page.hero.subtitle}}</p>
```

Regras:

- Toda pagina interna deve ter `page.breadcrumb`.
- Paginas de detalhe devem incluir nivel intermediario, como `services`, `products` ou `parent`.
- `page.hero.eyebrow`, `page.hero.title` e `page.hero.subtitle` devem existir no JSON da pagina.

---

## 11. Icones Lucide

Icones sao declarados com `data-lucide`:

```mustache
<i data-lucide="{{icon}}" class="w-6 h-6 text-green-600"></i>
<i data-lucide="arrow-right" class="w-4 h-4"></i>
```

Regras:

- Usar Lucide para todos os icones.
- Quando o icone variar por item, usar campo `icon` no JSON.
- Quando o icone representar acao fixa, declarar diretamente.
- Botoes somente com icone devem ter `aria-label`.

---

## 12. Interatividade

Interacoes simples sao feitas por `assets/js/main.js` ou scripts pequenos no partial.

Padroes encontrados:

- Slider do hero com `.hero-slide`, `.hero-dot`, `data-slide-id` e `data-target`.
- Abas de precos com `.pricing-tab`, `.pricing-tab-content` e `data-target`.
- Filtros de categorias com `data-filter` e `data-category`.
- Menu mobile com `#mobile-menu-btn`, `#mobile-menu`, `#icon-menu`, `#icon-close`.

Regras:

- Preferir atributos `data-*` para conectar HTML e JS.
- Classes usadas pelo JS devem ser estaveis.
- Nao usar seletores baseados em texto visivel.
- Scripts inline so devem ser usados para comportamento muito local da pagina.
- Comportamentos globais devem ficar em `assets/js/main.js`.

---

## 13. Imagens

Padroes encontrados:

- `src` e `alt` vindos do JSON.
- `loading="lazy"` em imagens fora do topo.
- `loading="eager"` em logos do header.
- Fallbacks com `onerror` em cards e fotos.

Exemplo:

```mustache
<img src="{{image}}"
     alt="{{title}}"
     loading="lazy" />
```

Regras:

- Toda imagem deve ter `alt`.
- Usar dados do item como `alt`, por exemplo `{{title}}`, `{{name}}` ou `{{site.company_name}}`.
- Usar `loading="lazy"` para imagens abaixo da primeira dobra.
- Evitar fallback complexo inline quando puder ser tratado por CSS ou JS compartilhado.

---

## 14. Estilo Visual

O template usa Tailwind por CDN e CSS customizado.

Padroes visuais:

- Paleta escura com `#0a0a0a`.
- Destaques em verde, principalmente `green-600`, `green-500`, `green-400`.
- Texto neutro com `slate-*`.
- Fontes `Inter` e `JetBrains Mono`.
- Containers com `container mx-auto px-4 md:px-8 lg:px-12`.
- Secoes com espacamento `py-16`, `py-20`, `lg:py-28`.
- Cards com bordas, sombra em hover e transicoes.

Regras:

- Manter a identidade visual escura/verde/slate do template.
- Usar `font-mono` para eyebrows, tags, badges e detalhes tecnicos.
- Usar `rounded-lg`, `rounded-xl` ou `rounded-2xl` conforme o padrao da secao.
- Manter efeitos `hover`, `transition-*` e `group-hover` consistentes.
- Evitar estilos inline, exceto decoracoes especificas ja existentes.

---

## 15. Acessibilidade

Padroes encontrados:

- `lang="pt-BR"`.
- `aria-label` em breadcrumbs, sociais, menu mobile e controles.
- `aria-expanded` no botao de menu mobile.
- `role="tab"` e `role="tabpanel"` em tabs.
- `aria-selected` em tabs e dots.

Regras:

- Manter labels acessiveis em botoes de icone.
- Manter breadcrumbs com `aria-label="Breadcrumb"`.
- Usar elementos semanticos: `header`, `nav`, `main`, `section`, `article`, `footer`.
- Links externos devem usar `target="_blank"` com `rel="noopener noreferrer"`.

---

## 16. SEO e Head

Paginas completas definem metadados no `<head>`:

```mustache
<meta name="description" content="{{site.description}}" />
<meta property="og:title" content="{{site.company_name}} - {{site.tagline}}" />
<title>{{site.company_name}} - {{site.tagline}}</title>
```

Regras:

- Toda pagina deve ter `title` e `meta description`.
- Paginas de detalhe devem usar dados do item no SEO.
- Incluir Open Graph basico: `og:title`, `og:description`, `og:type`.
- Incluir `og:image` quando houver imagem principal.

---

## 17. Nomenclatura

Regras:

- Arquivos Mustache: minusculo com hifen quando forem paginas, como `service-detail.mustache`.
- Partials de conteudo completo: sufixo `_full`, como `services_full.mustache`.
- JSONs de dados: mesmo nome da pagina quando possivel, como `services.json`.
- Chaves JSON: `snake_case`.
- IDs HTML: kebab-case, como `mobile-menu`.
- Classes JS: kebab-case ou prefixadas pelo componente, como `hero-slide`, `pricing-tab`.

---

## 18. Checklist Para Novas Secoes

```txt
[ ] Criar dados no JSON correto
[ ] Criar partial em partials/ ou partials/pages/
[ ] Documentar as Data keys no comentario inicial do partial
[ ] Usar {{variavel}} para texto seguro
[ ] Usar loops {{#items}} quando houver listas
[ ] Usar {{#flag}} e {{^flag}} para estados booleanos
[ ] Manter classes base fora das condicionais
[ ] Usar data-lucide para icones
[ ] Adicionar aria-label quando houver botao/link so com icone
[ ] Testar mobile com classes md: e lg:
[ ] Evitar logica complexa no template
```

---

## 19. O Que Evitar

- Colocar regra de negocio complexa dentro do Mustache.
- Repetir grandes blocos HTML quando um partial resolver.
- Usar `{{{...}}}` sem necessidade.
- Misturar nomes em camelCase e snake_case nos JSONs.
- Criar classes JS dependentes de texto visivel.
- Quebrar a estrutura comum `topbar + header + main + footer`.
- Adicionar scripts inline grandes em partials.
- Deixar imagens sem `alt`.

---

Este documento deve ser atualizado sempre que novos padroes Mustache forem adicionados ao template.
