import { Printer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ReportTable } from '../../components/relatorio/ReportTable';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useCardapioDerived } from '../../hooks/useCardapio';
import { formatCalories, formatPercent } from '../../utils/formatters';

export function Relatorio() {
  const { ingredientsList, totalPlates, surplusPercent, totalCalories, validation } = useCardapioDerived();
  const summary = [
    { value: totalPlates.toString(), label: 'Pratos totais' },
    { value: formatPercent(surplusPercent), label: 'Acréscimo aplicado' },
    { value: formatCalories(totalCalories), label: 'kcal por refeição' },
    { value: validation.isValid ? 'Válido' : 'Pendente', label: 'Status do cardápio' },
  ];

  return (
    <section className="section">
      <div className="container">
        <Card className="report-card">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Cardápio ativo</span>
              <h2>Produção de hoje</h2>
              <p>Referência gerada com acréscimo de segurança e porções configuradas no cardápio.</p>
            </div>
            <div className="print-actions">
              <Button onClick={() => window.print()}>
                <Printer aria-hidden="true" size={18} />
                Imprimir relatório
              </Button>
              <Link className="button button-outline dark" to="/cardapio">Editar cardápio</Link>
            </div>
          </div>
          <div className="summary-grid compact">
            {summary.map((item) => (
              <div key={item.label} className="summary-card flat">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <ReportTable items={ingredientsList} />
          <p className="note">
            <strong>Observações:</strong> {validation.isValid ? 'Cardápio dentro do limite calórico e com os três grupos alimentares obrigatórios selecionados.' : validation.messages.join(' ')}
          </p>
        </Card>
      </div>
    </section>
  );
}
