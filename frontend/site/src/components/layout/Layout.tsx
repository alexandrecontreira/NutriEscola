import type { ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import heroBg from '../../assets/images/hero-bg.jpg';

type LayoutProps = {
  children: ReactNode;
};

const navItems = [
  { label: 'Início', to: '/' },
  { label: 'Cardápio', to: '/cardapio' },
  { label: 'Produção', to: '/producao' },
  { label: 'Relatório', to: '/relatorio' },
];

const pageCopy: Record<string, { eyebrow: string; title: string; subtitle: string }> = {
  '/cardapio': {
    eyebrow: 'Montagem do cardápio',
    title: 'Escolha porções por grupo alimentar.',
    subtitle: 'Selecione alimentos, ajuste as porções em gramas e acompanhe o total calórico em tempo real.',
  },
  '/producao': {
    eyebrow: 'Produção diária',
    title: 'Calcule ingredientes para a cozinha.',
    subtitle: 'Informe o número base de pratos, ajuste o acréscimo de segurança e visualize os totais por ingrediente.',
  },
  '/relatorio': {
    eyebrow: 'Relatório',
    title: 'Lista pronta para impressão.',
    subtitle: 'Confira totais por ingrediente, quantidade de pratos e resumo nutricional antes de enviar para a cozinha.',
  },
};

export function Layout({ children }: LayoutProps) {
  const { pathname } = useLocation();
  const mobileMenuOpen = useUiStore((state) => state.mobileMenuOpen);
  const setMobileMenuOpen = useUiStore((state) => state.setMobileMenuOpen);
  const isHome = pathname === '/';
  const hero = pageCopy[pathname];

  return (
    <>
      <header className={`site-hero ${isHome ? 'home' : 'internal'}`}>
        <img className="hero-bg" src={heroBg} alt="" aria-hidden="true" />
        <nav className="top-nav container" aria-label="Navegação principal">
          <Link className="brand" to="/">NutriEscola</Link>
          <button
            type="button"
            className="icon-button"
            aria-label="Abrir menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
          <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} onClick={() => setMobileMenuOpen(false)}>
                {item.label}
              </NavLink>
            ))}
          </div>
          <Link className="nav-cta" to="/cardapio">Montar hoje</Link>
        </nav>
        {isHome ? (
          <section className="home-hero container">
            <div>
              <span className="eyebrow">Sistema de Gestão de Cardápio Escolar</span>
              <h1>Cardápios escolares mais seguros e fáceis de produzir.</h1>
              <p>Monte refeições com carboidrato, salada e proteína, acompanhe o limite de 2.000 kcal e gere a lista de ingredientes para a cozinha.</p>
              <div className="actions">
                <Link className="button button-primary" to="/cardapio">Montar cardápio</Link>
                <Link className="button button-outline" to="/relatorio">Ver relatório</Link>
              </div>
            </div>
            <aside className="hero-panel" aria-label="Resumo do cardápio">
              <strong>2.000 kcal</strong>
              <span>Limite por refeição</span>
              <strong>40%</strong>
              <span>Acréscimo máximo</span>
              <strong>3 grupos</strong>
              <span>Obrigatórios</span>
            </aside>
          </section>
        ) : (
          <section className="page-hero container">
            <span className="eyebrow">{hero.eyebrow}</span>
            <h1>{hero.title}</h1>
            <p>{hero.subtitle}</p>
          </section>
        )}
      </header>
      <main id="main">{children}</main>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <Link className="brand" to="/">NutriEscola</Link>
            <p>Planejamento alimentar escolar com regras claras, cálculos automatizados e relatórios prontos para produção.</p>
          </div>
          <div>
            <h2>Uso operacional</h2>
            <p>Cardápio diário</p>
            <p>Produção com até 40% de acréscimo</p>
            <p>Relatório para impressão</p>
          </div>
          <div>
            <h2>Contato</h2>
            <p>nutricao@nutriescola.local</p>
            <p>Ambiente escolar - Brasil</p>
          </div>
        </div>
      </footer>
    </>
  );
}
