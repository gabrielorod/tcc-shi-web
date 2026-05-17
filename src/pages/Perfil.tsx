import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Stack,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import SaveIcon from '@mui/icons-material/Save';
import { Layout } from '../components/Layout';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorAlert } from '../components/ErrorAlert';
import api from '../services/api';
import { useUser } from '../hooks/useApi';

interface FormData {
  nome: string;
  pesoKg: string;
  alturaCm: string;
  sexo: string;
  metaDiariaMl: string;
}

export function Perfil() {
  const { usuario, clearUsuario, setUsuarioId } = useUser();

  const [form, setForm] = useState<FormData>({
    nome: usuario?.nome ?? '',
    pesoKg: String(usuario?.pesoKg ?? ''),
    alturaCm: String(usuario?.alturaCm ?? ''),
    sexo: usuario?.sexo ?? '',
    metaDiariaMl: String(usuario?.metaDiariaMl ?? ''),
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogAberto, setDialogAberto] = useState(false);

  if (!usuario) return <LoadingSpinner />;

  const metaSugerida = form.pesoKg ? Math.round(parseFloat(form.pesoKg) * 35) : 0;

  const handleSalvar = async () => {
    if (!form.nome || !form.pesoKg || !form.alturaCm || !form.sexo) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await api.patch(`/usuarios/${usuario.id}`, {
        nome: form.nome,
        pesoKg: parseFloat(form.pesoKg),
        alturaCm: parseFloat(form.alturaCm),
        sexo: form.sexo,
        metaDiariaMl: parseFloat(form.metaDiariaMl) || metaSugerida,
      });

      setSuccess(true);
      setUsuarioId(usuario.id); // Recarrega os dados do usuário no contexto
    } catch {
      setError('Erro ao salvar. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title="Perfil">
      <Stack spacing={2}>
        {/* Avatar e nome */}
        <Card elevation={2}>
          <CardContent
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}
          >
            <Avatar sx={{ width: 72, height: 72, bgcolor: 'primary.main', mb: 2 }}>
              <PersonIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {usuario.nome}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Meta: {usuario.metaDiariaMl} ml/dia
            </Typography>
          </CardContent>
        </Card>

        {/* Formulário */}
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Editar dados
            </Typography>

            {error && <ErrorAlert message={error} />}
            {success && (
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ color: 'success.main', fontWeight: 500 }}>
                  ✓ Dados salvos com sucesso!
                </Typography>
              </Box>
            )}

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
                helperText={
                  form.pesoKg ? `Meta sugerida pela OMS: ${metaSugerida} ml/dia` : undefined
                }
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
              <TextField
                label="Meta diária (ml)"
                fullWidth
                type="number"
                value={form.metaDiariaMl}
                onChange={(e) => setForm({ ...form, metaDiariaMl: e.target.value })}
                helperText="Deixe em branco para usar a meta calculada pelo peso"
              />

              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                onClick={() => void handleSalvar()}
                disabled={submitting}
              >
                {submitting ? 'Salvando...' : 'Salvar alterações'}
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Trocar usuário */}
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Conta
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              Trocar para outro perfil ou criar um novo
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={() => setDialogAberto(true)}
            >
              Trocar perfil
            </Button>
          </CardContent>
        </Card>
      </Stack>

      {/* Dialog de confirmação */}
      <Dialog open={dialogAberto} onClose={() => setDialogAberto(false)}>
        <DialogTitle>Trocar perfil?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Você será redirecionado para a tela de seleção de perfil. Seus dados não serão perdidos.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogAberto(false)}>Cancelar</Button>
          <Button
            color="error"
            onClick={() => {
              setDialogAberto(false);
              clearUsuario();
            }}
          >
            Trocar
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
