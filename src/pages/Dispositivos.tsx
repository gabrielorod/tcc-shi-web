import { useState, useEffect } from 'react';
import { Box, Button, Stack, Typography, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DevicesIcon from '@mui/icons-material/Devices';
import { Layout } from '../components/Layout';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorAlert } from '../components/ErrorAlert';
import { EmptyState } from '../components/EmptyState';
import { DispositivoInfo } from '../components/dispositivos/DispositivoInfo';
import { SelecionarRecipienteCard } from '../components/dispositivos/SelecionarRecipienteCard';
import { dispositivosService } from '../services/dispositivosService';
import { recipientesService } from '../services/recipientesService';
import type { Dispositivo, Recipiente } from '../types';
import { useUser } from '../hooks/useApi';

const DISPOSITIVO_KEY = 'dispositivoId';

export function Dispositivos() {
  const { usuarioId } = useUser();

  const [dispositivo, setDispositivo] = useState<Dispositivo | null>(null);
  const [recipientes, setRecipientes] = useState<Recipiente[]>([]);
  const [recipienteAtivo, setRecipienteAtivo] = useState<Recipiente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [criando, setCriando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    if (!usuarioId) return;

    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const recRes = await recipientesService.listar(usuarioId);
        if (cancelled) return;
        setRecipientes(recRes.data);

        const dispositivoId = localStorage.getItem(DISPOSITIVO_KEY);
        if (dispositivoId) {
          try {
            const res = await dispositivosService.buscar(dispositivoId);
            if (cancelled) return;
            setDispositivo(res.data);
            if (res.data.recipienteAtivoId) {
              const ativo = recRes.data.find((r) => r.id === res.data.recipienteAtivoId) ?? null;
              setRecipienteAtivo(ativo);
            }
          } catch {
            localStorage.removeItem(DISPOSITIVO_KEY);
            if (!cancelled) setDispositivo(null);
          }
        }
      } catch {
        if (!cancelled) setError('Erro ao carregar dados');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [usuarioId]);

  const handleCriarDispositivo = async () => {
    setCriando(true);
    setError(null);
    try {
      const res = await dispositivosService.criar(usuarioId!);
      localStorage.setItem(DISPOSITIVO_KEY, res.data.id);
      setDispositivo(res.data);
    } catch {
      setError('Erro ao registrar dispositivo');
    } finally {
      setCriando(false);
    }
  };

  const handleSelecionarRecipiente = async (recipienteId: string) => {
    if (!dispositivo) return;
    const res = await dispositivosService.selecionarRecipiente(dispositivo.id, recipienteId);
    setDispositivo(res.data);
    const ativo = recipientes.find((r) => r.id === recipienteId) ?? null;
    setRecipienteAtivo(ativo);
    setSucesso(true);
    setTimeout(() => setSucesso(false), 3000);
  };

  return (
    <Layout title="Dispositivo">
      {loading && <LoadingSpinner message="Carregando dispositivo..." />}
      {error && <ErrorAlert message={error} />}

      {!loading && !dispositivo && (
        <EmptyState
          icon={<DevicesIcon sx={{ fontSize: 64 }} />}
          title="Nenhum dispositivo registrado"
          description="Registre seu ESP32 para começar a monitorar sua hidratação automaticamente"
          action={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => void handleCriarDispositivo()}
              disabled={criando}
            >
              {criando ? 'Registrando...' : 'Registrar dispositivo'}
            </Button>
          }
        />
      )}

      {!loading && dispositivo && (
        <Stack spacing={2}>
          {sucesso && (
            <Alert severity="success">
              Recipiente selecionado com sucesso! A balança já está pronta para uso.
            </Alert>
          )}

          <DispositivoInfo dispositivo={dispositivo} recipienteAtivo={recipienteAtivo} />

          <SelecionarRecipienteCard
            recipientes={recipientes}
            recipienteAtivoId={dispositivo.recipienteAtivoId}
            onSalvar={handleSelecionarRecipiente}
          />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              ID do dispositivo: {dispositivo.id}
            </Typography>
          </Box>
        </Stack>
      )}
    </Layout>
  );
}
