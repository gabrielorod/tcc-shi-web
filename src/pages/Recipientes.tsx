import { useState, useEffect } from 'react';
import { Box, Button, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import { Layout } from '../components/Layout';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorAlert } from '../components/ErrorAlert';
import { EmptyState } from '../components/EmptyState';
import { RecipienteCard } from '../components/recipientes/RecipienteCard';
import { FormNovoRecipiente } from '../components/recipientes/FormNovoRecipiente';
import { DialogCalibrar } from '../components/recipientes/DialogCalibrar';
import { recipientesService } from '../services/recipientesService';
import type { Recipiente } from '../types';
import { useUser } from '../hooks/useUser';

export function Recipientes() {
  const { usuarioId } = useUser();

  const [recipientes, setRecipientes] = useState<Recipiente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [recipienteParaCalibrar, setRecipienteParaCalibrar] = useState<Recipiente | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const reload = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    if (!usuarioId) return;
    let cancelled = false;

    async function carregar() {
      setLoading(true);
      setError(null);
      try {
        const res = await recipientesService.listar(usuarioId!);
        if (!cancelled) setRecipientes(res.data);
      } catch {
        if (!cancelled) setError('Erro ao carregar recipientes');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void carregar();
    return () => {
      cancelled = true;
    };
  }, [usuarioId, refreshKey]);

  const handleCriar = async (data: { nome: string; tipo: string }) => {
    await recipientesService.criar({ ...data, usuarioId: usuarioId! });
    setShowForm(false);
    reload();
  };

  const [dispositivoId] = useState<string | null>(localStorage.getItem('dispositivoId'));

  const handleRemover = async (id: string) => {
    try {
      await recipientesService.remover(id);
      reload();
    } catch {
      setError('Erro ao remover recipiente');
    }
  };

  return (
    <Layout title="Recipientes">
      {!showForm && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowForm(true)}>
            Novo recipiente
          </Button>
        </Box>
      )}

      {showForm && (
        <Box sx={{ mb: 2 }}>
          <FormNovoRecipiente onSalvar={handleCriar} onCancelar={() => setShowForm(false)} />
        </Box>
      )}

      {error && <ErrorAlert message={error} />}

      {loading && <LoadingSpinner message="Carregando recipientes..." />}

      {!loading && !showForm && recipientes.length === 0 && (
        <EmptyState
          icon={<LocalDrinkIcon sx={{ fontSize: 64 }} />}
          title="Nenhum recipiente"
          description="Cadastre seu copo, garrafa ou caneca para começar a monitorar sua hidratação"
          action={
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowForm(true)}>
              Criar primeiro recipiente
            </Button>
          }
        />
      )}

      {!loading && recipientes.length > 0 && (
        <Stack spacing={1.5}>
          {recipientes.map((r) => (
            <RecipienteCard
              key={r.id}
              recipiente={r}
              onCalibrar={setRecipienteParaCalibrar}
              onRemover={(id) => void handleRemover(id)}
            />
          ))}
        </Stack>
      )}

      <DialogCalibrar
        key={recipienteParaCalibrar?.id ?? 'closed'}
        recipiente={recipienteParaCalibrar}
        dispositivoId={dispositivoId}
        onConcluido={() => {
          setRecipienteParaCalibrar(null);
          reload();
        }}
        onFechar={() => setRecipienteParaCalibrar(null)}
      />
    </Layout>
  );
}
