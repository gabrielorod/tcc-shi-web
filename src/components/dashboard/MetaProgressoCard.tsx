import { Box, Card, CardContent, Typography, LinearProgress, Chip } from '@mui/material';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

interface MetaProgressoCardProps {
  totalMl: number;
  metaMl: number;
  percentual: number;
}

function getStatusColor(percentual: number): 'error' | 'warning' | 'success' {
  if (percentual < 40) return 'error';
  if (percentual < 70) return 'warning';
  return 'success';
}

function getStatusLabel(percentual: number): string {
  if (percentual < 40) return 'Beba água! 🚨';
  if (percentual < 70) return 'Quase lá 🟡';
  if (percentual < 100) return 'Ótimo ritmo! 🟢';
  return 'Meta batida! 🎉';
}

export function MetaProgressoCard({ totalMl, metaMl, percentual }: MetaProgressoCardProps) {
  const color = getStatusColor(percentual);

  return (
    <Card elevation={2}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WaterDropIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Progresso de hoje
            </Typography>
          </Box>
          <Chip label={getStatusLabel(percentual)} color={color} size="small" />
        </Box>

        <Box sx={{ textAlign: 'center', my: 3 }}>
          <Typography variant="h2" sx={{ fontWeight: 700, color: `${color}.main` }}>
            {Math.round(totalMl)}
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>de {Math.round(metaMl)} ml</Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={Math.min(percentual, 100)}
          color={color}
          sx={{ height: 10, borderRadius: 5, mb: 1 }}
        />
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'right' }}>
          {percentual}%
        </Typography>
      </CardContent>
    </Card>
  );
}
