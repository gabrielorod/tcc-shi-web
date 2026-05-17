import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import type { LogHidratacao } from '../../types';

interface UltimosGolesProps {
  logs: LogHidratacao[];
}

function formatarHora(data: string): string {
  return new Date(data).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function UltimosGoles({ logs }: UltimosGolesProps) {
  const ultimos = logs.slice(0, 5);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
          Últimos goles
        </Typography>

        {ultimos.length === 0 ? (
          <Typography sx={{ color: 'text.secondary', py: 2, textAlign: 'center' }}>
            Nenhum gole registrado hoje
          </Typography>
        ) : (
          <List disablePadding>
            {ultimos.map((log, index) => (
              <Box key={log.id}>
                <ListItem disablePadding sx={{ py: 1 }}>
                  <Box sx={{ color: 'primary.main', mr: 2, display: 'flex' }}>
                    <WaterDropIcon fontSize="small" />
                  </Box>
                  <ListItemText
                    primary={`${Math.round(log.quantidadeMl)} ml`}
                    secondary={formatarHora(log.registradoEm)}
                    slotProps={{ primary: { sx: { fontWeight: 600 } } }}
                  />
                </ListItem>
                {index < ultimos.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
