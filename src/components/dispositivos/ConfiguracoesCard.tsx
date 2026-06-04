import {
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  Stack,
  Grid,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from 'react';

const INTERVALOS = [
  { label: '15 minutos', value: 15 },
  { label: '30 minutos', value: 30 },
  { label: '45 minutos', value: 45 },
  { label: '1 hora', value: 60 },
  { label: '1 hora e 30 minutos', value: 90 },
  { label: '2 horas', value: 120 },
];

interface ConfiguracoesCardProps {
  gracePeriodMinutos: number;
  horarioAcordar: number;
  horarioDormir: number;
  onSalvar: (
    gracePeriodMinutos: number,
    horarioAcordar: number,
    horarioDormir: number,
  ) => Promise<void>;
}

export function ConfiguracoesCard({
  gracePeriodMinutos,
  horarioAcordar,
  horarioDormir,
  onSalvar,
}: ConfiguracoesCardProps) {
  const [intervalo, setIntervalo] = useState(gracePeriodMinutos);
  const [acordar, setAcordar] = useState(horarioAcordar);
  const [dormir, setDormir] = useState(horarioDormir);
  const [submitting, setSubmitting] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const handleSalvar = async () => {
    setSubmitting(true);
    setSucesso(false);
    try {
      await onSalvar(intervalo, acordar, dormir);
      setSucesso(true);
      setTimeout(() => setSucesso(false), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const HORAS = Array.from({ length: 24 }, (_, i) => ({
    label: `${String(i).padStart(2, '0')}:00`,
    value: i,
  }));

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            mb: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <SettingsIcon fontSize="small" color="primary" />
          Configurações
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          Defina quando a balança deve monitorar e alertar sobre sua hidratação
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Alertar se não beber água a cada"
            fullWidth
            select
            value={intervalo}
            onChange={(e) => setIntervalo(Number(e.target.value))}
          >
            {INTERVALOS.map((i) => (
              <MenuItem key={i.value} value={i.value}>
                {i.label}
              </MenuItem>
            ))}
          </TextField>

          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <TextField
                label="Horário de acordar"
                fullWidth
                select
                value={acordar}
                onChange={(e) => setAcordar(Number(e.target.value))}
                helperText="Início do monitoramento"
              >
                {HORAS.map((h) => (
                  <MenuItem key={h.value} value={h.value}>
                    {h.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                label="Horário de dormir"
                fullWidth
                select
                value={dormir}
                onChange={(e) => setDormir(Number(e.target.value))}
                helperText="Fim do monitoramento"
              >
                {HORAS.map((h) => (
                  <MenuItem key={h.value} value={h.value}>
                    {h.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          {sucesso && (
            <Typography sx={{ color: 'success.main', fontWeight: 500 }}>
              ✓ Configurações salvas!
            </Typography>
          )}

          <Button
            fullWidth
            variant="contained"
            onClick={() => void handleSalvar()}
            disabled={submitting}
          >
            {submitting ? 'Salvando...' : 'Salvar configurações'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
