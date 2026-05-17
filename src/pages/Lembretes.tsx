import { useState, useEffect } from 'react';
import { Box, Button, Stack, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Layout } from '../components/Layout';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorAlert } from '../components/ErrorAlert';
import { EmptyState } from '../components/EmptyState';
import { LembreteCard } from '../components/lembretes/LembreteCard';
import { FormNovoLembrete } from '../components/lembretes/FormNovoLembrete';
import { lembretesService } from '../services/lembretesService';
import type { Lembrete } from '../types';
import { useUser } from '../hooks/useApi';

export function Lembretes() {
  const { usuarioId } = useUser();

  const [lembretes, setLembretes] = useState<Lembrete[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const reload = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    if (!usuarioId) return;
    let cancelled = false;

    async function carregar() {
      setLoading(true);
      setError(null);
      try {
        const res = await lembretesService.listar(usuarioId!);
        if (!cancelled) setLembretes(res.data);
      } catch {
        if (!cancelled) setError('Erro ao carregar lembretes');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void carregar();
    return () => {
      cancelled = true;
    };
  }, [usuarioId, refreshKey]);

  const handleCriar = async (intervaloMinutos: number) => {
    await lembretesService.criar(usuarioId!, intervaloMinutos);
    setShowForm(false);
    setSucesso(true);
    setTimeout(() => setSucesso(false), 3000);
    reload();
  };

  const handleToggle = async (id: string) => {
    try {
      await lembretesService.toggle(id);
      reload();
    } catch {
      setError('Erro ao atualizar lembrete');
    }
  };

  const handleRemover = async (id: string) => {
    try {
      await lembretesService.remover(id);
      reload();
    } catch {
      setError('Erro ao remover lembrete');
    }
  };

  return (
    <Layout title="Lembretes">
      {!showForm && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowForm(true)}>
            Novo lembrete
          </Button>
        </Box>
      )}

      {showForm && (
        <Box sx={{ mb: 2 }}>
          <FormNovoLembrete onSalvar={handleCriar} onCancelar={() => setShowForm(false)} />
        </Box>
      )}

      {sucesso && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Lembrete criado com sucesso!
        </Alert>
      )}

      {error && <ErrorAlert message={error} />}

      {loading && <LoadingSpinner message="Carregando lembretes..." />}

      {!loading && !showForm && lembretes.length === 0 && (
        <EmptyState
          icon={<NotificationsIcon sx={{ fontSize: 64 }} />}
          title="Nenhum lembrete"
          description="Crie lembretes para ser notificado quando esquecer de se hidratar"
          action={
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowForm(true)}>
              Criar primeiro lembrete
            </Button>
          }
        />
      )}

      {!loading && lembretes.length > 0 && (
        <Stack spacing={1.5}>
          {lembretes.map((l) => (
            <LembreteCard
              key={l.id}
              lembrete={l}
              onToggle={(id) => void handleToggle(id)}
              onRemover={(id) => void handleRemover(id)}
            />
          ))}
        </Stack>
      )}
    </Layout>
  );
}
