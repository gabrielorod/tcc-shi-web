import { Box, TextField, MenuItem, Button, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { ErrorAlert } from '../ErrorAlert';

interface FormData {
  nome: string;
  tipo: string;
}

interface FormNovoRecipienteProps {
  onSalvar: (data: FormData) => Promise<void>;
  onCancelar: () => void;
}

export function FormNovoRecipiente({ onSalvar, onCancelar }: FormNovoRecipienteProps) {
  const [form, setForm] = useState<FormData>({ nome: '', tipo: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!form.nome || !form.tipo) {
      setError('Preencha todos os campos');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await onSalvar(form);
    } catch {
      setError('Erro ao criar recipiente. Tente novamente.');
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        Novo recipiente
      </Typography>

      {error && <ErrorAlert message={error} />}

      <Stack spacing={2}>
        <TextField
          label="Nome"
          fullWidth
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          placeholder="Ex: Garrafa Stanley"
        />
        <TextField
          label="Tipo"
          fullWidth
          select
          value={form.tipo}
          onChange={(e) => setForm({ ...form, tipo: e.target.value })}
        >
          <MenuItem value="COPO">Copo</MenuItem>
          <MenuItem value="GARRAFA">Garrafa</MenuItem>
          <MenuItem value="CANECA">Caneca</MenuItem>
        </TextField>

        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => void handleSubmit()}
          disabled={submitting}
        >
          {submitting ? 'Criando...' : 'Criar recipiente'}
        </Button>

        <Button fullWidth variant="text" onClick={onCancelar}>
          Cancelar
        </Button>
      </Stack>
    </Box>
  );
}
