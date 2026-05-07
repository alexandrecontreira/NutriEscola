import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Slider } from '../../components/ui/Slider';
import { ReportTable } from '../../components/relatorio/ReportTable';
import { MIN_PLATES } from '../../constants';
import { useProducao } from '../../hooks/useProducao';
import { formatPercent } from '../../utils/formatters';
import { validateProduction } from '../../utils/cardapioUtils';

export function Producao() {
  const {
    platesToProduce,
    surplusPercent,
    totalPlates,
    ingredientsList,
    setPlatesToProduce,
    setSurplusPercent,
  } = useProducao();
  const validation = validateProduction(platesToProduce, surplusPercent);

  return (
    <section className="section">
      <div className="container production-layout">
        <Card className="form-panel">
          <span className="eyebrow">Parâmetros</span>
          <h2>Pratos a produzir</h2>
          <p>O acréscimo máximo permitido é de 40% para cobrir variações de demanda.</p>
          <Input
            id="plates"
            label="Número base de pratos"
            min={MIN_PLATES}
            type="number"
            value={platesToProduce}
            onChange={(event) => setPlatesToProduce(Math.max(Number(event.target.value), MIN_PLATES))}
          />
          <Slider
            id="surplus"
            label="Acréscimo de segurança"
            max={40}
            min={0}
            value={Math.round(surplusPercent * 100)}
            valueLabel={formatPercent(surplusPercent)}
            onChange={(event) => setSurplusPercent(Number(event.target.value) / 100)}
          />
          {!validation.isValid ? <p className="error-text">{validation.messages.join(' ')}</p> : null}
          <div className="production-kpi">
            <span>Total calculado</span>
            <strong>{totalPlates} pratos</strong>
          </div>
        </Card>
        <Card className="table-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Lista de produção</span>
              <h2>Ingredientes calculados</h2>
            </div>
            <Link className="button button-primary" to="/relatorio">
              <FileText aria-hidden="true" size={18} />
              Ver relatório
            </Link>
          </div>
          <ReportTable items={ingredientsList} />
        </Card>
      </div>
    </section>
  );
}
