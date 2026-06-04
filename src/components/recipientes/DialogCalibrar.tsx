import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useState } from 'react';
import { useHidratacaoSocket } from '../../hooks/useHidratacaoSocket';
import { dispositivosService } from '../../services/dispositivosService';
import type { Recipiente } from '../../types';

type StatusCalibracao = 'idle' | 'aguardando' | 'lendo' | 'concluido' | 'erro';

interface DialogCalibrarProps {
  recipiente: Recipiente | null;
  dispositivoId: string | null;
  isUsuarioAtivo: boolean;
  onConcluido: () => void;
  onFechar: () => void;
}

export function DialogCalibrar({
  recipiente,
  dispositivoId,
  isUsuarioAtivo,
  onConcluido,
  onFechar,
}: DialogCalibrarProps) {
  const [status, setStatus] = useState<StatusCalibracao>('idle');
  const [mensagem, setMensagem] = useState('');

  useHidratacaoSocket({
    onCalibracaoStatus: (statusRecebido) => {
      if (statusRecebido === 'ok') {
        setStatus('concluido');
        onConcluido();
      } else {
        setStatus('lendo');
        setMensagem(statusRecebido);
      }
    },
  });

  const handleIniciar = async () => {
    if (!dispositivoId) {
      setStatus('erro');
      setMensagem('Nenhum dispositivo vinculado. Vá em Dispositivo e vincule primeiro.');
      return;
    }

    if (!isUsuarioAtivo) {
      setStatus('erro');
      setMensagem(
        'Você não é o usuário ativo neste dispositivo. Vá em Dispositivo e clique em "Usar agora".',
      );
      return;
    }

    setStatus('aguardando');
    setMensagem('Enviando comando ao ESP32...');

    try {
      await dispositivosService.enviarComando(dispositivoId, 'calibrate', recipiente?.id);
      setStatus('lendo');
      setMensagem('Coloque o recipiente VAZIO na balança e aguarde...');
    } catch {
      setStatus('erro');
      setMensagem('Erro ao enviar comando. Verifique se o dispositivo está online.');
    }
  };

  const handleFechar = () => {
    setStatus('idle');
    setMensagem('');
    onFechar();
  };

  return (
    <Dialog open={!!recipiente} onClose={handleFechar} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TuneIcon color="primary" />
        Calibrar recipiente
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {status === 'idle' && (
            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                Calibrando: <strong>{recipiente?.nome}</strong>
              </Typography>
              <Alert severity="info">
                A balança vai ler automaticamente o peso do recipiente vazio. Certifique-se que o
                ESP32 está online antes de continuar.
              </Alert>
            </Box>
          )}

          {(status === 'aguardando' || status === 'lendo') && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {mensagem}
              </Typography>
            </Box>
          )}

          {status === 'concluido' && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
              <Typography variant="body1" sx={{ fontWeight: 600, color: 'success.main' }}>
                {mensagem || 'Calibração concluída com sucesso!'}
              </Typography>
            </Box>
          )}

          {status === 'erro' && <Alert severity="error">{mensagem}</Alert>}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleFechar}>{status === 'concluido' ? 'Fechar' : 'Cancelar'}</Button>
        {status === 'idle' && (
          <Button variant="contained" onClick={() => void handleIniciar()}>
            Iniciar calibração
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
