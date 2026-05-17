import { useEffect, useRef } from 'react';
import { Box, Grid, Typography, IconButton, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import TodayIcon from '@mui/icons-material/Today';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Layout } from '../components/Layout';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorAlert } from '../components/ErrorAlert';
import { MetaProgressoCard } from '../components/dashboard/MetaProgressoCard';
import { ResumoCard } from '../components/dashboard/ResumoCard';
import { UltimosGoles } from '../components/dashboard/UltimosGoles';
import { useDashboard } from '../hooks/useDashboard';
import { useHidratacaoSocket } from '../hooks/useHidratacaoSocket';
import { useUser } from '../hooks/useApi';

export function Dashboard() {
  const { usuarioId, usuario } = useUser();
  const { dashboard, loading, error, fetch } = useDashboard(usuarioId!);
  const fetchRef = useRef(fetch);

  useEffect(() => {
    fetchRef.current = fetch;
  }, [fetch]);

  useEffect(() => {
    void fetchRef.current();
  }, []);

  // Atualiza o dashboard em tempo real quando um gole é registrado via WebSocket
  useHidratacaoSocket(() => {
    void fetchRef.current();
  });

  return (
    <Layout title="Dashboard">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Olá, {usuario?.nome?.split(' ')[0]} 👋
        </Typography>
        <Tooltip title="Atualizar">
          <IconButton onClick={() => void fetch()} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {loading && <LoadingSpinner message="Carregando dashboard..." />}
      {error && <ErrorAlert message={error} />}

      {dashboard && !loading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Card principal de progresso */}
          <MetaProgressoCard
            totalMl={dashboard.diario.totalMl}
            metaMl={dashboard.meta}
            percentual={dashboard.percentualDiario}
          />

          {/* Resumo semanal e mensal */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <ResumoCard
                titulo="Esta semana"
                totalMl={dashboard.semanal.totalMl}
                quantidadeLogs={dashboard.semanal.quantidadeLogs}
                icon={<DateRangeIcon />}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <ResumoCard
                titulo="Este mês"
                totalMl={dashboard.mensal.totalMl}
                quantidadeLogs={dashboard.mensal.quantidadeLogs}
                icon={<CalendarMonthIcon />}
              />
            </Grid>
          </Grid>

          {/* Resumo de hoje */}
          <ResumoCard
            titulo="Hoje"
            totalMl={dashboard.diario.totalMl}
            quantidadeLogs={dashboard.diario.quantidadeLogs}
            icon={<TodayIcon />}
          />

          {/* Últimos goles */}
          <UltimosGoles logs={dashboard.diario.logs} />
        </Box>
      )}
    </Layout>
  );
}
