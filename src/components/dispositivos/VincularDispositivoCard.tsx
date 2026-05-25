import { Card, CardContent, Typography, TextField, Button, Stack } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import { useState } from 'react';
import { ErrorAlert } from '../ErrorAlert';

interface VincularDispositivoCardProps {
  onVincular: (token: string) => Promise<void>;
}

export function VincularDispositivoCard({ onVincular }: VincularDispositivoCardProps) {
  const [token, setToken] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!token.trim()) {
      setError('Digite o token do dispositivo');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await onVincular(token.trim());
    } catch {
      setError('Token inválido. Verifique o token gravado no ESP32.');
      setSubmitting(false);
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
          Vincular dispositivo
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          Digite o token gravado no firmware do ESP32
        </Typography>

        {error && <ErrorAlert message={error} />}

        <Stack spacing={2}>
          <TextField
            label="Token do dispositivo"
            fullWidth
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ex: c75b8c99-0872-439e-bcf3-..."
            slotProps={{ input: { style: { fontFamily: 'monospace', fontSize: 13 } } }}
          />
          <Button
            fullWidth
            variant="contained"
            startIcon={<LinkIcon />}
            onClick={() => void handleSubmit()}
            disabled={submitting}
          >
            {submitting ? 'Vinculando...' : 'Vincular'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
