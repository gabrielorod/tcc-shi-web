import {
  Card,
  CardContent,
  Box,
  Typography,
  Switch,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import type { Lembrete } from '../../types';

interface LembreteCardProps {
  lembrete: Lembrete;
  onToggle: (id: string) => void;
  onRemover: (id: string) => void;
}

function formatarIntervalo(minutos: number): string {
  if (minutos < 60) return `A cada ${minutos} minutos`;
  const horas = minutos / 60;
  return horas === 1 ? 'A cada 1 hora' : `A cada ${horas} horas`;
}

function formatarUltimoAlerta(data: string | null): string {
  if (!data) return 'Nunca disparado';
  return new Date(data).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function LembreteCard({ lembrete, onToggle, onRemover }: LembreteCardProps) {
  return (
    <Card variant="outlined" sx={{ opacity: lembrete.ativo ? 1 : 0.6 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ color: lembrete.ativo ? 'primary.main' : 'text.disabled', display: 'flex' }}>
              {lembrete.ativo ? <NotificationsIcon /> : <NotificationsOffIcon />}
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 600 }}>
                {formatarIntervalo(lembrete.intervaloMinutos)}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Último alerta: {formatarUltimoAlerta(lembrete.ultimoAlertaEm)}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Switch
              checked={lembrete.ativo}
              onChange={() => onToggle(lembrete.id)}
              size="small"
              color="primary"
            />
            <Tooltip title="Remover">
              <IconButton onClick={() => onRemover(lembrete.id)} size="small" color="error">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ mt: 1.5 }}>
          <Chip
            label={lembrete.ativo ? 'Ativo' : 'Inativo'}
            color={lembrete.ativo ? 'success' : 'default'}
            size="small"
          />
        </Box>
      </CardContent>
    </Card>
  );
}
