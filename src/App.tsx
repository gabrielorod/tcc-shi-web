import { Routes, Route, Navigate } from 'react-router-dom';

// Pages (vamos criar em seguida)
const Dashboard = () => <div>Dashboard</div>;
const Usuarios = () => <div>Usuários</div>;
const Recipientes = () => <div>Recipientes</div>;
const Dispositivos = () => <div>Dispositivos</div>;
const Lembretes = () => <div>Lembretes</div>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/usuarios" element={<Usuarios />} />
      <Route path="/recipientes" element={<Recipientes />} />
      <Route path="/dispositivos" element={<Dispositivos />} />
      <Route path="/lembretes" element={<Lembretes />} />
    </Routes>
  );
}

export default App;