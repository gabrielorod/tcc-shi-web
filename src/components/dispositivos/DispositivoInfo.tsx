import { Card, CardContent, Box, Typography, Chip, Divider, Stack } from '@mui/material';
import DevicesIcon from '@mui/icons-material/Devices';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import type { Dispositivo, Recipiente } from '../../types';

interface DispositivoInfoProps {
  dispositivo: Dispositivo;
  recipienteAtivo: Recipiente | null;
}

function formatarData(data: string | null): string {
  if (!data) return 'Nunca';
  return new Date(data).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function isOnline(ultimoPingEm: string | null): boolean {
  if (!ultimoPingEm) return false;
  const diff = Date.now() - new Date(ultimoPingEm).getTime();
  return diff < 60000; // Online se pingou nos últimos 60 segundos
}

export function DispositivoInfo({ dispositivo, recipienteAtivo }: DispositivoInfoProps) {
  const online = isOnline(dispositivo.ultimoPingEm);

  return (
    <Card elevation={2}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <DevicesIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
            Dispositivo ESP32
          </Typography>
          <Chip
            icon={online ? <WifiIcon /> : <WifiOffIcon />}
            label={online ? 'Online' : 'Offline'}
            color={online ? 'success' : 'default'}
            size="small"
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Stack spacing={1.5}>
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Token de acesso
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'monospace',
                bgcolor: 'action.hover',
                p: 1,
                borderRadius: 1,
                mt: 0.5,
                wordBreak: 'break-all',
                fontSize: 12,
              }}
            >
              {dispositivo.tokenAcesso}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Último ping
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {formatarData(dispositivo.ultimoPingEm)}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Peso atual na mesa
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {dispositivo.pesoAtualNaMesaG}g
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Recipiente ativo
            </Typography>
            {recipienteAtivo ? (
              <Chip label={recipienteAtivo.nome} color="primary" size="small" sx={{ mt: 0.5 }} />
            ) : (
              <Typography variant="body2" sx={{ color: 'warning.main', fontWeight: 500 }}>
                Nenhum selecionado
              </Typography>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
