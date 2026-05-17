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
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import { useState } from 'react';
import { ErrorAlert } from '../ErrorAlert';
import type { Recipiente } from '../../types';

interface DialogCalibrarProps {
  recipiente: Recipiente | null;
  onConfirmar: (id: string, pesoVazioG: number) => Promise<void>;
  onFechar: () => void;
}

export function DialogCalibrar({ recipiente, onConfirmar, onFechar }: DialogCalibrarProps) {
  const [pesoVazio, setPesoVazio] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirmar = async () => {
    if (!pesoVazio || parseFloat(pesoVazio) <= 0) {
      setError('Informe o peso vazio em gramas');
      return;
    }

    if (!recipiente) return;

    setSubmitting(true);
    setError(null);

    try {
      await onConfirmar(recipiente.id, parseFloat(pesoVazio));
      setPesoVazio('');
      onFechar();
    } catch {
      setError('Erro ao calibrar. Tente novamente.');
      setSubmitting(false);
    }
  };

  const handleFechar = () => {
    setPesoVazio('');
    setError(null);
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
          <Box
            sx={{
              bgcolor: 'info.light',
              borderRadius: 2,
              p: 2,
            }}
          >
            <Typography variant="body2" sx={{ color: 'info.dark' }}>
              📋 Como calibrar:
            </Typography>
            <Typography variant="body2" sx={{ color: 'info.dark', mt: 0.5 }}>
              1. Coloque o recipiente <strong>vazio</strong> na balança
            </Typography>
            <Typography variant="body2" sx={{ color: 'info.dark' }}>
              2. Anote o peso exibido
            </Typography>
            <Typography variant="body2" sx={{ color: 'info.dark' }}>
              3. Digite o valor abaixo e salve
            </Typography>
          </Box>

          {error && <ErrorAlert message={error} />}

          <TextField
            label="Peso vazio (g)"
            fullWidth
            type="number"
            value={pesoVazio}
            onChange={(e) => setPesoVazio(e.target.value)}
            placeholder="Ex: 385"
            helperText={`Calibrando: ${recipiente?.nome ?? ''}`}
            autoFocus
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleFechar}>Cancelar</Button>
        <Button variant="contained" onClick={() => void handleConfirmar()} disabled={submitting}>
          {submitting ? 'Salvando...' : 'Salvar calibração'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
