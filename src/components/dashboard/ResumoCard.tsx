import { Card, CardContent, Typography, Box } from '@mui/material';
import type { ReactNode } from 'react';

interface ResumoCardProps {
  titulo: string;
  totalMl: number;
  quantidadeLogs: number;
  icon: ReactNode;
}

export function ResumoCard({ titulo, totalMl, quantidadeLogs, icon }: ResumoCardProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Box sx={{ color: 'primary.main' }}>{icon}</Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            {titulo}
          </Typography>
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {Math.round(totalMl)} ml
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {quantidadeLogs} {quantidadeLogs === 1 ? 'gole' : 'goles'}
        </Typography>
      </CardContent>
    </Card>
  );
}
