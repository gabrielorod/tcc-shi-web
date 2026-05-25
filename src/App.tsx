import { Routes, Route, Navigate } from 'react-router-dom';
import { SelecionarUsuario } from './pages/SelecionarUsuario';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Dashboard } from './pages/Dashboard';
import { Perfil } from './pages/Perfil';
import { Recipientes } from './pages/Recipientes';
import { Dispositivos } from './pages/Dispositivos';
import { useUser } from './hooks/useApi';

function App() {
  const { usuarioId, loading } = useUser();

  if (loading) return <LoadingSpinner message="Carregando..." />;
  if (!usuarioId) return <SelecionarUsuario />;

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/recipientes" element={<Recipientes />} />
      <Route path="/dispositivos" element={<Dispositivos />} />
      <Route path="/perfil" element={<Perfil />} />
    </Routes>
  );
}

export default App;
