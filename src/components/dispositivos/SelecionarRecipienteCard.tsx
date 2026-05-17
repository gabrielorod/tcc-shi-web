import { Card, CardContent, Typography, Stack, MenuItem, TextField, Button } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import { useState } from 'react';
import { ErrorAlert } from '../ErrorAlert';
import type { Recipiente } from '../../types';

interface SelecionarRecipienteCardProps {
  recipientes: Recipiente[];
  recipienteAtivoId: string | null;
  onSalvar: (recipienteId: string) => Promise<void>;
}

export function SelecionarRecipienteCard({
  recipientes,
  recipienteAtivoId,
  onSalvar,
}: SelecionarRecipienteCardProps) {
  const [selecionado, setSelecionado] = useState(recipienteAtivoId ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calibrados = recipientes.filter((r) => r.pesoVazioG > 0);

  const handleSalvar = async () => {
    if (!selecionado) {
      setError('Selecione um recipiente');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await onSalvar(selecionado);
    } catch {
      setError('Erro ao selecionar recipiente. Verifique se ele está calibrado.');
      setSubmitting(false);
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Recipiente na balança
        </Typography>

        {error && <ErrorAlert message={error} />}

        {calibrados.length === 0 ? (
          <Typography variant="body2" sx={{ color: 'warning.main' }}>
            Nenhum recipiente calibrado. Vá em Recipientes e calibre antes de continuar.
          </Typography>
        ) : (
          <Stack spacing={2}>
            <TextField
              label="Selecionar recipiente"
              fullWidth
              select
              value={selecionado}
              onChange={(e) => setSelecionado(e.target.value)}
              helperText="Apenas recipientes calibrados aparecem aqui"
            >
              {calibrados.map((r) => (
                <MenuItem key={r.id} value={r.id}>
                  {r.nome} — {r.pesoVazioG}g vazio
                </MenuItem>
              ))}
            </TextField>

            <Button
              fullWidth
              variant="contained"
              startIcon={<TuneIcon />}
              onClick={() => void handleSalvar()}
              disabled={submitting}
            >
              {submitting ? 'Salvando...' : 'Confirmar recipiente'}
            </Button>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
