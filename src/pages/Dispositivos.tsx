import { useState, useEffect } from 'react';
import { Box, Button, Stack, Alert } from '@mui/material';
import DevicesIcon from '@mui/icons-material/Devices';
import PersonIcon from '@mui/icons-material/Person';
import { Layout } from '../components/Layout';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorAlert } from '../components/ErrorAlert';
import { EmptyState } from '../components/EmptyState';
import { DispositivoInfo } from '../components/dispositivos/DispositivoInfo';
import { SelecionarRecipienteCard } from '../components/dispositivos/SelecionarRecipienteCard';
import { VincularDispositivoCard } from '../components/dispositivos/VincularDispositivoCard';
import { ConfiguracoesCard } from '../components/dispositivos/ConfiguracoesCard';
import { dispositivosService } from '../services/dispositivosService';
import { recipientesService } from '../services/recipientesService';
import type { Dispositivo, Recipiente } from '../types';
import { useUser } from '../hooks/useUser';
import { DialogCalibrarBalanca } from '../components/dispositivos/DialogCalibrarBalanca';
import ScaleIcon from '@mui/icons-material/Scale';

const getDispositivoKey = (usuarioId: string) => `dispositivoId_${usuarioId}`;

export function Dispositivos() {
  const { usuarioId } = useUser();

  const [dispositivo, setDispositivo] = useState<Dispositivo | null>(null);
  const [recipientes, setRecipientes] = useState<Recipiente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [calibrarBalancaAberto, setCalibrarBalancaAberto] = useState(false);

  const reload = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    if (!usuarioId) return;
    let cancelled = false;

    async function carregar() {
      setLoading(true);
      setError(null);

      try {
        const recRes = await recipientesService.listar(usuarioId!);
        if (cancelled) return;
        setRecipientes(recRes.data);

        const dispositivoId = localStorage.getItem(getDispositivoKey(usuarioId!));
        if (dispositivoId) {
          try {
            const res = await dispositivosService.buscar(dispositivoId);
            if (!cancelled) setDispositivo(res.data);
          } catch {
            localStorage.removeItem(getDispositivoKey(usuarioId!));
            if (!cancelled) setDispositivo(null);
          }
        }
      } catch {
        if (!cancelled) setError('Erro ao carregar dados');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void carregar();
    return () => {
      cancelled = true;
    };
  }, [usuarioId, refreshKey]);

  const mostrarSucesso = (msg: string) => {
    setSucesso(msg);
    setTimeout(() => setSucesso(null), 3000);
  };

  const handleVincular = async (token: string) => {
    const res = await dispositivosService.vincular(token, usuarioId!);
    localStorage.setItem(getDispositivoKey(usuarioId!), res.data.id);
    setDispositivo(res.data);
    mostrarSucesso('Dispositivo vinculado com sucesso!');
  };

  const handleUsarAgora = async () => {
    if (!dispositivo) return;
    const res = await dispositivosService.usarAgora(dispositivo.id, usuarioId!);
    setDispositivo(res.data);
    mostrarSucesso('Você agora é o usuário ativo neste dispositivo!');
  };

  const handleSelecionarRecipiente = async (recipienteId: string) => {
    if (!dispositivo) return;
    const res = await dispositivosService.selecionarRecipiente(dispositivo.id, recipienteId);
    setDispositivo(res.data);
    mostrarSucesso('Recipiente selecionado! A balança está pronta para uso.');
  };

  const handleAtualizarConfiguracoes = async (
    gracePeriodMinutos: number,
    horarioAcordar: number,
    horarioDormir: number,
  ) => {
    if (!dispositivo) return;
    const res = await dispositivosService.atualizarConfiguracoes(
      dispositivo.id,
      gracePeriodMinutos,
      horarioAcordar,
      horarioDormir,
    );
    setDispositivo(res.data);
  };

  const isUsuarioAtivo = dispositivo?.usuarioAtivoId === usuarioId;

  return (
    <Layout title="Dispositivo">
      {loading && <LoadingSpinner message="Carregando dispositivo..." />}
      {error && <ErrorAlert message={error} />}

      {sucesso && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {sucesso}
        </Alert>
      )}

      {!loading && !dispositivo && (
        <EmptyState
          icon={<DevicesIcon sx={{ fontSize: 64 }} />}
          title="Nenhum dispositivo vinculado"
          description="Digite o token gravado no firmware do ESP32 para vincular seu dispositivo"
          action={
            <Box sx={{ width: '100%', maxWidth: 400 }}>
              <VincularDispositivoCard onVincular={handleVincular} />
            </Box>
          }
        />
      )}

      {!loading && dispositivo && (
        <Stack spacing={2}>
          <DispositivoInfo
            dispositivo={dispositivo}
            recipienteAtivo={dispositivo.recipienteAtivo ?? null}
          />

          {!isUsuarioAtivo && (
            <>
              <Alert
                severity="info"
                action={
                  <Button
                    color="inherit"
                    size="small"
                    startIcon={<PersonIcon />}
                    onClick={() => void handleUsarAgora()}
                  >
                    Usar agora
                  </Button>
                }
              >
                {dispositivo.usuarioAtivo
                  ? `${dispositivo.usuarioAtivo.nome} está usando este dispositivo`
                  : 'Nenhum usuário ativo neste dispositivo'}
              </Alert>
            </>
          )}

          {isUsuarioAtivo && (
            <>
              <SelecionarRecipienteCard
                recipientes={recipientes}
                recipienteAtivoId={dispositivo.recipienteAtivoId}
                onSalvar={handleSelecionarRecipiente}
              />
              <ConfiguracoesCard
                gracePeriodMinutos={dispositivo.gracePeriodMinutos}
                horarioAcordar={dispositivo.horarioAcordar}
                horarioDormir={dispositivo.horarioDormir}
                onSalvar={async (gracePeriodMinutos, horarioAcordar, horarioDormir) => {
                  await handleAtualizarConfiguracoes(
                    gracePeriodMinutos,
                    horarioAcordar,
                    horarioDormir,
                  );
                }}
              />

              <Button
                fullWidth
                variant="outlined"
                color="warning"
                startIcon={<ScaleIcon />}
                onClick={() => setCalibrarBalancaAberto(true)}
              >
                Calibrar balança
              </Button>
            </>
          )}

          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="text"
              size="small"
              sx={{ color: 'text.secondary' }}
              onClick={() => {
                localStorage.removeItem(getDispositivoKey(usuarioId!));
                setDispositivo(null);
                reload();
              }}
            >
              Vincular outro dispositivo
            </Button>
          </Box>
        </Stack>
      )}
      {dispositivo && (
        <DialogCalibrarBalanca
          aberto={calibrarBalancaAberto}
          dispositivoId={dispositivo.id}
          onFechar={() => setCalibrarBalancaAberto(false)}
        />
      )}
    </Layout>
  );
}
