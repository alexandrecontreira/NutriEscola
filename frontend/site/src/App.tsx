import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Cardapio } from './pages/Cardapio';
import { Producao } from './pages/Producao';
import { Relatorio } from './pages/Relatorio';

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/cardapio" element={<Cardapio />} />
        <Route path="/producao" element={<Producao />} />
        <Route path="/relatorio" element={<Relatorio />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
