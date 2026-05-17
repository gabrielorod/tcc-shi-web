import { Box, TextField, Button, Stack, Typography, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { ErrorAlert } from '../ErrorAlert';

const INTERVALOS = [
  { label: '30 minutos', value: 30 },
  { label: '1 hora', value: 60 },
  { label: '1 hora e 30 minutos', value: 90 },
  { label: '2 horas', value: 120 },
  { label: '3 horas', value: 180 },
  { label: '4 horas', value: 240 },
];

interface FormNovoLembreteProps {
  onSalvar: (intervaloMinutos: number) => Promise<void>;
  onCancelar: () => void;
}

export function FormNovoLembrete({ onSalvar, onCancelar }: FormNovoLembreteProps) {
  const [intervalo, setIntervalo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!intervalo) {
      setError('Selecione um intervalo');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await onSalvar(parseInt(intervalo));
    } catch {
      setError('Erro ao criar lembrete. Tente novamente.');
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        Novo lembrete
      </Typography>

      {error && <ErrorAlert message={error} />}

      <Stack spacing={2}>
        <TextField
          label="Lembrar a cada"
          fullWidth
          select
          value={intervalo}
          onChange={(e) => setIntervalo(e.target.value)}
          helperText="Você será alertado se não beber água nesse período"
        >
          {INTERVALOS.map((i) => (
            <MenuItem key={i.value} value={i.value}>
              {i.label}
            </MenuItem>
          ))}
        </TextField>

        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => void handleSubmit()}
          disabled={submitting}
        >
          {submitting ? 'Criando...' : 'Criar lembrete'}
        </Button>

        <Button fullWidth variant="text" onClick={onCancelar}>
          Cancelar
        </Button>
      </Stack>
    </Box>
  );
}
