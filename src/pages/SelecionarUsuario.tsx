import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActionArea,
  TextField,
  MenuItem,
  Divider,
  Avatar,
  Stack,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorAlert } from '../components/ErrorAlert';
import type { Usuario } from '../types';
import api from '../services/api';
import { useUser } from '../hooks/useApi';

interface FormData {
  nome: string;
  pesoKg: string;
  alturaCm: string;
  sexo: string;
}

const INITIAL_FORM: FormData = {
  nome: '',
  pesoKg: '',
  alturaCm: '',
  sexo: '',
};

export function SelecionarUsuario() {
  const { setUsuarioId } = useUser();

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Usuario[]>('/usuarios')
      .then((res) => setUsuarios(res.data))
      .catch(() => setError('Erro ao carregar usuários'))
      .finally(() => setLoadingUsuarios(false));
  }, []);

  const handleSelecionar = (id: string) => {
    setUsuarioId(id);
  };

  const handleSubmit = async () => {
    if (!form.nome || !form.pesoKg || !form.alturaCm || !form.sexo) {
      setError('Preencha todos os campos');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await api.post<Usuario>('/usuarios', {
        nome: form.nome,
        pesoKg: parseFloat(form.pesoKg),
        alturaCm: parseFloat(form.alturaCm),
        sexo: form.sexo,
      });
      setUsuarioId(res.data.id);
    } catch {
      setError('Erro ao criar usuário. Tente novamente.');
      setSubmitting(false);
    }
  };

  if (loadingUsuarios) return <LoadingSpinner message="Carregando usuários..." />;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        gap: 3,
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
          💧 SHI
        </Typography>
        <Typography sx={{ color: 'text.secondary', mt: 1 }}>
          Sistema de Hidratação Inteligente
        </Typography>
      </Box>

      <Box sx={{ width: '100%', maxWidth: 480 }}>
        {error && <ErrorAlert message={error} />}

        {!showForm && (
          <>
            {usuarios.length > 0 && (
              <>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Selecione seu perfil
                </Typography>
                <Stack spacing={1.5} sx={{ mb: 3 }}>
                  {usuarios.map((u) => (
                    <Card key={u.id} variant="outlined">
                      <CardActionArea onClick={() => handleSelecionar(u.id)}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <PersonIcon />
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontWeight: 600 }}>{u.nome}</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              Meta: {u.metaDiariaMl}ml/dia · {u.pesoKg}kg
                            </Typography>
                          </Box>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  ))}
                </Stack>
                <Divider sx={{ mb: 3 }}>ou</Divider>
              </>
            )}

            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => setShowForm(true)}
            >
              Criar novo perfil
            </Button>
          </>
        )}

        {showForm && (
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Novo perfil
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Nome"
                fullWidth
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
              />
              <TextField
                label="Peso (kg)"
                fullWidth
                type="number"
                value={form.pesoKg}
                onChange={(e) => setForm({ ...form, pesoKg: e.target.value })}
                helperText="Usado para calcular sua meta diária"
              />
              <TextField
                label="Altura (cm)"
                fullWidth
                type="number"
                value={form.alturaCm}
                onChange={(e) => setForm({ ...form, alturaCm: e.target.value })}
              />
              <TextField
                label="Sexo"
                fullWidth
                select
                value={form.sexo}
                onChange={(e) => setForm({ ...form, sexo: e.target.value })}
              >
                <MenuItem value="MASCULINO">Masculino</MenuItem>
                <MenuItem value="FEMININO">Feminino</MenuItem>
                <MenuItem value="OUTRO">Outro</MenuItem>
              </TextField>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => void handleSubmit()}
                disabled={submitting}
              >
                {submitting ? 'Criando...' : 'Criar perfil'}
              </Button>

              {usuarios.length > 0 && (
                <Button
                  fullWidth
                  variant="text"
                  onClick={() => {
                    setShowForm(false);
                    setError(null);
                  }}
                >
                  Voltar
                </Button>
              )}
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  );
}
