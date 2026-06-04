import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import ScaleIcon from '@mui/icons-material/Scale';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useState } from 'react';
import { useHidratacaoSocket } from '../../hooks/useHidratacaoSocket';
import { dispositivosService } from '../../services/dispositivosService';

type Status = 'idle' | 'aguardando' | 'concluido' | 'erro';

interface DialogCalibrarBalancaProps {
  aberto: boolean;
  dispositivoId: string;
  onFechar: () => void;
}

export function DialogCalibrarBalanca({
  aberto,
  dispositivoId,
  onFechar,
}: DialogCalibrarBalancaProps) {
  const [pesoConhecido, setPesoConhecido] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [mensagem, setMensagem] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useHidratacaoSocket({
    onCalibracaoStatus: (statusRecebido) => {
      if (!aberto) return;
      if (statusRecebido === 'ok') {
        setStatus('concluido');
      } else if (statusRecebido.startsWith('Erro')) {
        setStatus('erro');
        setMensagem(statusRecebido);
      } else {
        setStatus('aguardando');
        setMensagem(statusRecebido);
      }
    },
  });

  const handleIniciar = async () => {
    if (!pesoConhecido || parseInt(pesoConhecido) <= 0) {
      setError('Informe o peso conhecido em gramas');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await dispositivosService.iniciarCalibracaoBalanca(dispositivoId, parseInt(pesoConhecido));
      setStatus('aguardando');
      setMensagem('Retire tudo da balança e aguarde a leitura da tara...');
    } catch {
      setError('Erro ao enviar comando. Verifique se o dispositivo está online.');
      setSubmitting(false);
    }
  };

  const handleFechar = () => {
    setStatus('idle');
    setMensagem('');
    setPesoConhecido('');
    setError(null);
    setSubmitting(false);
    onFechar();
  };

  return (
    <Dialog open={aberto} onClose={handleFechar} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ScaleIcon color="primary" />
        Calibrar balança
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {status === 'idle' && (
            <Box>
              <Alert severity="info" sx={{ mb: 2 }}>
                A calibração ajusta a precisão do sensor. Use um peso conhecido como 1kg de açúcar
                ou 2kg de arroz.
              </Alert>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <TextField
                label="Peso conhecido (g)"
                fullWidth
                type="number"
                value={pesoConhecido}
                onChange={(e) => setPesoConhecido(e.target.value)}
                placeholder="Ex: 2000 para 2kg de arroz"
                autoFocus
              />
            </Box>
          )}

          {status === 'aguardando' && (
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
                Balança calibrada com sucesso!
              </Typography>
            </Box>
          )}

          {status === 'erro' && <Alert severity="error">{mensagem}</Alert>}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleFechar}>{status === 'concluido' ? 'Fechar' : 'Cancelar'}</Button>
        {status === 'idle' && (
          <Button variant="contained" onClick={() => void handleIniciar()} disabled={submitting}>
            {submitting ? 'Iniciando...' : 'Iniciar calibração'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
