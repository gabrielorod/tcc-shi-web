import { Card, CardContent, Box, Typography, Chip, IconButton, Tooltip } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';
import type { Recipiente } from '../../types';

const TIPO_ICONS = {
  COPO: <LocalCafeIcon />,
  GARRAFA: <LocalBarIcon />,
  CANECA: <EmojiFoodBeverageIcon />,
};

const TIPO_LABELS = {
  COPO: 'Copo',
  GARRAFA: 'Garrafa',
  CANECA: 'Caneca',
};

interface RecipienteCardProps {
  recipiente: Recipiente;
  onCalibrar: (recipiente: Recipiente) => void;
  onRemover: (id: string) => void;
}

export function RecipienteCard({ recipiente, onCalibrar, onRemover }: RecipienteCardProps) {
  const calibrado = recipiente.pesoVazioG > 0;

  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ color: 'primary.main', display: 'flex' }}>{TIPO_ICONS[recipiente.tipo]}</Box>
            <Box>
              <Typography sx={{ fontWeight: 600 }}>{recipiente.nome}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {TIPO_LABELS[recipiente.tipo]}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tooltip title="Calibrar">
              <IconButton onClick={() => onCalibrar(recipiente)} size="small">
                <TuneIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Remover">
              <IconButton onClick={() => onRemover(recipiente.id)} size="small" color="error">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ mt: 1.5 }}>
          {calibrado ? (
            <Chip
              label={`Calibrado: ${recipiente.pesoVazioG}g vazio`}
              color="success"
              size="small"
            />
          ) : (
            <Chip label="Não calibrado" color="warning" size="small" />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
